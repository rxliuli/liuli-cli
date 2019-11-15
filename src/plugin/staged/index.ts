import { copySync } from 'fs-extra'
import { resolve } from 'path'
import { updateJSONFile } from '../../util/updateJSONFile'
import pkgJSON from './generator/package.json'
import { BasePlugin } from '../base/BasePlugin'
import { JSPlugin } from '../base/constant'
import merge from 'deepmerge'

/**
 * 初始化 lint-staged
 */
export class StagedPlugin extends BasePlugin {
  private huskyName = '.huskyrc'
  private lintStagedName = '.lintstagedrc'

  constructor() {
    super(JSPlugin.Staged)
  }

  handle(): void {
    if (
      !this.plugins.includes(JSPlugin.ESLint) ||
      !this.plugins.includes(JSPlugin.Prettier)
    ) {
      throw new Error('初始化 staged 必须包含 ESLint 与 Prettier 插件！')
    }
    updateJSONFile(resolve(this.projectDir, 'package.json'), json =>
      merge(json, pkgJSON),
    )

    copySync(
      resolve(__dirname, 'generator', this.huskyName),
      resolve(this.projectDir, this.huskyName),
    )
    copySync(
      resolve(__dirname, 'generator', this.lintStagedName),
      resolve(this.projectDir, this.lintStagedName),
    )
  }
}
