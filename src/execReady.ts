import shell from 'shelljs'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import sortPackageJson from 'sort-package-json'
import { formatPackageJSON } from './formatPackageJSON'

/**
 * 执行一些准备工作
 * @param projectDir
 */
export function execReady(projectDir: string) {
  formatPackageJSON(projectDir)
  // 安装依赖
  shell.cd(projectDir)
  shell.exec('yarn && yarn clean && yarn build')
}

// execReady(resolve(process.cwd(), 'test/node-example'))
