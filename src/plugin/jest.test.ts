import { JestPlugin } from './jest'
import { BabelPlugin } from './babel'
import { execReady } from '../util/execReady'
import { initTestEnv } from '../util/initTestEnv'

describe('测试 jest js 插件', () => {
  let path: string
  beforeEach(() => {
    path = initTestEnv()
    const babelPlugin = new BabelPlugin()
    babelPlugin.projectDir = path
    babelPlugin.handle()
  })
  afterEach(() => {
    execReady(path)
  })
  it('一般情况', () => {
    const jestPlugin = new JestPlugin()
    jestPlugin.projectDir = path
    jestPlugin.handle()
  })
})
