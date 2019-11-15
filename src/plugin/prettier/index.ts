import { resolve } from 'path'
import { updateJSONFile } from '../../util/updateJSONFile'
import pkgJSON from './generator/package.json'
import { copySync } from 'fs-extra'
import { BasePlugin } from '../base/BasePlugin'
import { JSPlugin } from '../base/constant'
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
      resolve(__dirname, 'generator', this.prettierName),
      resolve(this.projectDir, this.prettierName),
    )
  }
}
/**
 * 初始化 prettier 标准格式化工具
 * @param projectDir
 */
export function initPrettier(projectDir: string) {
  //更新 package.json
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...pkgJSON,
    }
    json.scripts = {
      ...json.scripts,
      format: 'prettier --write src/**/*.js',
    }
  })

  //拷贝配置文件
  copySync(
    resolve(__dirname, 'generator/.prettierrc.js'),
    resolve(projectDir, '.prettierrc.js'),
  )
}
