import { Command } from 'commander'
import { resolve } from 'path'
import appInfo from '../package.json'
import { prompt } from 'inquirer'
import { execReady } from './execReady'
import { initProject } from './initProject'
import { BabelPlugin } from './plugin/babel'
import { copySync, pathExistsSync, removeSync } from 'fs-extra'
import { Plugin } from './plugin/base/constant'
import { JestPlugin } from './plugin/jest'
import { ESLintPlugin } from './plugin/eslint'
import { PrettierPlugin } from './plugin/prettier'
import { ESDocPlugin } from './plugin/esdoc'
import { StagedPlugin } from './plugin/staged'
import { LicensePlugin } from './plugin/license'
import { licenseTypeList } from './plugin/license/licenseTypeList'
import { BasePlugin } from './plugin/base/BasePlugin'
import { LicenseType } from 'create-license'
import { TemplateType } from './util/TemplateType'

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
async function promptInput() {
  return prompt([
    {
      type: 'checkbox',
      name: 'options',
      message: '请选择需要的组件',
      suffix: '请按下空格',
      choices: [...Object.keys(Plugin)]
        .filter(k => isNaN(k as any))
        .map((k, i) => ({
          name: k,
          value: Plugin[k as any],
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
      message: '请选择需要的许可证',
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
 * @param projectPath 项目相对路径
 */
async function createJavaScriptFunc(projectPath: string) {
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
  removeSync(projectDir)
  // 询问选项
  const settings = await promptInput()
  if (!settings) {
    return
  }

  // 复制基本模板
  copySync(resolve(__dirname, '../template/javascript'), projectDir)

  // 初始化项目，例如修改项目名
  initProject(projectDir)

  // 初始化 babel
  const options: Plugin[] = settings.options
  const plugins: BasePlugin[] = []
  if (options.includes(Plugin.Babel)) {
    const plugin = new BabelPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(Plugin.Jest)) {
    if (!options.includes(Plugin.Babel)) {
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
  if (options.includes(Plugin.ESLint)) {
    const plugin = new ESLintPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(Plugin.Prettier)) {
    const plugin = new PrettierPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(Plugin.Staged)) {
    const plugin = new StagedPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }
  if (options.includes(Plugin.ESDoc)) {
    const plugin = new ESDocPlugin()
    plugin.projectDir = projectDir
    plugins.push(plugin)
  }

  if (options.includes(Plugin.LICENSE)) {
    const license = await promptLicense()
    console.log(license)
    const plugin = new LicensePlugin()
    plugin.projectDir = projectDir
    plugin.license = license
    plugins.push(plugin)
  }

  const pluginIdList = plugins.map(plugin => plugin.id)
  plugins
    .map(plugin => {
      plugin.plugins = pluginIdList
      plugin.handle()
      return plugin
    })
    .forEach(plugin => plugin.integrated())

  // 做最后的准备工作
  execReady(projectDir)
}

/**
 * 创建一个 TypeScript 项目
 * @param projectPath 项目相对路径
 */
async function createTypeScriptFunc(projectPath: string) {}

/**
 * 创建一个 Cli 项目
 * @param projectPath
 */
async function createCliFunc(projectPath: string) {}

program
  .option('-d, --debug', '输出内部调试信息')
  // 版本号
  .version(appInfo.version, '-v, --version', '@liuli-moe/cli 的版本')
  //子命令 create
  .command('create <project-name>')
  .description('创建一个 JavaScript SDK 项目')
  .action(async projectPath => {
    switch (await promptTemplateType()) {
      case TemplateType.JavaScript:
        await createJavaScriptFunc(projectPath)
        break
      case TemplateType.TypeScript:
        await createTypeScriptFunc(projectPath)
        break
      case TemplateType.Cli:
        await createCliFunc(projectPath)
        break
    }
  })

// 真正开始解析命令
program.parse(process.argv)
