import { resolve } from 'path'
import { copySync, removeSync } from 'fs-extra'
import { initESLint, integratedJest, integratedPrettier } from './index'
import appRoot from 'app-root-path'
import { execReady } from '../../execReady'
import { Plugin } from '../../constant'
import { initJestJS } from '../jest'
import { initBabel } from '../babel'
import { initPrettier } from '../prettier'

describe('测试 eslint js 插件', () => {
  const root = appRoot.path
  const path = resolve(root, 'test/javascript-template')
  describe('主程序测试', () => {
    beforeEach(() => {
      removeSync(path)
      copySync(resolve(root, 'template/javascript'), path)
    })
    afterEach(() => {
      execReady(path)
    })
    it('一般情况', () => {
      initESLint(path, [])
    })
    it('集成测试 eslint + jest', () => {
      initBabel(path)
      initJestJS(path)
      initESLint(path, [Plugin.JestPlugin, Plugin.BabelPlugin])
    })
    it('集成测试 eslint + prettier', () => {
      initPrettier(path)
      initESLint(path, [Plugin.PrettierPlugin])
    })
  })

  it('单独测试 eslint + jest 集成', () => {
    integratedJest(path)
  })
  it('单独测试 eslint + prettier 集成', () => {
    initPrettier(path)
    integratedPrettier(path)
  })
})
