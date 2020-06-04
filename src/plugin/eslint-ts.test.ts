import { execReady } from '../util/execReady'
import { TSPlugin } from './base/constant'
import { PrettierPlugin } from './prettier'
import { initTestEnvTS } from '../util/initTestEnv'
import { ESLintTSPlugin } from './eslint-ts'
import { JestTSPlugin } from './jest-ts'

describe('测试 eslint js 插件', () => {
  let path!: string
  describe('主程序测试', () => {
    beforeEach(() => {
      path = initTestEnvTS()
    })
    afterEach(() => {
      execReady(path)
    })

    it('一般情况', () => {
      const plugin = new ESLintTSPlugin()
      plugin.projectDir = path
      plugin.handle()
    })
    it('集成测试 eslint + jest', () => {
      const jestPlugin = new JestTSPlugin()
      jestPlugin.projectDir = path
      jestPlugin.handle()
      const eslintPlugin = new ESLintTSPlugin()
      eslintPlugin.projectDir = path
      eslintPlugin.plugins = [TSPlugin.Jest]
      eslintPlugin.handle()
    })
    it('集成测试 eslint + prettier', () => {
      const prettierPlugin = new PrettierPlugin()
      prettierPlugin.projectDir = path
      prettierPlugin.handle()
      const eslintPlugin = new ESLintTSPlugin()
      eslintPlugin.projectDir = path
      eslintPlugin.plugins = [TSPlugin.Prettier]
      eslintPlugin.handle()
    })
  })

  describe('单独测试', function () {
    let eslintPlugin: ESLintTSPlugin
    beforeEach(() => {
      const path = initTestEnvTS()
      eslintPlugin = new ESLintTSPlugin()
      eslintPlugin.projectDir = path
      eslintPlugin.handle()
    })
    it('单独测试 eslint + prettier 集成', () => {
      eslintPlugin.plugins = [TSPlugin.Prettier]
      eslintPlugin.integrated()
    })
  })
})
