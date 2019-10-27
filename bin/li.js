"use strict";
exports.__esModule = true;
var commander_1 = require("commander");
var path_1 = require("path");
var program = new commander_1.Command();
// 一些参数
program
    .option('-d, --debug', '输出内部调试信息')
    // 版本号
    .version('0.1.0', '-v, --version', 'liuli-cli version');
// 创建子命令 create
program
    .command('create <project-name>')
    .description('创建一个 JavaScript SDK 项目')
    .action(function (cmd, env) {
    console.log(cmd, env);
});
// 真正开始解析命令
program.parse(process.argv);
// 获取当前路径
var currentPath = path_1.resolve(process.cwd());
console.log('hello liuli-cli, ', currentPath);
