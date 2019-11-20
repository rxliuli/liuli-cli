import { hello } from './hello'

describe('测试 hello', () => {
  it('简单示例', () => {
    hello()
    expect(console.log).toHaveBeenCalledWith('hello world')
  })
})
