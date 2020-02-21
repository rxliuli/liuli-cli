console = Object.assign(
  console,
  ['log', 'info', 'warn', 'error'].reduce((res, k) => {
    Reflect.set(res, k, jest.fn(Reflect.get(console, k)))
    return res
  }, Object.create(null)),
)
