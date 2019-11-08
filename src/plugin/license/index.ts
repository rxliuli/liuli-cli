import createLicense, { LicenseType } from 'create-license'
import { sep } from 'path'
import { last } from 'lodash'
import username from 'username'

// 初始化 license
export function initLicense(projectDir: string, license: LicenseType) {
  console.log(last(projectDir.split(sep)))
  createLicense(projectDir, license, {
    year: new Date().getFullYear(),
    author: username.sync()!,
    project: last(projectDir.split(sep))!,
  })
}
