import pkgJSON from './resource/jest-ts/package.json'
import { copySync } from 'fs-extra'
import { resolve } from 'path'
import { BasePlugin } from './base/BasePlugin'
import { JSPlugin } from './base/constant'
import { updateJSONFile } from '../util/updateJSONFile'
import merge from 'deepmerge'

export class JestTSPlugin extends BasePlugin {
  private jestName = 'jest.config.js'
  private testName = 'index.test.ts'
  private jestStartName = 'jest-start.ts'
  constructor() {
    super(JSPlugin.Jest)
  }
  handle(): void {
    // 修改 JSON 部分
    updateJSONFile(resolve(this.projectDir, 'package.json'), (json) =>
      merge(json, pkgJSON),
    )
    // 拷贝配置文件
    copySync(
      resolve(__dirname, 'resource/jest-ts', this.jestName),
      resolve(this.projectDir, this.jestName),
    )

    // 拷贝测试初始环境配置文件
    copySync(
      resolve(__dirname, 'resource/jest-ts', this.jestStartName),
      resolve(this.projectDir, 'test', this.jestStartName),
    )
    // 拷贝一个基本的测试文件
    const path = resolve(this.projectDir, 'test', this.testName)
    copySync(resolve(__dirname, 'resource/jest-ts', this.testName), path)
  }
}
