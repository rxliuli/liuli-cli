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
    }).replace('javascript-template', last(this.projectDir.split(sep))!)
    writeFileSync(path, data)
  }
}
