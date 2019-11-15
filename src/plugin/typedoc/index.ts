import { BasePlugin } from '../base/BasePlugin'
import { TSPlugin } from '../base/constant'
import { updateJSONFile } from '../../util/updateJSONFile'
import { resolve } from 'path'
import merge from 'deepmerge'
import pkgJSON from './generator/package.json'
import { copySync } from 'fs-extra'

/**
 * typedoc 插件
 */
export class TypeDocPlugin extends BasePlugin {
  private noJekyllName = '.nojekyll'
  constructor() {
    super(TSPlugin.TypeDoc)
  }
  handle(): void {
    //更新 package.json
    updateJSONFile(resolve(this.projectDir, 'package.json'), json =>
      merge(json, pkgJSON),
    )
    //拷贝配置文件
    copySync(
      resolve(__dirname, 'generator', this.noJekyllName),
      resolve(this.projectDir, this.noJekyllName),
    )
  }
}
