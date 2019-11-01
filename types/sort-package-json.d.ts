/**
 * 为 download-git-repo 模块添加类型定义文件
 */
declare module 'sort-package-json' {
  /*
   * @param {String} repo
   * @param {String} dest
   * @param {Function} fn
   */
  export function sortPackageJson(data: object): object

  // @ts-ignore
  export = sortPackageJson
}
