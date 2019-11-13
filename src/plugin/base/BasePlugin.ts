import { Plugin } from './constant'

/**
 * 基础的插件接口，所有的接口
 */
export abstract class BasePlugin {
  /**
   * 项目的根目录
   */
  projectDir = ''
  /**
   * 项目的插件 ID
   */
  id: Plugin
  /**
   * 项目依赖的插件 ID 列表
   */
  depPlugins: Plugin[] = []

  protected constructor(id: Plugin) {
    this.id = id
  }

  /**
   * 处理函数
   */
  abstract handle(): void
}
