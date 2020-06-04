import { JSPlugin, TSPlugin } from './constant'
import { TemplateType } from '../../util/TemplateType'

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
  public readonly id: JSPlugin | TSPlugin
  /**
   * 项目依赖的插件 ID 列表
   */
  public plugins: (JSPlugin | TSPlugin)[] = []
  /**
   * 项目的类型，默认为 JavaScript 项目
   */
  public type!: TemplateType

  protected constructor(id: JSPlugin | TSPlugin) {
    this.id = id
  }

  /**
   * 可选择的集成其他插件时的操作
   */
  integrated() {
    //可以选择是否实现
  }

  /**
   * 处理函数
   */
  abstract handle(): void
}
