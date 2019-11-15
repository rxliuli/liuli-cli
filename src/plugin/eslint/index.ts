import { resolve } from 'path'
import { copySync } from 'fs-extra'
import pkgJSON from './generator/package.json'
import jestPkgJSON from './generator/jest.package.json'
import prettierPkgJSON from './generator/prettier.package.json'
import { JSPlugin } from '../base/constant'
import { updateJSONFile } from '../../util/updateJSONFile'
import { BasePlugin } from '../base/BasePlugin'
import merge from 'deepmerge'

export class ESLintPlugin extends BasePlugin {
  private eslintName = '.eslintrc'
  private eslintIgnoreName = '.eslintignore'
  constructor() {
    super(JSPlugin.ESLint)
  }
  handle(): void {
    // 修改 JSON 部分
    updateJSONFile(resolve(this.projectDir, 'package.json'), json =>
      merge(json, pkgJSON),
    )
    // 拷贝配置文件
    const genDir = resolve(__dirname, 'generator')
    copySync(
      resolve(genDir, this.eslintName),
      resolve(this.projectDir, this.eslintName),
    )
    copySync(
      resolve(genDir, this.eslintIgnoreName),
      resolve(this.projectDir, this.eslintIgnoreName),
    )
  }
  // 同时集成其他开源组件
  public integrated() {
    if (this.plugins.includes(JSPlugin.Jest)) {
      this.integratedJest()
    }
    if (this.plugins.includes(JSPlugin.Prettier)) {
      this.integratedPrettier()
    }
  }
  // 处理与 jest 的集成
  private integratedJest() {
    updateJSONFile(resolve(this.projectDir, 'package.json'), json =>
      merge(json, jestPkgJSON),
    )

    updateJSONFile(resolve(this.projectDir, this.eslintName), json => {
      json.env = {
        ...json.env,
        'jest/globals': true,
      }
    })
  }
  // 处理与 prettier 的集成
  private integratedPrettier() {
    // 更新依赖
    updateJSONFile(resolve(this.projectDir, 'package.json'), json =>
      merge(json, prettierPkgJSON),
    )
    updateJSONFile(resolve(this.projectDir, this.eslintName), json => {
      json.extends = [...json.extends, 'plugin:prettier/recommended']
    })
  }
}

/**
 * 初始化 ESLint
 */
export function initESLint(projectDir: string, plugins: JSPlugin[] = []) {
  // 修改 JSON 部分
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...pkgJSON,
    }
    json.scripts = {
      ...json.scripts,
      test: 'jest --all',
    }
  })

  const genDir = resolve(__dirname, 'generator')
  // 拷贝配置文件
  const eslintName = '.eslintrc'
  const eslintIgnoreName = '.eslintignore'
  copySync(resolve(genDir, eslintName), resolve(projectDir, eslintName))
  copySync(
    resolve(genDir, eslintIgnoreName),
    resolve(projectDir, eslintIgnoreName),
  )

  if (plugins.includes(JSPlugin.Jest)) {
    integratedJest(projectDir)
  }
  if (plugins.includes(JSPlugin.Prettier)) {
    integratedPrettier(projectDir)
  }
}

// 处理与 jest 的集成
export function integratedJest(projectDir: string) {
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...jestPkgJSON,
    }
  })

  updateJSONFile(resolve(projectDir, '.eslintrc'), json => {
    json.env = {
      ...json.env,
      'jest/globals': true,
    }
  })
}

// 处理与 prettier 的集成
export function integratedPrettier(projectDir: string) {
  // 更新依赖
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...prettierPkgJSON,
    }
  })
  updateJSONFile(resolve(projectDir, '.eslintrc'), json => {
    json.extends = [...json.extends, 'plugin:prettier/recommended']
  })
}
