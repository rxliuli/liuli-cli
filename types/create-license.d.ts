/**
 * 许可证的类型
 */
type LicenseType =
  | 'agpl'
  | 'apache'
  | 'artistic'
  | 'bsd-3-clause'
  | 'bsd'
  | 'cc0'
  | 'eclipse'
  | 'gpl-v2'
  | 'gpl-v3'
  | 'lgpl-v2.1'
  | 'lgpl-v3'
  | 'mit'
  | 'mozilla'
  | 'no-license'
  | 'unlicense'
  | 'wtfpl'

/**
 * 许可证类型
 * @property year 年份
 * @property author 作者
 * @property project 项目名
 */
type Options = {
  year: number
  author: string
  project: string
}

/**
 * 创建一个许可证
 * @param where 创建许可证的目录
 * @param type 许可证的类型
 * @param opts 一些选项
 */
export function createLicense(
  where: string,
  type: LicenseType,
  opts: Options,
): void
