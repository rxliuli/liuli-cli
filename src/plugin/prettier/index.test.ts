import { initPrettier } from './index'
import { resolve } from 'path'
import appRoot from 'app-root-path'
import { copySync, removeSync } from 'fs-extra'
import { initBabel } from '../babel'
import { execReady } from '../../execReady'

describe('测试 prettier 插件', function() {
  const projectDir = appRoot.path
  beforeEach(() => {
    removeSync(resolve(projectDir, 'test/javascript-template'))
    copySync(
      resolve(projectDir, 'template/javascript'),
      resolve(projectDir, 'test/javascript-template'),
    )
    initBabel(resolve(projectDir, 'test/javascript-template'))
  })
  afterEach(() => {
    execReady(resolve(projectDir, 'test/javascript-template'))
  })
  it('一般情况', () => {
    initPrettier(resolve(projectDir, 'test/javascript-template'))
  })
})
