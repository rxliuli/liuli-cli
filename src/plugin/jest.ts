import { copySync, readFileSync, readJSONSync } from 'fs-extra'
import { resolve, sep } from 'path'
import { last } from 'lodash'
import { writeFileSync } from 'fs'
import { updateJSONFile } from '../util/updateJSONFile'
import merge from 'deepmerge'
import { BasePlugin } from './BasePlugin'
import { JSPlugin } from '../util/constant'
import { resolvePlugin } from './resolvePlugin'

export class JestPlugin extends BasePlugin {
  private jestName = 'jest.config.js'
  private testName = 'index.test.js'
  private jestStartName = 'jest-start.js'
  constructor() {
    super(JSPlugin.Jest)
  }
  handle(): void {
    // 修改 JSON 部分
    resolve(this.projectDir, 'package.json')
    updateJSONFile(resolve(this.projectDir, 'package.json'), json => {
      const pkgJSON = readJSONSync(resolvePlugin('./jest/package.json'))
      return merge(json, pkgJSON)
    })
    // 拷贝配置文件
    copySync(
      resolvePlugin('./jest', this.jestName),
      resolve(this.projectDir, this.jestName),
    )

    // 拷贝测试初始环境配置文件
    copySync(
      resolvePlugin('./jest', this.jestStartName),
      resolve(this.projectDir, 'test', this.jestStartName),
    )
    // 拷贝一个基本的测试文件
    const path = resolve(this.projectDir, 'test', this.testName)
    copySync(resolvePlugin('./jest', this.testName), path)
    const data = readFileSync(path, {
      encoding: 'utf8',
    }).replace(/javascript-template/g, last(this.projectDir.split(sep))!)
    writeFileSync(path, data)
  }
}
