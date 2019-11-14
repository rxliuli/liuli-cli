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
var merge = _interopDefault(require('deepmerge'));
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
	postinstall: "yarn link:add && yarn link:remove && yarn link:add",
	pkg: "pkg . --out-path=dist/ -t win"
};
var devDependencies = {
	"@babel/types": "^7.6.3",
	"@types/app-root-path": "^1.2.4",
	"@types/deepmerge": "^2.2.0",
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
	pkg: "^4.4.0",
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
	deepmerge: "^4.2.2",
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

var devDependencies$1 = {
	"@babel/core": "^7.2.2",
	"@babel/preset-env": "^7.3.1",
	"rollup-plugin-babel": "^4.3.2"
};
var pkgJSON = {
	devDependencies: devDependencies$1
};

/**
 * 基础的插件接口，所有的接口
 */
class BasePlugin {
    constructor(id) {
        /**
         * 项目的根目录
         */
        this.projectDir = '';
        /**
         * 项目依赖的插件 ID 列表
         */
        this.plugins = [];
        this.id = id;
    }
    /**
     * 可选择的集成其他插件时的操作
     */
    integrated() { }
}

var Plugin;
(function (Plugin) {
    Plugin[Plugin["Babel"] = 0] = "Babel";
    Plugin[Plugin["ESLint"] = 1] = "ESLint";
    Plugin[Plugin["Prettier"] = 2] = "Prettier";
    Plugin[Plugin["Jest"] = 3] = "Jest";
    Plugin[Plugin["ESDoc"] = 4] = "ESDoc";
    Plugin[Plugin["Staged"] = 5] = "Staged";
    Plugin[Plugin["LICENSE"] = 6] = "LICENSE";
})(Plugin || (Plugin = {}));

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

class BabelPlugin extends BasePlugin {
    constructor() {
        super(Plugin.Babel);
    }
    handle() {
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON));
        // 复制文件
        const babelName = '.babelrc';
        fsExtra.copySync(path.resolve(__dirname, 'generator', babelName), path.resolve(this.projectDir, babelName));
        //修改 base dev 配置
        const babelPluginImport = core.parseSync("import babel from 'rollup-plugin-babel'").program.body[0];
        const babelPluginConfig = parser.parseExpression(`
      babel({
        exclude: '../node_modules/**'
      })
    `);
        const rollupConfigPath = path.resolve(this.projectDir, 'build/rollup.config.base.js');
        const str = fsExtra.readFileSync(rollupConfigPath, {
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
        fsExtra.writeFileSync(rollupConfigPath, core.transformFromAstSync(ast).code, {
            encoding: 'utf8',
        });
    }
}

var scripts$1 = {
	test: "jest --all"
};
var devDependencies$2 = {
	"@types/jest": "^24.0.12",
	jest: "^24.5.0",
	"jest-extended": "^0.11.1"
};
var pkgJSON$1 = {
	scripts: scripts$1,
	devDependencies: devDependencies$2
};

class JestPlugin extends BasePlugin {
    constructor() {
        super(Plugin.Jest);
        this.jestName = 'jest.config.js';
        this.testName = 'index.test.js';
    }
    handle() {
        // 修改 JSON 部分
        path.resolve(this.projectDir, 'package.json');
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$1));
        // 拷贝配置文件
        fsExtra.copySync(path.resolve(__dirname, 'generator', this.jestName), path.resolve(this.projectDir, this.jestName));
        // 拷贝一个基本的测试文件
        const path$1 = path.resolve(this.projectDir, 'test', this.testName);
        fsExtra.copySync(path.resolve(__dirname, 'generator', this.testName), path$1);
        const data = fsExtra.readFileSync(path$1, {
            encoding: 'utf8',
        }).replace('javascript-template', lodash.last(this.projectDir.split(path.sep)));
        fs.writeFileSync(path$1, data);
    }
}

var scripts$2 = {
	test: "jest --all"
};
var devDependencies$3 = {
	eslint: "^5.15.3",
	"eslint-config-standard": "^12.0.0",
	"eslint-plugin-import": "^2.14.0",
	"eslint-plugin-node": "^8.0.1",
	"eslint-plugin-promise": "^4.0.1",
	"eslint-plugin-standard": "^4.0.0"
};
var pkgJSON$2 = {
	scripts: scripts$2,
	devDependencies: devDependencies$3
};

var devDependencies$4 = {
	"eslint-plugin-jest": "^22.4.1"
};
var jestPkgJSON = {
	devDependencies: devDependencies$4
};

var devDependencies$5 = {
	"eslint-config-prettier": "^6.5.0",
	"eslint-plugin-prettier": "^3.1.1"
};
var prettierPkgJSON = {
	devDependencies: devDependencies$5
};

class ESLintPlugin extends BasePlugin {
    constructor() {
        super(Plugin.ESLint);
        this.eslintName = '.eslintrc';
        this.eslintIgnoreName = '.eslintignore';
    }
    handle() {
        // 修改 JSON 部分
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$2));
        // 拷贝配置文件
        const genDir = path.resolve(__dirname, 'generator');
        fsExtra.copySync(path.resolve(genDir, this.eslintName), path.resolve(this.projectDir, this.eslintName));
        fsExtra.copySync(path.resolve(genDir, this.eslintIgnoreName), path.resolve(this.projectDir, this.eslintIgnoreName));
    }
    // 同时集成其他开源组件
    integrated() {
        if (this.plugins.includes(Plugin.Jest)) {
            this.integratedJest();
        }
        if (this.plugins.includes(Plugin.Prettier)) {
            this.integratedPrettier();
        }
    }
    // 处理与 jest 的集成
    integratedJest() {
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, jestPkgJSON));
        updateJSONFile(path.resolve(this.projectDir, this.eslintName), json => {
            json.env = Object.assign(Object.assign({}, json.env), { 'jest/globals': true });
        });
    }
    // 处理与 prettier 的集成
    integratedPrettier() {
        // 更新依赖
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, prettierPkgJSON));
        updateJSONFile(path.resolve(this.projectDir, this.eslintName), json => {
            json.extends = [...json.extends, 'plugin:prettier/recommended'];
        });
    }
}

var scripts$3 = {
};
var devDependencies$6 = {
	prettier: "^1.18.2",
	"prettier-config-standard": "^1.0.1"
};
var pkgJSON$3 = {
	scripts: scripts$3,
	devDependencies: devDependencies$6
};

class PrettierPlugin extends BasePlugin {
    constructor() {
        super(Plugin.Prettier);
        this.prettierName = '.prettierrc.js';
    }
    handle() {
        //更新 package.json
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$3));
        //拷贝配置文件
        fsExtra.copySync(path.resolve(__dirname, 'generator', this.prettierName), path.resolve(this.projectDir, this.prettierName));
    }
}

var scripts$4 = {
	docs: "esdoc"
};
var devDependencies$7 = {
	esdoc: "^1.1.0",
	"esdoc-standard-plugin": "^1.0.0"
};
var pkgJSON$4 = {
	scripts: scripts$4,
	devDependencies: devDependencies$7
};

/**
 * ESDoc 插件
 */
class ESDocPlugin extends BasePlugin {
    constructor() {
        super(Plugin.ESLint);
    }
    handle() {
        // 拷贝配置文件
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$4));
        // 拷贝配置文件
        const configName = '.esdoc.json';
        fsExtra.copySync(path.resolve(__dirname, 'generator', configName), path.resolve(this.projectDir, configName));
    }
}

var devDependencies$8 = {
	husky: "^3.0.5",
	"lint-staged": "^9.3.0"
};
var pkgJSON$5 = {
	devDependencies: devDependencies$8
};

/**
 * 初始化 lint-staged
 */
class StagedPlugin extends BasePlugin {
    constructor() {
        super(Plugin.Staged);
        this.huskyName = '.huskyrc';
        this.lintStagedName = '.lintstagedrc';
    }
    handle() {
        if (!this.plugins.includes(Plugin.ESLint) ||
            !this.plugins.includes(Plugin.Prettier)) {
            throw new Error('初始化 staged 必须包含 ESLint 与 Prettier 插件！');
        }
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$5));
        fsExtra.copySync(path.resolve(__dirname, 'generator', this.huskyName), path.resolve(this.projectDir, this.huskyName));
        fsExtra.copySync(path.resolve(__dirname, 'generator', this.lintStagedName), path.resolve(this.projectDir, this.lintStagedName));
    }
}

/**
 * license 插件
 */
class LicensePlugin extends BasePlugin {
    constructor() {
        super(Plugin.LICENSE);
    }
    handle() {
        createLicense(this.projectDir, this.license, {
            year: new Date().getFullYear(),
            author: username.sync(),
            project: lodash.last(this.projectDir.split(path.sep)),
        });
    }
}

const licenseTypeList = [
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
    'wtfpl',
];

/**
 * 1. 向用户询问一些选项
 * 2. 下载模板项目
 * 3. 根据选项修改模板项目
 * 4. 初始化安装和运行
 */
const program = new commander.Command();
/**
 * 询问一些选项
 */
function promptInput() {
    return __awaiter(this, void 0, void 0, function* () {
        return inquirer.prompt([
            {
                type: 'checkbox',
                name: 'options',
                message: '请选择需要的组件',
                suffix: '请按下空格',
                choices: [...Object.keys(Plugin)]
                    .filter(k => isNaN(k))
                    .map((k, i) => ({
                    name: k,
                    value: Plugin[k],
                    checked: i === 0,
                })),
            },
        ]);
    });
}
/**
 * 选择一个许可证
 */
function promptLicense() {
    return __awaiter(this, void 0, void 0, function* () {
        const { options } = yield inquirer.prompt([
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
        ]);
        return options;
    });
}
/**
 * 创建一个 JavaScript 项目
 * @param projectPath 项目相对路径
 */
function createJavaScriptFunc(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // 获取当前路径
        const projectDir = path.resolve(process.cwd(), projectPath);
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
            if (!isCovering) {
                console.log('已取消');
                return;
            }
        }
        fsExtra.removeSync(projectDir);
        // 询问选项
        const settings = yield promptInput();
        if (!settings) {
            return;
        }
        // 复制基本模板
        fsExtra.copySync(path.resolve(__dirname, '../template/javascript'), projectDir);
        // 初始化项目，例如修改项目名
        initProject(projectDir);
        // 初始化 babel
        const options = settings.options;
        const plugins = [];
        if (options.includes(Plugin.Babel)) {
            const plugin = new BabelPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(Plugin.Jest)) {
            if (!options.includes(Plugin.Babel)) {
                const { confirm } = yield inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: '如果选择了 Jest 插件，则必须选择 Babel 插件，是否选择 Babel 并继续？',
                        default: true,
                    },
                ]);
                if (!confirm) {
                    console.log('已取消');
                    return;
                }
                const plugin = new BabelPlugin();
                plugin.projectDir = projectDir;
                plugins.push(plugin);
            }
            const plugin = new JestPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(Plugin.ESLint)) {
            const plugin = new ESLintPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(Plugin.Prettier)) {
            const plugin = new PrettierPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(Plugin.Staged)) {
            const plugin = new StagedPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(Plugin.ESDoc)) {
            const plugin = new ESDocPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(Plugin.LICENSE)) {
            const license = yield promptLicense();
            console.log(license);
            const plugin = new LicensePlugin();
            plugin.projectDir = projectDir;
            plugin.license = license;
            plugins.push(plugin);
        }
        const pluginIdList = plugins.map(plugin => plugin.id);
        plugins
            .map(plugin => {
            plugin.plugins = pluginIdList;
            plugin.handle();
            return plugin;
        })
            .forEach(plugin => plugin.integrated());
        // 做最后的准备工作
        execReady(projectDir);
    });
}
program
    .option('-d, --debug', '输出内部调试信息')
    // 版本号
    .version(appInfo.version, '-v, --version', '@liuli-moe/cli 的版本')
    //子命令 create
    .command('create <project-name>')
    .description('创建一个 JavaScript SDK 项目')
    .action(createJavaScriptFunc);
// 真正开始解析命令
program.parse(process.argv);
