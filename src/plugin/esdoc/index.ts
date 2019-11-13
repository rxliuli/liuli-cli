import { updateJSONFile } from '../../util/updateJSONFile'
import pkgJSON from './generator/package.json'
import { resolve } from 'path'
import { copySync } from 'fs-extra'
import { BasePlugin } from '../base/BasePlugin'
import { Plugin } from '../base/constant'
import merge from 'deepmerge'

/**
 * ESDoc 插件
 */
export class ESDocPlugin extends BasePlugin {
  constructor() {
    super(Plugin.ESLint)
  }
  handle(): void {
    // 拷贝配置文件
    updateJSONFile(resolve(this.projectDir, 'package.json'), json =>
      merge(json, pkgJSON),
    )
    // 拷贝配置文件
    const configName = '.esdoc.json'
    copySync(
      resolve(__dirname, 'generator', configName),
      resolve(this.projectDir, configName),
    )
  }
}

/**
 * 初始化
 * @param projectDir
 */
export function initESDoc(projectDir: string) {
  //更新 json 文件
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...pkgJSON,
    }
    json.scripts = {
      ...json.scripts,
      docs: 'esdoc',
    }
  })
  // 拷贝配置文件
  copySync(
    resolve(__dirname, './generator/.esdoc.json'),
    resolve(projectDir, '.esdoc.json'),
  )
}
