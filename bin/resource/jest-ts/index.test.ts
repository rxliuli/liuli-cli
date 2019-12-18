const pkg = require('typescript-template')
const { hello } = require('typescript-template')

describe('test', () => {
  it('simple example', () => {
    pkg.hello()
    hello()
  })
})
