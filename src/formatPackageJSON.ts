// 格式化 package.json
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import sortPackageJson from 'sort-package-json'

/**
 * 格式化 package.json
 * @param projectDir 项目目录路径
 */
export function formatPackageJSON(projectDir: string) {
  const pkgPath = resolve(projectDir, 'package.json')
  const data = readFileSync(pkgPath, {
    encoding: 'utf8',
  })
  writeFileSync(
    pkgPath,
    JSON.stringify(sortPackageJson(JSON.parse(data)), null, 2),
  )
}
