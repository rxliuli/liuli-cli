import { resolve } from 'path'
import { updateJSONFile } from '../util/updateJSONFile'
import pkgJSON from './resource/prettier/package.json'
import { copySync } from 'fs-extra'
import { BasePlugin } from './base/BasePlugin'
import { JSPlugin } from './base/constant'
import merge from 'deepmerge'

export class PrettierPlugin extends BasePlugin {
  private prettierName = '.prettierrc.js'

  constructor() {
    super(JSPlugin.Prettier)
  }

  handle(): void {
    //更新 package.json
    updateJSONFile(resolve(this.projectDir, 'package.json'), json =>
      merge(json, pkgJSON),
    )
    //拷贝配置文件
    copySync(
      resolve(__dirname, 'resource/prettier', this.prettierName),
      resolve(this.projectDir, this.prettierName),
    )
  }
}
