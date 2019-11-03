/**
 * options
 * @property [utimes] Boolean | Object, keep addTime or modifyTime if true
 * @property [mode] Boolean | Number, keep file mode if true
 * @property [cover] Boolean, cover if file exists
 * @property [filter] Boolean | Function, file filter
 */
type Options = {
  utimes?: boolean
  mode?: boolean
  cover?: boolean
  filter?: boolean
}
declare function copyDir(
  from: string,
  to: string,
  callback: (err: Error) => void,
): void
declare function copyDir(
  from: string,
  to: string,
  option: Options,
  callback: (err: Error) => void,
): void

declare namespace copyDir {
  function sync(from: string, to: string, option?: Options): void
}
export default copyDir
