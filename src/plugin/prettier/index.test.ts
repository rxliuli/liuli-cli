import { PrettierPlugin } from './index'
import { BabelPlugin } from '../babel'
import { execReady } from '../../execReady'
import { initTestEnv } from '../../util/initTestEnv'

describe('测试 prettier 插件', function() {
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
    const prettierPlugin = new PrettierPlugin()
    prettierPlugin.projectDir = path
    prettierPlugin.handle()
  })
})
