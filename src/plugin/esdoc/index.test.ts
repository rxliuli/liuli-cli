import { resolve } from 'path'
import { copySync, pathExistsSync, removeSync } from 'fs-extra'
import { initESDoc } from './index'
import appRoot from 'app-root-path'
import { execReady } from '../../execReady'
import shell from 'shelljs'

describe('测试 esdoc 插件', () => {
  const projectDir = appRoot.path
  beforeEach(() => {
    removeSync(resolve(projectDir, 'test/javascript-template'))
    copySync(
      resolve(projectDir, 'template/javascript'),
      resolve(projectDir, 'test/javascript-template'),
    )
  })
  it('一般情况', () => {
    initESDoc(resolve(projectDir, 'test/javascript-template'))
    execReady(resolve(projectDir, 'test/javascript-template'))
    shell.cd(resolve(projectDir, 'test/javascript-template')).exec('yarn docs')
    expect(
      pathExistsSync(resolve(projectDir, 'test/javascript-template', 'docs')),
    ).toBeTruthy()
  })
})
