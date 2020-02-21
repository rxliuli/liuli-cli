import { updateJSONFile } from '../util/updateJSONFile'
import { resolve } from 'path'
import { copySync, readJSONSync } from 'fs-extra'
import merge from 'deepmerge'
import { BasePlugin } from './BasePlugin'
import { JSPlugin, ResourcePath } from '../util/constant'
import { resolvePlugin } from './resolvePlugin'

/**
 * ESDoc 插件
 */
export class ESDocPlugin extends BasePlugin {
  constructor() {
    super(JSPlugin.ESLint)
  }
  handle(): void {
    // 拷贝配置文件
    updateJSONFile(resolve(this.projectDir, 'package.json'), json => {
      const pkgJSON = readJSONSync(resolvePlugin('./esdoc/package.json'))
      return merge(json, pkgJSON)
    })
    // 拷贝配置文件
    const configName = '.esdoc.json'
    copySync(
      resolvePlugin('./esdoc', configName),
      resolve(this.projectDir, configName),
    )
  }
}
