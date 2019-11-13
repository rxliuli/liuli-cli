import { BabelPlugin, initBabel } from '.'
import { resolve } from 'path'
import { copySync, removeSync } from 'fs-extra'
import appRoot from 'app-root-path'
import { initTestEnv } from '../../util/initTestEnv'

describe('测试 babel 插件', () => {
  let path: string
  beforeEach(() => {
    path = initTestEnv()
  })
  it('一般情况', () => {
    const babelPlugin = new BabelPlugin()
    babelPlugin.projectDir = path
    babelPlugin.handle()
  })
})
