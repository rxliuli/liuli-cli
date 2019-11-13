import { BabelPlugin, initBabel } from '.'
import { resolve } from 'path'
import { copySync, removeSync } from 'fs-extra'
import appRoot from 'app-root-path'

describe('测试 dep', () => {
  const projectDir = appRoot.path
  const path = resolve(projectDir, 'test/javascript-template')
  beforeEach(() => {
    removeSync(path)
    copySync(resolve(projectDir, 'template/javascript'), path)
    initBabel(path)
  })
  it('一般情况', () => {
    const babelPlugin = new BabelPlugin()
    babelPlugin.projectDir = path
    babelPlugin.handle()
  })
})
