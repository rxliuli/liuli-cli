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

var name = "liuli-cli";
var version = "0.1.2";
var description = "一个 JavaScript/TypeScript SDK cli 工具";
var main = "bin/li.js";
var author = "rxliuli";
var license = "mit";
var bin = {
	li: "bin/li.js"
};
var scripts = {
	li: "ts-node -O \"{\\\"module\\\": \\\"commonjs\\\"}\" src/li.ts",
	dev: "nodemon -w src/li.ts --exec \"yarn li\"",
	build: "rollup -c rollup.config.js && yarn copy src/plugin/resource/ bin/resource/",
	"build:tsc": "yarn tsc && yarn copy src/plugin/resource dist/src/plugin/resource",
	"test:create": "yarn li test/node-example",
	"link:add": "yarn link",
	"link:remove": "yarn unlink"
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
	"copy-dir-cli": "^0.0.3",
	jest: "^24.9.0",
	"jest-extended": "^0.11.2",
	nodeman: "^1.1.2",
	nodemon: "^1.19.4",
	prettier: "^1.18.2",
	rollup: "^1.26.2",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-typescript2": "^0.24.3",
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
	"fs-extra": "^8.1.0",
	inquirer: "^7.0.0",
	lodash: "^4.17.15",
	shelljs: "^0.8.3",
	"sort-package-json": "^1.23.1",
	username: "^5.1.0"
};
var appInfo = {
	name: name,
	version: version,
	description: description,
	main: main,
	author: author,
	license: license,
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
 * 模板的类型
 */
var TemplateType;
(function (TemplateType) {
    TemplateType["JavaScript"] = "JavaScript \u6A21\u677F";
    TemplateType["TypeScript"] = "TypeScript \u6A21\u677F";
    TemplateType["Cli"] = "\u547D\u4EE4\u884C\u5DE5\u5177\u6A21\u677F";
})(TemplateType || (TemplateType = {}));

/**
 * 一些初始化操作，修改项目名
 * @param projectDir
 * @param type
 */
function initProject(projectDir, type) {
    fsExtra.removeSync(projectDir);
    const templateDir = type === TemplateType.JavaScript
        ? 'javascript'
        : type === TemplateType.TypeScript
            ? 'typescript'
            : 'cli';
    fsExtra.copySync(path.resolve(__dirname, `../template/${templateDir}`), projectDir);
    updateJSONFile(path.resolve(projectDir, 'package.json'), json => {
        const oldName = json.name;
        const projectPathList = projectDir.split(path.sep);
        json.name = projectPathList[projectPathList.length - 1];
        if ((type = TemplateType.JavaScript || type === TemplateType.TypeScript)) {
            json.main = json.main.replace(oldName, json.name);
            json.module = json.module.replace(oldName, json.name);
        }
    });
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

/**
 * JS 插件
 */
var JSPlugin;
(function (JSPlugin) {
    JSPlugin[JSPlugin["Babel"] = 0] = "Babel";
    JSPlugin[JSPlugin["ESLint"] = 1] = "ESLint";
    JSPlugin[JSPlugin["Prettier"] = 2] = "Prettier";
    JSPlugin[JSPlugin["Jest"] = 3] = "Jest";
    JSPlugin[JSPlugin["ESDoc"] = 4] = "ESDoc";
    JSPlugin[JSPlugin["Staged"] = 5] = "Staged";
    JSPlugin[JSPlugin["License"] = 6] = "License";
})(JSPlugin || (JSPlugin = {}));
/**
 * TS 的插件
 */
var TSPlugin;
(function (TSPlugin) {
    TSPlugin[TSPlugin["Jest"] = 0] = "Jest";
    TSPlugin[TSPlugin["Prettier"] = 1] = "Prettier";
    TSPlugin[TSPlugin["TypeDoc"] = 2] = "TypeDoc";
    TSPlugin[TSPlugin["Staged"] = 3] = "Staged";
    TSPlugin[TSPlugin["License"] = 4] = "License";
})(TSPlugin || (TSPlugin = {}));

class BabelPlugin extends BasePlugin {
    constructor() {
        super(JSPlugin.Babel);
    }
    handle() {
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON));
        // 复制文件
        const babelName = '.babelrc';
        fsExtra.copySync(path.resolve(__dirname, 'resource/babel', babelName), path.resolve(this.projectDir, babelName));
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
        super(JSPlugin.Jest);
        this.jestName = 'jest.config.js';
        this.testName = 'index.test.js';
        this.jestStartName = 'jest-start.js';
    }
    handle() {
        // 修改 JSON 部分
        path.resolve(this.projectDir, 'package.json');
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$1));
        // 拷贝配置文件
        fsExtra.copySync(path.resolve(__dirname, 'resource/jest', this.jestName), path.resolve(this.projectDir, this.jestName));
        // 拷贝测试初始环境配置文件
        fsExtra.copySync(path.resolve(__dirname, 'resource/jest', this.jestStartName), path.resolve(this.projectDir, 'test', this.jestStartName));
        // 拷贝一个基本的测试文件
        const path$1 = path.resolve(this.projectDir, 'test', this.testName);
        fsExtra.copySync(path.resolve(__dirname, 'resource/jest', this.testName), path$1);
        const data = fsExtra.readFileSync(path$1, {
            encoding: 'utf8',
        }).replace(/javascript-template/g, lodash.last(this.projectDir.split(path.sep)));
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
        super(JSPlugin.ESLint);
        this.eslintName = '.eslintrc';
        this.eslintIgnoreName = '.eslintignore';
    }
    handle() {
        // 修改 JSON 部分
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$2));
        // 拷贝配置文件
        const genDir = path.resolve(__dirname, 'resource/eslint');
        fsExtra.copySync(path.resolve(genDir, this.eslintName), path.resolve(this.projectDir, this.eslintName));
        fsExtra.copySync(path.resolve(genDir, this.eslintIgnoreName), path.resolve(this.projectDir, this.eslintIgnoreName));
    }
    // 同时集成其他开源组件
    integrated() {
        if (this.plugins.includes(JSPlugin.Jest)) {
            this.integratedJest();
        }
        if (this.plugins.includes(JSPlugin.Prettier)) {
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
        super(JSPlugin.Prettier);
        this.prettierName = '.prettierrc.js';
    }
    handle() {
        //更新 package.json
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$3));
        //拷贝配置文件
        fsExtra.copySync(path.resolve(__dirname, 'resource/prettier', this.prettierName), path.resolve(this.projectDir, this.prettierName));
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
        super(JSPlugin.ESLint);
    }
    handle() {
        // 拷贝配置文件
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$4));
        // 拷贝配置文件
        const configName = '.esdoc.json';
        fsExtra.copySync(path.resolve(__dirname, 'resource/esdoc', configName), path.resolve(this.projectDir, configName));
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
        super(JSPlugin.Staged);
        this.huskyName = '.huskyrc';
        this.lintStagedName = '.lintstagedrc';
        this.lintStagedTSName = '.ts.lintstagedrc';
    }
    handle() {
        if (!this.plugins.includes(JSPlugin.ESLint) &&
            !this.plugins.includes(JSPlugin.Prettier) &&
            !this.plugins.includes(TSPlugin.Prettier)) {
            throw new Error('初始化 staged 必须包含 ESLint 或 Prettier 插件！');
        }
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$5));
        fsExtra.copySync(path.resolve(__dirname, 'resource/staged', this.huskyName), path.resolve(this.projectDir, this.huskyName));
        const projectLintStageName = path.resolve(this.projectDir, this.lintStagedName);
        if (this.type === TemplateType.JavaScript) {
            fsExtra.copySync(path.resolve(__dirname, 'resource/staged', this.lintStagedName), projectLintStageName);
            if (!this.plugins.includes(JSPlugin.Prettier)) {
                updateJSONFile(projectLintStageName, json => {
                    json.linters['src/**/*.js'].splice(1, 1);
                });
            }
            else if (!this.plugins.includes(JSPlugin.ESLint)) {
                updateJSONFile(projectLintStageName, json => {
                    json.linters['src/**/*.js'].splice(0, 1);
                });
            }
        }
        else if (this.type === TemplateType.TypeScript) {
            fsExtra.copySync(path.resolve(__dirname, 'resource/staged', this.lintStagedTSName), projectLintStageName);
        }
    }
}

/**
 * license 插件
 */
class LicensePlugin extends BasePlugin {
    constructor() {
        super(JSPlugin.License);
    }
    handle() {
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => {
            json.license = this.license;
        });
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

var scripts$5 = {
	test: "jest --all"
};
var devDependencies$9 = {
	"@types/jest": "^24.0.12",
	jest: "^24.5.0",
	"jest-extended": "^0.11.1",
	"ts-jest": "^24.0.2"
};
var pkgJSON$6 = {
	scripts: scripts$5,
	devDependencies: devDependencies$9
};

class JestTSPlugin extends BasePlugin {
    constructor() {
        super(JSPlugin.Jest);
        this.jestName = 'jest.config.js';
        this.testName = 'index.test.ts';
        this.jestStartName = 'jest-start.ts';
    }
    handle() {
        // 修改 JSON 部分
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$6));
        // 拷贝配置文件
        fsExtra.copySync(path.resolve(__dirname, 'resource/jest-ts', this.jestName), path.resolve(this.projectDir, this.jestName));
        // 拷贝测试初始环境配置文件
        fsExtra.copySync(path.resolve(__dirname, 'resource/jest-ts', this.jestStartName), path.resolve(this.projectDir, 'test', this.jestStartName));
        // 拷贝一个基本的测试文件
        const path$1 = path.resolve(this.projectDir, 'test', this.testName);
        fsExtra.copySync(path.resolve(__dirname, 'resource/jest-ts', this.testName), path$1);
        const data = fsExtra.readFileSync(path$1, {
            encoding: 'utf8',
        }).replace(/typescript-template/g, lodash.last(this.projectDir.split(path.sep)));
        fs.writeFileSync(path$1, data);
    }
}

var scripts$6 = {
	docs: "typedoc --out docs src --exclude src/**/*.test.ts && yarn copy README.md docs/ && yarn copy .nojekyll docs/"
};
var devDependencies$a = {
	typedoc: "^0.15.3"
};
var pkgJSON$7 = {
	scripts: scripts$6,
	devDependencies: devDependencies$a
};

/**
 * typedoc 插件
 */
class TypeDocPlugin extends BasePlugin {
    constructor() {
        super(TSPlugin.TypeDoc);
        this.noJekyllName = '.nojekyll';
    }
    handle() {
        //更新 package.json
        updateJSONFile(path.resolve(this.projectDir, 'package.json'), json => merge(json, pkgJSON$7));
        //拷贝配置文件
        fsExtra.copySync(path.resolve(__dirname, 'resource/typedoc', this.noJekyllName), path.resolve(this.projectDir, this.noJekyllName));
    }
}

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
function promptInput(plugin) {
    return __awaiter(this, void 0, void 0, function* () {
        return inquirer.prompt([
            {
                type: 'checkbox',
                name: 'options',
                message: '请选择需要的组件',
                suffix: '请按下空格',
                choices: [...Object.keys(plugin)]
                    .filter(k => isNaN(k))
                    .map((k, i) => ({
                    name: k,
                    value: plugin[k],
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
 * 询问模板的类型
 */
function promptTemplateType() {
    return __awaiter(this, void 0, void 0, function* () {
        const { type } = yield inquirer.prompt([
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
        ]);
        return type;
    });
}
/**
 * 创建一个 JavaScript 项目
 * @param projectDir 项目绝对路径
 */
function createJavaScriptFunc(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        // 询问选项
        const settings = yield promptInput(JSPlugin);
        if (!settings) {
            return;
        }
        // 初始化 babel
        const options = settings.options;
        const plugins = [];
        if (options.includes(JSPlugin.Babel)) {
            const plugin = new BabelPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(JSPlugin.Jest)) {
            if (!options.includes(JSPlugin.Babel)) {
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
        if (options.includes(JSPlugin.ESLint)) {
            const plugin = new ESLintPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(JSPlugin.Prettier)) {
            const plugin = new PrettierPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(JSPlugin.Staged)) {
            const plugin = new StagedPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(JSPlugin.ESDoc)) {
            const plugin = new ESDocPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(JSPlugin.License)) {
            const license = yield promptLicense();
            const plugin = new LicensePlugin();
            plugin.projectDir = projectDir;
            plugin.license = license;
            plugins.push(plugin);
        }
        // 初始化项目，例如修改项目名
        initProject(projectDir, TemplateType.JavaScript);
        const pluginIdList = plugins.map(plugin => plugin.id);
        plugins
            .map(plugin => {
            plugin.plugins = pluginIdList;
            plugin.type = TemplateType.JavaScript;
            plugin.handle();
            return plugin;
        })
            .forEach(plugin => plugin.integrated());
    });
}
/**
 * 创建一个 TypeScript 项目
 * @param projectDir 项目绝对路径
 */
function createTypeScriptFunc(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield promptInput(TSPlugin);
        if (!settings) {
            return;
        }
        // 初始化 babel
        const options = settings.options;
        const plugins = [];
        if (options.includes(TSPlugin.Jest)) {
            const plugin = new JestTSPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(TSPlugin.Prettier)) {
            const plugin = new PrettierPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(TSPlugin.TypeDoc)) {
            const plugin = new TypeDocPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(TSPlugin.Staged)) {
            const plugin = new StagedPlugin();
            plugin.projectDir = projectDir;
            plugins.push(plugin);
        }
        if (options.includes(TSPlugin.License)) {
            const license = yield promptLicense();
            const plugin = new LicensePlugin();
            plugin.projectDir = projectDir;
            plugin.license = license;
            plugins.push(plugin);
        }
        // 初始化项目，例如修改项目名
        initProject(projectDir, TemplateType.TypeScript);
        const pluginIdList = plugins.map(plugin => plugin.id);
        plugins
            .map(plugin => {
            plugin.plugins = pluginIdList;
            plugin.type = TemplateType.TypeScript;
            plugin.handle();
            return plugin;
        })
            .forEach(plugin => plugin.integrated());
    });
}
/**
 * 创建一个 Cli 项目
 * @param projectDir
 */
function createCliFunc(projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        // 初始化项目，例如修改项目名
        initProject(projectDir, TemplateType.Cli);
    });
}
program
    .option('-d, --debug', '输出内部调试信息')
    // 版本号
    .version(appInfo.version, '-v, --version', `@liuli-moe/cli ${appInfo.version}`)
    //子命令 create
    .command('create <project-name>')
    .description('创建一个 JavaScript/TypeScript SDK 项目')
    .action((projectPath) => __awaiter(void 0, void 0, void 0, function* () {
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
    const type = yield promptTemplateType();
    switch (type) {
        case TemplateType.JavaScript:
            yield createJavaScriptFunc(projectDir);
            break;
        case TemplateType.TypeScript:
            yield createTypeScriptFunc(projectDir);
            break;
        case TemplateType.Cli:
            yield createCliFunc(projectDir);
            break;
    }
    // 做最后的准备工作
    execReady(projectDir);
}));
// 真正开始解析命令
program.parse(process.argv);
