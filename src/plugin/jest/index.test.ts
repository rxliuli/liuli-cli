import { resolve } from 'path'
import { copySync, removeSync } from 'fs-extra'
import { initJestJS } from './index'
import appRoot from 'app-root-path'

describe('测试 jest js 插件', () => {
  let projectDir = appRoot.path
  beforeEach(() => {
    removeSync(resolve(projectDir, 'test/node-example'))
    copySync(
      resolve(projectDir, 'test/js-sdk-origin'),
      resolve(projectDir, 'test/node-example'),
    )
  })
  it('一般情况', () => {
    initJestJS(resolve(projectDir, 'test/node-example'))
  })
})
