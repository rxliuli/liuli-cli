import { resolve } from 'path'
import { copySync } from 'fs-extra'
import pkgJSON from './resource/eslint-ts/package.json'
import prettierPkgJSON from './resource/eslint/prettier.package.json'
import { TSPlugin } from './base/constant'
import { updateJSONFile } from '../util/updateJSONFile'
import { BasePlugin } from './base/BasePlugin'
import merge from 'deepmerge'

export class ESLintTSPlugin extends BasePlugin {
  private eslintName = '.eslintrc'
  private eslintIgnoreName = '.eslintignore'
  constructor() {
    super(TSPlugin.ESLint)
  }
  handle(): void {
    // 修改 JSON 部分
    updateJSONFile(resolve(this.projectDir, 'package.json'), (json) =>
      merge(json, pkgJSON),
    )
    // 拷贝配置文件
    const genDir = resolve(__dirname, 'resource/eslint-ts')
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
    if (this.plugins.includes(TSPlugin.Prettier)) {
      this.integratedPrettier()
    }
  }
  // 处理与 prettier 的集成
  private integratedPrettier() {
    // 更新依赖
    updateJSONFile(resolve(this.projectDir, 'package.json'), (json) =>
      merge(json, prettierPkgJSON),
    )
    updateJSONFile(resolve(this.projectDir, this.eslintName), (json) => {
      json.extends = [...json.extends, 'plugin:prettier/recommended']
    })
  }
}
