// @ts-ignore
import pkg from '..'
// @ts-ignore
import { hello } from '..'

describe('test', () => {
  it('simple example', () => {
    pkg.hello()
    hello()
  })
})
