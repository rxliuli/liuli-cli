import { updateJSONFile } from '../util/updateJSONFile'
import { resolve } from 'path'
import merge from 'deepmerge'
import { copySync, readJSONSync } from 'fs-extra'
import { BasePlugin } from './BasePlugin'
import { TSPlugin } from '../util/constant'
import { resolvePlugin } from './resolvePlugin'

/**
 * typedoc 插件
 */
export class TypeDocPlugin extends BasePlugin {
  private noJekyllName = '.nojekyll'
  private typeDocName = 'typedoc.json'
  constructor() {
    super(TSPlugin.TypeDoc)
  }
  handle(): void {
    //更新 package.json
    updateJSONFile(resolve(this.projectDir, 'package.json'), json => {
      const pkgJSON = readJSONSync(resolvePlugin('./typedoc/package.json'))
      return merge(json, pkgJSON)
    })
    //拷贝配置文件
    copySync(
      resolvePlugin('./typedoc', this.noJekyllName),
      resolve(this.projectDir, this.noJekyllName),
    )
    copySync(
      resolvePlugin('./typedoc', this.typeDocName),
      resolve(this.projectDir, this.typeDocName),
    )
  }
}
