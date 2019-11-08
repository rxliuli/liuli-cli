import { initLicense } from './index'
import { resolve } from 'path'
import appRoot from 'app-root-path'
import { copySync, removeSync } from 'fs-extra'
import { initBabel } from '../babel'
import { execReady } from '../../execReady'

describe('测试 prettier 插件', function() {
  const projectDir = appRoot.path
  let path = resolve(projectDir, 'test/javascript-template')
  beforeEach(() => {
    removeSync(path)
    copySync(resolve(projectDir, 'template/javascript'), path)
  })
  afterEach(() => {
    execReady(path)
  })
  it('一般情况', () => {
    initLicense(path, 'mit')
  })
})
