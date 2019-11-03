import { Command } from 'commander'
import { resolve } from 'path'
import { existsSync } from 'mz/fs'
import appInfo from '../package.json'
import { prompt } from 'inquirer'
import {
  BabelPlugin,
  ESLintPlugin,
  PrettierPlugin,
  JestPlugin,
  ESDocPlugin,
} from './constant'
import download from 'download-git-repo'
import { execReady } from './execReady'
import { initProject } from './initProject'
import { initBabel } from './plugin/babel'
import rimraf from 'rimraf'

/**
 * 1. 向用户询问一些选项
 * 2. 下载模板项目
 * 3. 根据选项修改模板项目
 * 4. 初始化安装和运行
 */
const program = new Command()

// 一些参数
program
  .option('-d, --debug', '输出内部调试信息')
  // 版本号
  .version(appInfo.version, '-v, --version', '@liuli-moe/cli 的版本')

/**
 * 检查项目名是否在当前目录已经存在
 * @param projectDir
 */
async function checkDirExist(projectDir: string) {
  // 检查文件夹是否已存在
  if (existsSync(projectDir)) {
    const { isCovering } = await prompt([
      {
        type: 'confirm',
        name: 'isCovering',
        message: '文件夹已存在，是否确认覆盖？',
        default: false,
      },
    ])
    return !isCovering
  }
}

/**
 * 询问一些选项
 */
function promptInput() {
  return prompt([
    {
      type: 'checkbox',
      name: 'options',
      message: '请选择需要的组件',
      suffix: '请按下空格',
      choices: [
        {
          name: BabelPlugin,
          checked: true,
        },
        {
          name: ESLintPlugin,
          checked: false,
        },
        {
          name: PrettierPlugin,
          checked: false,
        },
        {
          name: JestPlugin,
          checked: false,
        },
        {
          name: ESDocPlugin,
          checked: false,
        },
      ],
    },
  ])
}

/**
 * 下载模板项目
 * @param projectName
 */
function downloadTemplate(projectName: string) {
  return new Promise((resolve, reject) => {
    const jsTemplate = 'rxliuli/javascript-template'
    download(jsTemplate, projectName, err => {
      return err ? reject(err) : resolve()
    })
  })
}

// 创建子命令 create
program
  .command('create <project-name>')
  .description('创建一个 JavaScript SDK 项目')
  .action(async function(projectName) {
    // 获取当前路径
    const currentPath = resolve(process.cwd())
    const projectDir = resolve(currentPath, projectName)
    if (await checkDirExist(projectDir)) {
      console.log('已取消')
      return
    }
    rimraf.sync(projectDir)
    // 询问选项
    const settings = await promptInput()
    if (!settings) {
      return
    }

    try {
      // 下载基本模板
      await downloadTemplate(projectName)
    } catch (err) {
      console.log(err)
      return
    }

    // 初始化项目，例如修改项目名
    initProject(projectDir, projectName)

    // 初始化 babel
    if (settings.options.includes(BabelPlugin)) {
      initBabel(projectDir)
    }

    // 做最后的准备工作
    execReady(projectDir)
    return
  })

// 真正开始解析命令
program.parse(process.argv)
