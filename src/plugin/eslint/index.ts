import { resolve } from 'path'
import { copySync } from 'fs-extra'
import dep from './generator/dep.json'
import jestDep from './generator/jestDep.json'
import prettierDep from './generator/prettierDep.json'
import { Plugin } from '../../constant'
import { updateJSONFile } from '../../util/updateJSONFile'

/**
 * 初始化 ESLint
 */
export function initESLint(projectDir: string, plugins: Plugin[] = []) {
  // 修改 JSON 部分
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...dep,
    }
    json.scripts = {
      ...json.scripts,
      test: 'jest --all',
    }
  })

  // 拷贝配置文件
  copySync(
    resolve(__dirname, 'generator/.eslintrc'),
    resolve(projectDir, '.eslintrc'),
  )
  copySync(
    resolve(__dirname, 'generator/.eslintignore'),
    resolve(projectDir, '.eslintignore'),
  )

  if (plugins.includes(Plugin.Jest)) {
    integratedJest(projectDir)
  }
  if (plugins.includes(Plugin.Prettier)) {
    integratedPrettier(projectDir)
  }
}

// 处理与 jest 的集成
export function integratedJest(projectDir: string) {
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...jestDep,
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
      ...prettierDep,
    }
  })
  updateJSONFile(resolve(projectDir, '.eslintrc'), json => {
    json.extends = [...json.extends, 'plugin:prettier/recommended']
  })
}
