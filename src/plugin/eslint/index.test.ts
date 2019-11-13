import { ESLintPlugin } from './index'
import { execReady } from '../../execReady'
import { Plugin } from '../base/constant'
import { JestPlugin } from '../jest'
import { BabelPlugin } from '../babel'
import { PrettierPlugin } from '../prettier'
import { initTestEnv } from '../../util/initTestEnv'

describe('测试 eslint js 插件', () => {
  let path!: string
  describe('主程序测试', () => {
    beforeEach(() => {
      path = initTestEnv()
    })
    afterEach(() => {
      execReady(path)
    })

    it('一般情况', () => {
      const plugin = new ESLintPlugin()
      plugin.projectDir = path
      plugin.handle()
    })
    it('集成测试 eslint + jest', () => {
      const babelPlugin = new BabelPlugin()
      babelPlugin.projectDir = path
      babelPlugin.handle()
      const jestPlugin = new JestPlugin()
      jestPlugin.projectDir = path
      jestPlugin.handle()
      const eslintPlugin = new ESLintPlugin()
      eslintPlugin.projectDir = path
      eslintPlugin.plugins = [Plugin.Jest]
      eslintPlugin.handle()
    })
    it('集成测试 eslint + prettier', () => {
      const prettierPlugin = new PrettierPlugin()
      prettierPlugin.projectDir = path
      prettierPlugin.handle()
      const eslintPlugin = new ESLintPlugin()
      eslintPlugin.projectDir = path
      eslintPlugin.plugins = [Plugin.Prettier]
      eslintPlugin.handle()
    })
  })

  describe('单独测试', function() {
    let eslintPlugin: ESLintPlugin
    beforeEach(() => {
      const path = initTestEnv()
      eslintPlugin = new ESLintPlugin()
      eslintPlugin.projectDir = path
      eslintPlugin.handle()
    })
    it('单独测试 eslint + jest 集成', () => {
      eslintPlugin.plugins = [Plugin.Jest]
      eslintPlugin.integrated()
    })
    it('单独测试 eslint + prettier 集成', () => {
      eslintPlugin.plugins = [Plugin.Prettier]
      eslintPlugin.integrated()
    })
  })
})
