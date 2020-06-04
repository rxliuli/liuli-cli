import { Command } from 'commander'
import { resolve } from 'path'
import appInfo from '../package.json'
import { prompt } from 'inquirer'
import { execReady } from './util/execReady'
import { initProject } from './util/initProject'
import { BabelPlugin } from './plugin/babel'
import { pathExistsSync } from 'fs-extra'
import { JSPlugin, TSPlugin } from './plugin/base/constant'
import { JestPlugin } from './plugin/jest'
import { ESLintPlugin } from './plugin/eslint'
import { PrettierPlugin } from './plugin/prettier'
import { ESDocPlugin } from './plugin/esdoc'
import { StagedPlugin } from './plugin/staged'
import { LicensePlugin } from './plugin/license'
import { licenseTypeList } from './plugin/licenseTypeList'
import { BasePlugin } from './plugin/base/BasePlugin'
import { LicenseType } from 'create-license'
import { TemplateType } from './util/TemplateType'
import { JestTSPlugin } from './plugin/jest-ts'
import { TypeDocPlugin } from './plugin/typedoc'
import { ESLintTSPlugin } from './plugin/eslint-ts'

/**
 * 1. 向用户询问一些选项
 * 2. 下载模板项目
 * 3. 根据选项修改模板项目
 * 4. 初始化安装和运行
 */
const program = new Command()

/**
 * 询问一些选项
 */
async function promptInput(plugin: typeof JSPlugin | typeof TSPlugin) {
  return prompt([
    {
      type: 'checkbox',
      name: 'options',
      message: '请选择需要的组件',
      suffix: '请按下空格',
      choices: [...Object.keys(plugin)]
        .filter((k) => isNaN(k as any))
        .map((k, i) => ({
          name: k,
          value: plugin[k as any],
          checked: i === 0,
        })),
    },
  ])
}
/**
 * 选择一个许可证
 */
async function promptLicense(): Promise<LicenseType> {
  const { options } = await prompt([
    {
      type: 'list',
      name: 'options',
      message: '请选择需要的许可证',
      default: 'mit',
      choices: licenseTypeList.map((license, i) => ({
        name: license,
        checked: i === 0,
      })),
    },
  ])
  return options as any
}

/**
 * 询问模板的类型
 */
async function promptTemplateType(): Promise<TemplateType> {
  const { type } = await prompt([
    {
      type: 'list',
      name: 'type',
      message: '请选择需要的模板',
      default: 'mit',
      choices: Object.values(TemplateType).map((name, i) => ({
        name,
        checked: i === 0,
      })),
    },
  ])
  return type as any
}

/**
 * 创建一个 JavaScript 项目
 * @param projectDir 项目绝对路径
 */
async function createJavaScriptFunc(projectDir: string) {
  // 询问选项
  const settings = await promptInput(JSPlugin)
  if (!settings) {
    return
  }

  // 初始化 babel
  const options: JSPlugin[] = settings.options
  const plugins: BasePlugin[] = []
  if (options.includes(JSPlugin.Babel)) {
    const plugin = new BabelPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(JSPlugin.Jest)) {
    if (!options.includes(JSPlugin.Babel)) {
      const { confirm } = await prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message:
            '如果选择了 Jest 插件，则必须选择 Babel 插件，是否选择 Babel 并继续？',
          default: true,
        },
      ])
      if (!confirm) {
        console.log('已取消')
        return
      }
      const plugin = new BabelPlugin()
      plugin.projectDir = projectDir
      plugins.push(plugin)
    }
    const plugin = new JestPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(JSPlugin.ESLint)) {
    const plugin = new ESLintPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(JSPlugin.Prettier)) {
    const plugin = new PrettierPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(JSPlugin.Staged)) {
    const plugin = new StagedPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(JSPlugin.ESDoc)) {
    const plugin = new ESDocPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }

  if (options.includes(JSPlugin.License)) {
    const license = await promptLicense()
    const plugin = new LicensePlugin()
    plugin.projectDir = projectDir
    plugin.license = license
    plugins.push(plugin)
  }

  // 初始化项目，例如修改项目名
  initProject(projectDir, TemplateType.JavaScript)

  const pluginIdList = plugins.map((plugin) => plugin.id)
  plugins
    .map((plugin) => {
      plugin.plugins = pluginIdList
      plugin.type = TemplateType.JavaScript
      plugin.handle()
      return plugin
    })
    .forEach((plugin) => plugin.integrated())
}

/**
 * 创建一个 TypeScript 项目
 * @param projectDir 项目绝对路径
 */
async function createTypeScriptFunc(projectDir: string) {
  const settings = await promptInput(TSPlugin)
  if (!settings) {
    return
  }

  // 初始化 babel
  const options: TSPlugin[] = settings.options
  const plugins: BasePlugin[] = []
  if (options.includes(TSPlugin.Jest)) {
    const plugin = new JestTSPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(TSPlugin.ESLint)) {
    const plugin = new ESLintTSPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(TSPlugin.Prettier)) {
    const plugin = new PrettierPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(TSPlugin.TypeDoc)) {
    const plugin = new TypeDocPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(TSPlugin.Staged)) {
    const plugin = new StagedPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(TSPlugin.License)) {
    const license = await promptLicense()
    const plugin = new LicensePlugin()
    plugin.projectDir = projectDir
    plugin.license = license
    plugins.push(plugin)
  }

  // 初始化项目，例如修改项目名
  initProject(projectDir, TemplateType.TypeScript)

  const pluginIdList = plugins.map((plugin) => plugin.id)
  plugins
    .map((plugin) => {
      plugin.plugins = pluginIdList
      plugin.type = TemplateType.TypeScript
      plugin.handle()
      return plugin
    })
    .forEach((plugin) => plugin.integrated())
}

/**
 * 创建一个 Cli 项目
 * @param projectDir
 */
async function createCliFunc(projectDir: string) {
  // 初始化项目，例如修改项目名
  initProject(projectDir, TemplateType.Cli)
}

program
  .option('-d, --debug', '输出内部调试信息')
  // 版本号
  .version(
    appInfo.version,
    '-v, --version',
    `@liuli-moe/cli ${appInfo.version}`,
  )
  //子命令 create
  .command('create <project-name>')
  .description('创建一个 JavaScript/TypeScript SDK 项目')
  .action(async (projectPath) => {
    // 获取当前路径
    const projectDir = resolve(process.cwd(), projectPath)
    // 检查文件夹是否已存在
    if (pathExistsSync(projectDir)) {
      const { isCovering } = await prompt([
        {
          type: 'confirm',
          name: 'isCovering',
          message: '文件夹已存在，是否确认覆盖？',
          default: false,
        },
      ])
      if (!isCovering) {
        console.log('已取消')
        return
      }
    }
    const type = await promptTemplateType()
    switch (type) {
      case TemplateType.JavaScript:
        await createJavaScriptFunc(projectDir)
        break
      case TemplateType.TypeScript:
        await createTypeScriptFunc(projectDir)
        break
      case TemplateType.Cli:
        await createCliFunc(projectDir)
        break
    }
    // 做最后的准备工作
    execReady(projectDir)
  })

// 真正开始解析命令
program.parse(process.argv)
