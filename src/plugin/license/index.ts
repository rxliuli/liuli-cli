import createLicense, { LicenseType } from 'create-license'
import { sep } from 'path'
import { last } from 'lodash'
import username from 'username'
import { BasePlugin } from '../base/BasePlugin'
import { Plugin } from '../base/constant'

/**
 * license 插件
 */
export class LicensePlugin extends BasePlugin {
  license: LicenseType = 'mit'
  constructor() {
    super(Plugin.LICENSE)
  }
  handle(): void {
    createLicense(this.projectDir, this.license, {
      year: new Date().getFullYear(),
      author: username.sync()!,
      project: last(this.projectDir.split(sep))!,
    })
  }
}

// 初始化 license
export function initLicense(projectDir: string, license: LicenseType) {
  console.log(last(projectDir.split(sep)))
  createLicense(projectDir, license, {
    year: new Date().getFullYear(),
    author: username.sync()!,
    project: last(projectDir.split(sep))!,
  })
}
