import pkg from '..'
import { hello } from '..'

describe('test', () => {
  it('simple example', () => {
    pkg.hello()
    hello()
  })
})
