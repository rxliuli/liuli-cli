import { initBabel } from '.'
import { resolve } from 'path'
import { removeSync, copySync } from 'fs-extra'
import appRoot from 'app-root-path'

describe('测试 dep', () => {
  const projectDir = appRoot.path
  beforeEach(() => {
    removeSync(resolve(projectDir, 'test/node-example'))
    copySync(
      resolve(projectDir, 'template/javascript'),
      resolve(projectDir, 'test/node-example'),
    )
  })
  it('一般情况', () => {
    initBabel(resolve(projectDir, 'test/node-example'))
  })
})
