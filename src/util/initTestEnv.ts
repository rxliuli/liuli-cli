import appRoot from 'app-root-path'
import { copySync, removeSync } from 'fs-extra'
import { resolve } from 'path'

/**
 * 初始化测试环境
 * @return 初始化的项目路径
 */
export function initTestEnv() {
  const projectDir = appRoot.path
  const path = resolve(projectDir, 'test/javascript-template')
  removeSync(path)
  copySync(resolve(projectDir, 'template/javascript'), path)
  return path
}
