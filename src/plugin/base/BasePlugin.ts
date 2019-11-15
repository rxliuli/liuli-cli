import { JSPlugin } from './constant'

/**
 * 基础的插件接口，所有的接口
 */
export abstract class BasePlugin {
  /**
   * 项目的根目录
   */
  public projectDir = ''
  /**
   * 项目的插件 ID
   */
  public readonly id: JSPlugin
  /**
   * 项目依赖的插件 ID 列表
   */
  public plugins: JSPlugin[] = []

  protected constructor(id: JSPlugin) {
    this.id = id
  }

  /**
   * 可选择的集成其他插件时的操作
   */
  integrated() {}

  /**
   * 处理函数
   */
  abstract handle(): void
}
