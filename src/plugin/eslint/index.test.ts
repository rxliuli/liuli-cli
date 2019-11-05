import { resolve } from 'path'
import { copySync, removeSync } from 'fs-extra'
import { initESLint, integratedJest } from './index'
import appRoot from 'app-root-path'
import { execReady } from '../../execReady'
import { Plugin } from '../../constant'
import { initJestJS } from '../jest'
import { initBabel } from '../babel'

describe('测试 eslint js 插件', () => {
  const root = appRoot.path
  describe('主程序测试', () => {
    beforeEach(() => {
      removeSync(resolve(root, 'test/javascript-template'))
      copySync(
        resolve(root, 'template/javascript'),
        resolve(root, 'test/javascript-template'),
      )
    })
    afterEach(() => {
      execReady(resolve(root, 'test/javascript-template'))
    })
    it('一般情况', () => {
      initESLint(resolve(root, 'test/javascript-template'), [])
    })
    it('集成测试 eslint + jest', () => {
      const path = resolve(root, 'test/javascript-template')
      initBabel(path)
      initJestJS(path)
      initESLint(path, [Plugin.JestPlugin])
    })
  })

  it('单独测试 eslint + jest 集成', () => {
    integratedJest(resolve(root, 'test/javascript-template'))
  })
})
