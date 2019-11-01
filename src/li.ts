import { Command } from 'commander'
import { resolve } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'mz/fs'
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
  .version(appInfo.version, '-v, --version', 'liuli-cli version')

/**
 * 检查项目名是否在当前目录已经存在
 * @param projectName
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
    if (isCovering) {
      return true
    }
    console.log('已取消')
    return false
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
    if (!checkDirExist(projectDir)) {
      return
    }
    const settings = await promptInput()
    if (!settings) {
      return
    }

    try {
      await downloadTemplate(projectName)
    } catch (err) {
      console.log(err)
      return
    }

    initProject(projectDir, projectName)

    execReady(projectDir)
    return

    // 初始化 babel
    if (settings.options.includes(BabelPlugin)) {
      // TODO 这里应该默认设置打包目标为 ES5
    }
  })

// 真正开始解析命令
program.parse(process.argv)
