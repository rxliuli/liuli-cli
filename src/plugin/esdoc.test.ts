import { resolve } from 'path'
import { pathExistsSync } from 'fs-extra'
import { ESDocPlugin } from './esdoc'
import { execReady } from '../util/execReady'
import shell from 'shelljs'
import { initTestEnv } from '../util/initTestEnv'

describe('测试 ESDoc 插件', () => {
  let path: string
  beforeEach(() => {
    path = initTestEnv()
  })
  it('一般情况', () => {
    const plugin = new ESDocPlugin()
    plugin.projectDir = path
    plugin.handle()
    execReady(path)
    shell.cd(path).exec('yarn docs')
    expect(pathExistsSync(resolve(path, 'docs'))).toBeTruthy()
  })
})
