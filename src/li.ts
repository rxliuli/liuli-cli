import {Command} from 'commander'
import {resolve} from 'path'
import appInfo from '../package.json'
import {prompt} from 'inquirer'
import {execReady} from './execReady'
import {initProject} from './initProject'
import {initBabel} from './plugin/babel'
import {copySync, pathExistsSync, removeSync} from 'fs-extra'
import {Plugin} from './plugin/base/constant'
import {initJestJS} from "./plugin/jest";
import {initESLint} from "./plugin/eslint";
import {initPrettier} from "./plugin/prettier";
import {initESDoc} from "./plugin/esdoc";
import {initStaged} from "./plugin/staged";
import {initLicense} from "./plugin/license";
import {licenseType} from "./plugin/license/licenseType";

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
    if (pathExistsSync(projectDir)) {
        const {isCovering} = await prompt([
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
            choices: [...Object.keys(Plugin)].filter(k => isNaN(k as any)).map((k, i) => ({
                name: k,
                value: Plugin[k as any],
                checked: i === 0
            }))
        },
    ])
}

/**
 * 下载模板项目
 * @param projectName
 */
function copyTemplate(projectName: string) {
    return copySync(
        resolve(__dirname, '../template/javascript'),
        resolve(process.cwd(), projectName),
    )
}

// 创建子命令 create
program
    .command('create <project-name>')
    .description('创建一个 JavaScript SDK 项目')
    .action(async function (projectPath) {
        // 获取当前路径
        const projectDir = resolve(process.cwd(), projectPath)
        if (await checkDirExist(projectDir)) {
            console.log('已取消')
            return
        }
        removeSync(projectDir)
        // 询问选项
        const settings = await promptInput()
        if (!settings) {
            return
        }

        try {
            // 下载基本模板
            await copyTemplate(projectPath)
        } catch (err) {
            console.log(err)
            return
        }

        // 初始化项目，例如修改项目名
        initProject(projectDir)

        // 初始化 babel
        const options: Plugin[] = settings.options;
        if (options.includes(Plugin.Babel)) {
            initBabel(projectDir)
        }
        if (options.includes(Plugin.Jest)) {
            initJestJS(projectDir)
        }
        if (options.includes(Plugin.ESLint)) {
            initESLint(projectDir, options)
        }
        if (options.includes(Plugin.Prettier)) {
            initPrettier(projectDir)
        }
        if (options.includes(Plugin.Staged)) {
            initStaged(projectDir)
        }
        if (options.includes(Plugin.ESDoc)) {
            initESDoc(projectDir)
        }
        if (options.includes(Plugin.LICENSE)) {
            const license = await prompt([
                {
                    type: 'list',
                    name: 'options',
                    message: '请选择需要的许可证',
                    choices: licenseType.map((license, i) => ({
                        name: license,
                        checked: i === 0
                    }))
                },
            ])
            initLicense(projectDir, license.options)
        }

        // 做最后的准备工作
        execReady(projectDir)
    })

// 真正开始解析命令
program.parse(process.argv)
