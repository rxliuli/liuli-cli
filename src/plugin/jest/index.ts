import pkgJSON from './generator/package.json'
import { copySync, readFileSync, readJSONSync, writeJSONSync } from 'fs-extra'
import { resolve, sep } from 'path'
import { last } from 'lodash'
import { writeFileSync } from 'fs'
import { BasePlugin } from '../base/BasePlugin'
import { JSPlugin } from '../base/constant'
import { updateJSONFile } from '../../util/updateJSONFile'
import merge from 'deepmerge'

export class JestPlugin extends BasePlugin {
  private jestName = 'jest.config.js'
  private testName = 'index.test.js'
  constructor() {
    super(JSPlugin.Jest)
  }
  handle(): void {
    // 修改 JSON 部分
    resolve(this.projectDir, 'package.json')
    updateJSONFile(resolve(this.projectDir, 'package.json'), json =>
      merge(json, pkgJSON),
    )
    // 拷贝配置文件
    copySync(
      resolve(__dirname, 'generator', this.jestName),
      resolve(this.projectDir, this.jestName),
    )

    // 拷贝一个基本的测试文件
    const path = resolve(this.projectDir, 'test', this.testName)
    copySync(resolve(__dirname, 'generator', this.testName), path)
    const data = readFileSync(path, {
      encoding: 'utf8',
    }).replace(/javascript-template/g, last(this.projectDir.split(sep))!)
    writeFileSync(path, data)
  }
}

/**
 * 初始化 jest 配置
 * @param projectDir
 */
export function initJestJS(projectDir: string) {
  const packagePath = resolve(projectDir, 'package.json')
  const json = readJSONSync(packagePath)

  // 修改 JSON 部分
  json.devDependencies = {
    ...json.devDependencies,
    ...pkgJSON,
  }
  json.scripts = {
    ...json.scripts,
    test: 'jest --all',
  }
  writeJSONSync(packagePath, json)
  // 拷贝配置文件
  copySync(
    resolve(__dirname, 'generator/jest.config.js'),
    resolve(projectDir, 'jest.config.js'),
  )

  // 拷贝一个基本的测试文件
  const path = resolve(projectDir, 'test/index.test.js')
  copySync(resolve(__dirname, 'generator/index.test.js'), path)
  const data = readFileSync(path, {
    encoding: 'utf8',
  }).replace('javascript-template', last(projectDir.split(sep))!)
  writeFileSync(path, data)
}
