#!/usr/bin/env node
'use strict';

var commander = require('commander');

var version = "0.0.1";

new commander.Command()
    .option('-d, --debug', '输出内部调试信息')
    // 版本号
    .version(version, '-v, --version', `cli ${version}`)
    .description('一个 nodejs cli 模板')
    .parse(process.argv);
