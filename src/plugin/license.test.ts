import { LicensePlugin } from './license'
import { initTestEnv } from '../util/initTestEnv'

describe('测试 prettier 插件', function () {
  let path: string
  beforeEach(() => {
    path = initTestEnv()
  })
  it('一般情况', () => {
    const licensePlugin = new LicensePlugin()
    licensePlugin.projectDir = path
    licensePlugin.license = 'mit'
    licensePlugin.handle()
  })
})
