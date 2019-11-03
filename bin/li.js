#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var commander = require('commander');
var path = require('path');
var fs = require('mz/fs');
var inquirer = require('inquirer');
var download = _interopDefault(require('download-git-repo'));
var shell = _interopDefault(require('shelljs'));
var fs$1 = require('fs');
var sortPackageJson = _interopDefault(require('sort-package-json'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var name = "@liuli-moe/cli";
var version = "0.1.0";
var description = "一个 JavaScript/TypeScript SDK cli 工具";
var main = "bin/npm.js";
var author = "rxliuli";
var license = "MIT";
var bin = {
	li: "./bin/li.js"
};
var scripts = {
	li: "ts-node -O \"{\\\"module\\\": \\\"commonjs\\\"}\" src/li.ts",
	dev: "nodemon -w src/li.ts --exec \"yarn li\"",
	build: "rollup -c rollup.config.js",
	"link:add": "yarn link && yarn link %npm_package_name%",
	"link:remove": "yarn unlink %npm_package_name% && yarn unlink"
};
var devDependencies = {
	"@babel/types": "^7.6.3",
	"@types/inquirer": "^6.5.0",
	"@types/jest": "^24.0.21",
	"@types/mz": "^0.0.32",
	"@types/node": "^12.11.7",
	"@types/rollup": "^0.54.0",
	"@types/shelljs": "^0.8.5",
	jest: "^24.9.0",
	"jest-extended": "^0.11.2",
	nodeman: "^1.1.2",
	prettier: "^1.18.2",
	rollup: "^1.26.2",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-terser": "^5.1.2",
	"rollup-plugin-typescript2": "^0.24.3",
	"sort-package-json": "^1.22.1",
	"ts-jest": "^24.1.0",
	"ts-node": "^8.4.1",
	tslib: "^1.10.0",
	typescript: "^3.6.4"
};
var dependencies = {
	"@babel/core": "^7.6.4",
	"@babel/parser": "^7.6.4",
	"@babel/traverse": "^7.6.3",
	commander: "^3.0.2",
	"download-git-repo": "^3.0.2",
	inquirer: "^7.0.0",
	mz: "^2.7.0",
	shelljs: "^0.8.3"
};
var appInfo = {
	name: name,
	version: version,
	description: description,
	main: main,
	author: author,
	license: license,
	"private": true,
	bin: bin,
	scripts: scripts,
	devDependencies: devDependencies,
	dependencies: dependencies
};

const BabelPlugin = 'Babel';
const ESLintPlugin = 'ESLint';
const PrettierPlugin = 'Prettier';
const JestPlugin = 'JEST';
const ESDocPlugin = 'ESDoc';

/**
 * 执行一些准备工作
 * @param projectDir
 */
function execReady(projectDir) {
    // 格式化 package.json
    const pkgPath = path.resolve(projectDir, 'package.json');
    const data = fs$1.readFileSync(pkgPath, {
        encoding: 'utf8',
    });
    fs$1.writeFileSync(pkgPath, JSON.stringify(sortPackageJson(JSON.parse(data)), null, 2));
    // 安装依赖
    shell.cd(projectDir);
    shell.exec('yarn && yarn clean && yarn build');
}
// execReady(resolve(process.cwd(), 'test/node-example'))

/**
 * 一些初始化操作，修改项目名
 * @param projectDir
 */
function initProject(projectDir, projectName) {
    const packagePath = path.resolve(projectDir, 'package.json');
    const data = fs$1.readFileSync(packagePath, {
        encoding: 'utf8',
    });
    const json = JSON.parse(data);
    const projectPathList = projectName.split('/');
    json.name = projectPathList[projectPathList.length - 1];
    fs$1.writeFileSync(packagePath, JSON.stringify(json, null, 2));
}
// initProject(resolve(process.cwd(), 'test/node-example'), 'node-example')

/**
 * 1. 向用户询问一些选项
 * 2. 下载模板项目
 * 3. 根据选项修改模板项目
 * 4. 初始化安装和运行
 */
const program = new commander.Command();
// 一些参数
program
    .option('-d, --debug', '输出内部调试信息')
    // 版本号
    .version(appInfo.version, '-v, --version', '@liuli-moe/cli 的版本');
/**
 * 检查项目名是否在当前目录已经存在
 * @param projectName
 */
function checkDirExist(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        // 检查文件夹是否已存在
        if (fs.existsSync(projectDir)) {
            const { isCovering } = yield inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'isCovering',
                    message: '文件夹已存在，是否确认覆盖？',
                    default: false,
                },
            ]);
            if (isCovering) {
                return true;
            }
            console.log('已取消');
            return false;
        }
    });
}
/**
 * 询问一些选项
 */
function promptInput() {
    return inquirer.prompt([
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
    ]);
}
/**
 * 下载模板项目
 * @param projectName
 */
function downloadTemplate(projectName) {
    return new Promise((resolve, reject) => {
        const jsTemplate = 'rxliuli/javascript-template';
        download(jsTemplate, projectName, err => {
            return err ? reject(err) : resolve();
        });
    });
}
// 创建子命令 create
program
    .command('create <project-name>')
    .description('创建一个 JavaScript SDK 项目')
    .action(function (projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        // 获取当前路径
        const currentPath = path.resolve(process.cwd());
        const projectDir = path.resolve(currentPath, projectName);
        if (!checkDirExist(projectDir)) {
            return;
        }
        // 询问选项
        const settings = yield promptInput();
        if (!settings) {
            return;
        }
        try {
            // 下载基本模板
            yield downloadTemplate(projectName);
        }
        catch (err) {
            console.log(err);
            return;
        }
        // 初始化项目，例如修改项目名
        initProject(projectDir, projectName);
        // 做最后的准备工作
        execReady(projectDir);
        return;
    });
});
// 真正开始解析命令
program.parse(process.argv);
//# sourceMappingURL=li.js.map
