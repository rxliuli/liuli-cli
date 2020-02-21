import { resolve } from 'path'
import { updateJSONFile } from '../util/updateJSONFile'
import { copySync, readJSONSync } from 'fs-extra'
import merge from 'deepmerge'
import { BasePlugin } from './BasePlugin'
import { JSPlugin } from '../util/constant'
import { resolvePlugin } from './resolvePlugin'

export class PrettierPlugin extends BasePlugin {
  private prettierName = '.prettierrc.js'

  constructor() {
    super(JSPlugin.Prettier)
  }

  handle(): void {
    //更新 package.json
    updateJSONFile(resolve(this.projectDir, 'package.json'), json => {
      const pkgJSON = readJSONSync(resolvePlugin('./prettier/package.json'))
      return merge(json, pkgJSON)
    })
    //拷贝配置文件
    copySync(
      resolvePlugin('./prettier', this.prettierName),
      resolve(this.projectDir, this.prettierName),
    )
  }
}
