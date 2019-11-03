import { initBabel } from '.'
import { resolve } from 'path'
import copyDir from 'copy-dir'
import rimraf from 'rimraf'

describe('测试 dep', () => {
  beforeEach(() => {
    rimraf.sync(resolve(process.cwd(), 'test/node-example'))
    copyDir.sync(
      resolve(process.cwd(), 'test/js-sdk-origin'),
      resolve(process.cwd(), 'test/node-example'),
    )
  })
  it('一般情况', () => {
    initBabel(resolve(process.cwd(), 'test/node-example'))
  })
})
