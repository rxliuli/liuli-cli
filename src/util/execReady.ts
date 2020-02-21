import shell from 'shelljs'
import { formatPackageJSON } from './formatPackageJSON'

/**
 * 执行一些准备工作
 * @param projectDir
 */
export function execReady(projectDir: string) {
  formatPackageJSON(projectDir)
  // 安装依赖
  shell.cd(projectDir)
  //暂不执行安装依赖的操作
  // shell.exec('yarn && yarn clean && yarn build')
}
