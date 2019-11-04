import { initBabel } from '.'
import { resolve } from 'path'
import { removeSync, copySync } from 'fs-extra'

describe('测试 dep', () => {
  beforeEach(() => {
    removeSync(resolve(process.cwd(), 'test/node-example'))
    copySync(
      resolve(process.cwd(), 'test/js-sdk-origin'),
      resolve(process.cwd(), 'test/node-example'),
    )
  })
  it('一般情况', () => {
    initBabel(resolve(process.cwd(), 'test/node-example'))
  })
})
