import { JestTSPlugin } from './index'
import { execReady } from '../../execReady'
import { initTestEnvTS } from '../../util/initTestEnv'

describe('测试 jest ts 插件', () => {
  let path: string
  beforeEach(() => {
    path = initTestEnvTS()
  })
  afterEach(() => {
    execReady(path)
  })
  it('一般情况', () => {
    const jestPlugin = new JestTSPlugin()
    jestPlugin.projectDir = path
    jestPlugin.handle()
  })
})
