import { resolve } from 'path'

/**
 * 获取当前项目的根路径，避免相对路径引用资源在打包后路径变化的问题
 */
export const RootPath = resolve(__dirname, '../')
