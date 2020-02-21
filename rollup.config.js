import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import { resolve } from 'path'

export default {
  // 入口文件
  input: resolve(__dirname, 'src/li.ts'),
  output: {
    // 打包名称
    name: 'li',
    // 文件顶部信息
    banner: '#!/usr/bin/env node',
    file: resolve(__dirname, 'bin/li.js'),
    format: 'cjs',
  },
  //声明项目的运行时依赖避免 rollup 发出警告
  external: [
    '@babel/core',
    '@babel/parser',
    '@babel/traverse',
    'commander',
    'create-license',
    'deepmerge',
    'fs-extra',
    'inquirer',
    'lodash',
    'shelljs',
    'sort-package-json',
    'username',
    'path',
    '@babel/types',
    'fs',
  ],
  plugins: [
    typescript(),
    json({
      include: ['src/**', 'package.json'],
    }),
  ],
}
