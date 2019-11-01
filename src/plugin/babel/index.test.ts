import { initBabel } from '.'
import { resolve } from 'path'

describe('测试 dep', () => {
  it('一般情况', () => {
    initBabel(resolve(process.cwd(), 'test/node-example'))
  })
})
