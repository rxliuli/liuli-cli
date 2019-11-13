import { initStaged } from './index'
import appRoot from 'app-root-path'
import { resolve } from 'path'
import { copySync, removeSync } from 'fs-extra'
import { execReady } from '../../execReady'
import { initESLint } from '../eslint'
import { initPrettier } from '../prettier'
import { Plugin } from '../base/constant'

describe('测试 staged', function() {
  const projectDir = appRoot.path
  let path = resolve(projectDir, 'test/javascript-template')
  beforeEach(() => {
    removeSync(path)
    copySync(resolve(projectDir, 'template/javascript'), path)
  })
  afterEach(() => {
    execReady(path)
  })
  it('一般情况', function() {
    initPrettier(path)
    initESLint(path, [Plugin.Prettier])
    initStaged(path)
  })
})
