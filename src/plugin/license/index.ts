import { createLicense, LicenseType } from 'create-license'
import { sep } from 'path'
import { last } from 'lodash'

// 初始化 license

export function initLicense(projectDir: string, license: LicenseType) {
  createLicense(projectDir, license, {
    year: new Date().getFullYear(),
    author: 'rxliuli',
    project: last(projectDir.split(sep))!,
  })
}
