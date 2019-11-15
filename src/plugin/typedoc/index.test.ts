import { initTestEnvTS } from '../../util/initTestEnv'
import { execReady } from '../../execReady'
import { TypeDocPlugin } from './index'

describe('测试 TypeDoc 插件', function() {
  let path: string
  beforeEach(() => {
    path = initTestEnvTS()
  })
  afterEach(() => {
    execReady(path)
  })
  it('一般情况', () => {
    const plugin = new TypeDocPlugin()
    plugin.projectDir = path
    plugin.handle()
  })
})
