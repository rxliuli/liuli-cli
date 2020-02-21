import { copySync, removeSync } from 'fs-extra'
import { resolve } from 'path'
import { RootPath } from '../RootPath'

/**
 * 初始化测试环境
 * @return 初始化的项目路径
 */
export function initTestEnv() {
  const projectDir = RootPath
  const path = resolve(projectDir, 'test/javascript-template')
  removeSync(path)
  copySync(resolve(projectDir, './resource/template/javascript'), path)
  return path
}

export function initTestEnvTS() {
  const projectDir = RootPath
  const path = resolve(projectDir, 'test/typescript-template')
  removeSync(path)
  copySync(resolve(projectDir, './resource/template/typescript'), path)
  return path
}
