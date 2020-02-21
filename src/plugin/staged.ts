import { copySync, readJSONSync } from 'fs-extra'
import { resolve } from 'path'
import { updateJSONFile } from '../util/updateJSONFile'
import merge from 'deepmerge'
import { TemplateType } from '../util/TemplateType'
import { BasePlugin } from './BasePlugin'
import { JSPlugin, TSPlugin } from '../util/constant'
import { resolvePlugin } from './resolvePlugin'

/**
 * 初始化 lint-staged
 */
export class StagedPlugin extends BasePlugin {
  private huskyName = '.huskyrc'
  private lintStagedName = '.lintstagedrc'
  private lintStagedTSName = '.ts.lintstagedrc'

  constructor() {
    super(JSPlugin.Staged)
  }

  handle(): void {
    if (
      !this.plugins.includes(JSPlugin.ESLint) &&
      !this.plugins.includes(JSPlugin.Prettier) &&
      !this.plugins.includes(TSPlugin.Prettier)
    ) {
      throw new Error('初始化 staged 必须包含 ESLint 或 Prettier 插件！')
    }
    updateJSONFile(resolve(this.projectDir, 'package.json'), json => {
      const pkgJSON = readJSONSync(resolvePlugin('./staged/package.json'))
      return merge(json, pkgJSON)
    })
    copySync(
      resolvePlugin('./staged', this.huskyName),
      resolve(this.projectDir, this.huskyName),
    )
    const projectLintStageName = resolve(this.projectDir, this.lintStagedName)
    if (this.type === TemplateType.JavaScript) {
      copySync(
        resolvePlugin('./staged', this.lintStagedName),
        projectLintStageName,
      )
      if (!this.plugins.includes(JSPlugin.Prettier)) {
        updateJSONFile(projectLintStageName, json => {
          json.linters['src/**/*.js'].splice(1, 1)
        })
      } else if (!this.plugins.includes(JSPlugin.ESLint)) {
        updateJSONFile(projectLintStageName, json => {
          json.linters['src/**/*.js'].splice(0, 1)
        })
      }
    } else if (this.type === TemplateType.TypeScript) {
      copySync(
        resolvePlugin('./staged', this.lintStagedTSName),
        projectLintStageName,
      )
    }
  }
}
