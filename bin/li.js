#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var commander = require('commander');
var path = require('path');
var inquirer = require('inquirer');
var shell = _interopDefault(require('shelljs'));
var fs = require('fs');
var sortPackageJson = _interopDefault(require('sort-package-json'));
var fsExtra = require('fs-extra');
var core = require('@babel/core');
var types = require('@babel/types');
var parser = require('@babel/parser');
var lodash = require('lodash');
var createLicense = _interopDefault(require('create-license'));
var username = _interopDefault(require('username'));

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
	"test:create": "yarn li test/node-example",
	"link:add": "yarn link && yarn link %npm_package_name%",
	"link:remove": "yarn unlink %npm_package_name% && yarn unlink",
	postinstall: "yarn link:add && yarn link:remove && yarn link:add"
};
var devDependencies = {
	"@babel/types": "^7.6.3",
	"@types/app-root-path": "^1.2.4",
	"@types/fs-extra": "^8.0.1",
	"@types/inquirer": "^6.5.0",
	"@types/jest": "^24.0.21",
	"@types/lodash": "^4.14.144",
	"@types/node": "^12.11.7",
	"@types/rollup": "^0.54.0",
	"@types/shelljs": "^0.8.5",
	"@types/username": "^3.0.0",
	"app-root-path": "^3.0.0",
	jest: "^24.9.0",
	"jest-extended": "^0.11.2",
	nodeman: "^1.1.2",
	nodemon: "^1.19.4",
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
	"create-license": "^1.0.2",
	"download-git-repo": "^3.0.2",
	"fs-extra": "^8.1.0",
	inquirer: "^7.0.0",
	lodash: "^4.17.15",
	shelljs: "^0.8.3",
	username: "^5.1.0"
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

// 格式化 package.json
/**
 * 格式化 package.json
 * @param projectDir 项目目录路径
 */
function formatPackageJSON(projectDir) {
    const pkgPath = path.resolve(projectDir, 'package.json');
    const data = fsExtra.readJSONSync(pkgPath);
    fs.writeFileSync(pkgPath, JSON.stringify(sortPackageJson(data), null, 2));
}

/**
 * 执行一些准备工作
 * @param projectDir
 */
function execReady(projectDir) {
    formatPackageJSON(projectDir);
    // 安装依赖
    shell.cd(projectDir);
    shell.exec('yarn && yarn clean && yarn build');
}

/**
 * 一些初始化操作，修改项目名
 * @param projectDir
 */
function initProject(projectDir) {
    const packagePath = path.resolve(projectDir, 'package.json');
    const json = fsExtra.readJSONSync(packagePath);
    const projectPathList = projectDir.split(path.sep);
    json.name = projectPathList[projectPathList.length - 1];
    fsExtra.writeJSONSync(packagePath, json);
}

var dep = {
	"@babel/core": "^7.2.2",
	"@babel/preset-env": "^7.3.1",
	"rollup-plugin-babel": "^4.3.2"
};

/**
 * 初始化 babel 插件
 * @param {*} projectDir
 */
function initBabel(projectDir) {
    // TODO 修改为 fs-extra 模块，添加 generator 目录放置模板
    const packagePath = path.resolve(projectDir, 'package.json');
    const data = fs.readFileSync(packagePath, {
        encoding: 'utf8',
    });
    const json = JSON.parse(data);
    // 修改 JSON 部分
    json.devDependencies = Object.assign(Object.assign({}, json.devDependencies), dep);
    fs.writeFileSync(packagePath, JSON.stringify(json, null, 2));
    formatPackageJSON(projectDir);
    // 复制文件
    const babelName = '.babelrc';
    fs.copyFileSync(path.resolve(__dirname, babelName), path.resolve(projectDir, babelName));
    //修改 base dev 配置
    const babelPluginImport = core.parseSync("import babel from 'rollup-plugin-babel'").program.body[0];
    const babelPluginConfig = parser.parseExpression(`
      babel({
        exclude: '../node_modules/**'
      })
    `);
    const rollupConfigPath = path.resolve(projectDir, 'build/rollup.config.base.js');
    const str = fs.readFileSync(rollupConfigPath, {
        encoding: 'utf8',
    });
    const ast = core.parseSync(str);
    // 找到最后一个 import 的位置，没有找到则放置到 0
    const index = lodash.findLastIndex(ast.program.body, node => types.isImportDeclaration(node)) + 1;
    // 添加 import
    ast.program.body = [
        ...ast.program.body.slice(0, index),
        babelPluginImport,
        ...ast.program.body.slice(index),
    ];
    // 修改默认导出的值
    const exportDefaultNode = ast.program.body.find(node => types.isExportDefaultDeclaration(node));
    const plugins = exportDefaultNode.declaration.properties.find(node => types.isObjectProperty(node) &&
        node.key.name === 'plugins').value;
    plugins.elements.push(babelPluginConfig);
    fs.writeFileSync(rollupConfigPath, core.transformFromAstSync(ast).code, {
        encoding: 'utf8',
    });
}

var Plugin;
(function (Plugin) {
    Plugin["BabelPlugin"] = "Babel";
    Plugin["ESLintPlugin"] = "ESLint";
    Plugin["PrettierPlugin"] = "Prettier";
    Plugin["JestPlugin"] = "JEST";
    Plugin["ESDocPlugin"] = "ESDoc";
    Plugin["Staged"] = "Staged";
    Plugin["LICENSE"] = "LICENSE";
})(Plugin || (Plugin = {}));

var jest = "^24.5.0";
var dep$1 = {
	"@types/jest": "^24.0.12",
	jest: jest,
	"jest-extended": "^0.11.1"
};

/**
 * 初始化 jest 配置
 * @param projectDir
 */
function initJestJS(projectDir) {
    const packagePath = path.resolve(projectDir, 'package.json');
    const json = fsExtra.readJSONSync(packagePath);
    // 修改 JSON 部分
    json.devDependencies = Object.assign(Object.assign({}, json.devDependencies), dep$1);
    json.scripts = Object.assign(Object.assign({}, json.scripts), { test: 'jest --all' });
    fsExtra.writeJSONSync(packagePath, json);
    // 拷贝配置文件
    fsExtra.copySync(path.resolve(__dirname, 'generator/jest.config.js'), path.resolve(projectDir, 'jest.config.js'));
    // 拷贝一个基本的测试文件
    const path$1 = path.resolve(projectDir, 'test/index.test.js');
    fsExtra.copySync(path.resolve(__dirname, 'generator/index.test.js'), path$1);
    const data = fsExtra.readFileSync(path$1, {
        encoding: 'utf8',
    }).replace('javascript-template', lodash.last(projectDir.split(path.sep)));
    fs.writeFileSync(path$1, data);
}

var eslint = "^5.15.3";
var dep$2 = {
	eslint: eslint,
	"eslint-config-standard": "^12.0.0",
	"eslint-plugin-import": "^2.14.0",
	"eslint-plugin-node": "^8.0.1",
	"eslint-plugin-promise": "^4.0.1",
	"eslint-plugin-standard": "^4.0.0"
};

var jestDep = {
	"eslint-plugin-jest": "^22.4.1"
};

var prettierDep = {
	"eslint-config-prettier": "^6.5.0",
	"eslint-plugin-prettier": "^3.1.1"
};

/**
 * 更新 json 文件
 * @param file
 * @param fn
 */
function updateJSONFile(file, fn) {
    const path$1 = path.resolve(file);
    const json = fsExtra.readJSONSync(path$1);
    const res = fn(json);
    fsExtra.writeJSONSync(path$1, res === undefined ? json : res, {
        spaces: 2,
    });
}

/**
 * 初始化 ESLint
 */
function initESLint(projectDir, plugins = []) {
    // 修改 JSON 部分
    updateJSONFile(path.resolve(projectDir, 'package.json'), json => {
        json.devDependencies = Object.assign(Object.assign({}, json.devDependencies), dep$2);
        json.scripts = Object.assign(Object.assign({}, json.scripts), { test: 'jest --all' });
    });
    // 拷贝配置文件
    fsExtra.copySync(path.resolve(__dirname, 'generator/.eslintrc'), path.resolve(projectDir, '.eslintrc'));
    fsExtra.copySync(path.resolve(__dirname, 'generator/.eslintignore'), path.resolve(projectDir, '.eslintignore'));
    if (plugins.includes(Plugin.JestPlugin)) {
        integratedJest(projectDir);
    }
    if (plugins.includes(Plugin.PrettierPlugin)) {
        integratedPrettier(projectDir);
    }
}
// 处理与 jest 的集成
function integratedJest(projectDir) {
    updateJSONFile(path.resolve(projectDir, 'package.json'), json => {
        json.devDependencies = Object.assign(Object.assign({}, json.devDependencies), jestDep);
    });
    updateJSONFile(path.resolve(projectDir, '.eslintrc'), json => {
        json.env = Object.assign(Object.assign({}, json.env), { 'jest/globals': true });
    });
}
// 处理与 prettier 的集成
function integratedPrettier(projectDir) {
    // 更新依赖
    updateJSONFile(path.resolve(projectDir, 'package.json'), json => {
        json.devDependencies = Object.assign(Object.assign({}, json.devDependencies), prettierDep);
    });
    updateJSONFile(path.resolve(projectDir, '.eslintrc'), json => {
        json.extends = [...json.extends, 'plugin:prettier/recommended'];
    });
}

var prettier = "^1.18.2";
var dep$3 = {
	prettier: prettier,
	"prettier-config-standard": "^1.0.1"
};

/**
 * 初始化 prettier 标准格式化工具
 * @param projectDir
 */
function initPrettier(projectDir) {
    //更新 package.json
    updateJSONFile(path.resolve(projectDir, 'package.json'), json => {
        json.devDependencies = Object.assign(Object.assign({}, json.devDependencies), dep$3);
        json.scripts = Object.assign(Object.assign({}, json.scripts), { format: 'prettier --write src/**/*.js' });
    });
    //拷贝配置文件
    fsExtra.copySync(path.resolve(__dirname, 'generator/.prettierrc.js'), path.resolve(projectDir, '.prettierrc.js'));
}

var esdoc = "^1.1.0";
var dep$4 = {
	esdoc: esdoc,
	"esdoc-standard-plugin": "^1.0.0"
};

/**
 * 初始化
 * @param projectDir
 */
function initESDoc(projectDir) {
    //更新 json 文件
    updateJSONFile(path.resolve(projectDir, 'package.json'), json => {
        json.devDependencies = Object.assign(Object.assign({}, json.devDependencies), dep$4);
        json.scripts = Object.assign(Object.assign({}, json.scripts), { docs: 'esdoc' });
    });
    // 拷贝配置文件
    fsExtra.copySync(path.resolve(__dirname, './generator/.esdoc.json'), path.resolve(projectDir, '.esdoc.json'));
}

var husky = "^3.0.5";
var dep$5 = {
	husky: husky,
	"lint-staged": "^9.3.0"
};

//初始化 lint-staged
function initStaged(projectDir) {
    updateJSONFile(path.resolve(projectDir, 'package.json'), json => {
        json.devDependencies = Object.assign(Object.assign({}, json.devDependencies), dep$5);
    });
    fsExtra.copySync(path.resolve(__dirname, 'generator/.huskyrc'), path.resolve(projectDir, '.huskyrc'));
    fsExtra.copySync(path.resolve(__dirname, 'generator/.lintstagedrc'), path.resolve(projectDir, '.lintstagedrc'));
}

// 初始化 license
function initLicense(projectDir, license) {
    console.log(lodash.last(projectDir.split(path.sep)));
    createLicense(projectDir, license, {
        year: new Date().getFullYear(),
        author: username.sync(),
        project: lodash.last(projectDir.split(path.sep)),
    });
}

const licenseType = [
    'agpl',
    'apache',
    'artistic',
    'bsd-3-clause',
    'bsd',
    'cc0',
    'eclipse',
    'gpl-v2',
    'gpl-v3',
    'lgpl-v2.1',
    'lgpl-v3',
    'mit',
    'mozilla',
    'no-license',
    'unlicense',
    'wtfpl'
];

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
 * @param projectDir
 */
function checkDirExist(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        // 检查文件夹是否已存在
        if (fsExtra.pathExistsSync(projectDir)) {
            const { isCovering } = yield inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'isCovering',
                    message: '文件夹已存在，是否确认覆盖？',
                    default: false,
                },
            ]);
            return !isCovering;
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
            suffix: '请按下空格',
            choices: [
                {
                    name: Plugin.BabelPlugin,
                    checked: true,
                },
                {
                    name: Plugin.ESLintPlugin,
                    checked: false,
                },
                {
                    name: Plugin.PrettierPlugin,
                    checked: false,
                },
                {
                    name: Plugin.JestPlugin,
                    checked: false,
                },
                {
                    name: Plugin.ESDocPlugin,
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
    return fsExtra.copySync(path.resolve(__dirname, '../template/javascript'), path.resolve(process.cwd(), 'projectName'));
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
        if (yield checkDirExist(projectDir)) {
            console.log('已取消');
            return;
        }
        fsExtra.removeSync(projectDir);
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
        initProject(projectDir);
        // 初始化 babel
        const options = settings.options;
        if (options.includes(Plugin.BabelPlugin)) {
            initBabel(projectDir);
        }
        if (options.includes(Plugin.JestPlugin)) {
            initJestJS(projectDir);
        }
        if (options.includes(Plugin.ESLintPlugin)) {
            initESLint(projectDir, options);
        }
        if (options.includes(Plugin.PrettierPlugin)) {
            initPrettier(projectDir);
        }
        if (options.includes(Plugin.Staged)) {
            initStaged(projectDir);
        }
        if (options.includes(Plugin.ESDocPlugin)) {
            initESDoc(projectDir);
        }
        if (options.includes(Plugin.LICENSE)) {
            const license = yield inquirer.prompt([
                {
                    type: 'list',
                    name: 'options',
                    message: '请选择需要的许可证',
                    choices: licenseType.map((license, i) => ({
                        name: license,
                        checked: i === 0
                    }))
                },
            ]);
            console.log(license);
            initLicense(projectDir, license);
        }
        // 做最后的准备工作
        execReady(projectDir);
        return;
    });
});
// 真正开始解析命令
program.parse(process.argv);
