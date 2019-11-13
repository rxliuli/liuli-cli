import { StagedPlugin } from './index'
import { ESLintPlugin } from '../eslint'
import { PrettierPlugin } from '../prettier'
import { Plugin } from '../base/constant'
import { initTestEnv } from '../../util/initTestEnv'

describe('测试 staged', function() {
  let path: string
  beforeEach(() => {
    path = initTestEnv()
  })
  it('一般情况', function() {
    const prettierPlugin = new PrettierPlugin()
    prettierPlugin.projectDir = path
    prettierPlugin.handle()
    const eslintPlugin = new ESLintPlugin()
    eslintPlugin.projectDir = path
    eslintPlugin.plugins.push(Plugin.Prettier)
    eslintPlugin.handle()
    const stagedPlugin = new StagedPlugin()
    stagedPlugin.projectDir = path
    stagedPlugin.plugins.push(Plugin.Prettier, Plugin.ESLint)
    stagedPlugin.handle()
  })
})
