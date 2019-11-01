import shell from 'shelljs'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import sortPackageJson from 'sort-package-json'

/**
 * 执行一些准备工作
 * @param projectDir
 */
export function execReady(projectDir: string) {
  // 格式化 package.json
  const pkgPath = resolve(projectDir, 'package.json')
  const data = readFileSync(pkgPath, {
    encoding: 'utf8',
  })
  writeFileSync(
    pkgPath,
    JSON.stringify(sortPackageJson(JSON.parse(data)), null, 2),
  )
  // 安装依赖
  shell.cd(projectDir)
  shell.exec('yarn && yarn clean && yarn build')
}

// execReady(resolve(process.cwd(), 'test/node-example'))
