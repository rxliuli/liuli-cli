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

const program = new Command()

// 一些参数
program
  .option('-d, --debug', '输出内部调试信息')
  // 版本号
  .version(appInfo.version, '-v, --version', 'liuli-cli version')

// 创建子命令 create
program
  .command('create <project-name>')
  .description('创建一个 JavaScript SDK 项目')
  .action(async function(projectName) {
    // 获取当前路径
    const currentPath = resolve(process.cwd())
    const projectDir = resolve(currentPath, projectName)
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
      if (!isCovering) {
        console.log('已取消')
        return
      }
    }

    const settings = await prompt([
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
      // 初始化项目
    ;(function() {
      const jsTemplate = 'https://github.com/rxliuli/javascript-template'
      
      
    })()
    // 初始化 babel
    if (settings.options.includes(BabelPlugin)) {
    }
  })

// 真正开始解析命令
program.parse(process.argv)
