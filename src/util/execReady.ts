import shell from 'shelljs'
import { formatPackageJSON } from './formatPackageJSON'
import { TemplateType } from './TemplateType'

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
