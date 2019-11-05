import { resolve } from 'path'
import { copySync, removeSync } from 'fs-extra'
import { initJestJS } from './index'
import appRoot from 'app-root-path'
import { initBabel } from '../babel'
import { execReady } from '../../execReady'

describe('测试 jest js 插件', () => {
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
    initJestJS(resolve(projectDir, 'test/javascript-template'))
  })
})
