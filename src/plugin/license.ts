import createLicense, { LicenseType } from 'create-license'
import { resolve, sep } from 'path'
import { last } from 'lodash'
import username from 'username'
import { BasePlugin } from './base/BasePlugin'
import { JSPlugin } from './base/constant'
import { updateJSONFile } from '../util/updateJSONFile'

/**
 * license 插件
 */
export class LicensePlugin extends BasePlugin {
  public license!: LicenseType
  constructor() {
    super(JSPlugin.License)
  }
  handle(): void {
    updateJSONFile(resolve(this.projectDir, 'package.json'), (json) => {
      json.license = this.license
    })
    createLicense(this.projectDir, this.license, {
      year: new Date().getFullYear(),
      author: username.sync()!,
      project: last(this.projectDir.split(sep))!,
    })
  }
}
