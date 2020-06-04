import { StagedPlugin } from './staged'
import { ESLintPlugin } from './eslint'
import { PrettierPlugin } from './prettier'
import { JSPlugin } from './base/constant'
import { initTestEnv } from '../util/initTestEnv'

describe('测试 staged', function () {
  let path: string
  beforeEach(() => {
    path = initTestEnv()
  })
  it('一般情况', function () {
    const prettierPlugin = new PrettierPlugin()
    prettierPlugin.projectDir = path
    prettierPlugin.handle()
    const eslintPlugin = new ESLintPlugin()
    eslintPlugin.projectDir = path
    eslintPlugin.plugins.push(JSPlugin.Prettier)
    eslintPlugin.handle()
    const stagedPlugin = new StagedPlugin()
    stagedPlugin.projectDir = path
    stagedPlugin.plugins.push(JSPlugin.Prettier, JSPlugin.ESLint)
    stagedPlugin.handle()
  })
})
