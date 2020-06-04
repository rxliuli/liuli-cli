// 格式化 package.json
import { resolve } from 'path'
import { writeFileSync } from 'fs'
import sortPackageJson from 'sort-package-json'
import { readJSONSync } from 'fs-extra'

/**
 * 格式化 package.json
 * @param projectDir 项目目录路径
 */
export function formatPackageJSON(projectDir: string) {
  const pkgPath = resolve(projectDir, 'package.json')
  const data = readJSONSync(pkgPath)
  writeFileSync(pkgPath, JSON.stringify(sortPackageJson(data), null, 2))
}
