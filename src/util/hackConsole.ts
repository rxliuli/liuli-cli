const hackFuncList = ['log', 'info', 'warn', 'error']
const [originalFunc, hackFunc]: any = hackFuncList.reduce(
  ([originalFunc, hackFunc], k) => {
    Reflect.set(originalFunc, k, Reflect.get(console, k))
    Reflect.set(hackFunc, k, () => {})
    return originalFunc
  },
  [Object.create(null), Object.create(null)],
)

/**
 * 重写 console 的部分函数，以控制 console 的输出
 * @type {typeof console}
 */
export function hackConsole(disable: boolean) {
  console = disable
    ? Object.assign(console, hackFunc)
    : Object.assign(console, originalFunc)
}
