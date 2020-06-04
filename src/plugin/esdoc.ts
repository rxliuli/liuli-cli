import { updateJSONFile } from '../util/updateJSONFile'
import pkgJSON from './resource/esdoc/package.json'
import { resolve } from 'path'
import { copySync } from 'fs-extra'
import { BasePlugin } from './base/BasePlugin'
import { JSPlugin } from './base/constant'
import merge from 'deepmerge'

/**
 * ESDoc 插件
 */
export class ESDocPlugin extends BasePlugin {
  constructor() {
    super(JSPlugin.ESLint)
  }
  handle(): void {
    // 拷贝配置文件
    updateJSONFile(resolve(this.projectDir, 'package.json'), (json) =>
      merge(json, pkgJSON),
    )
    // 拷贝配置文件
    const configName = '.esdoc.json'
    copySync(
      resolve(__dirname, 'resource/esdoc', configName),
      resolve(this.projectDir, configName),
    )
  }
}
