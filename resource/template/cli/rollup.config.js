import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import { resolve } from 'path'
import { name } from './package.json'

export default {
  // 入口文件
  input: resolve(__dirname, 'src/index.ts'),
  output: {
    // 打包名称
    name,
    // 文件顶部信息
    banner: '#!/usr/bin/env node',
    file: resolve(__dirname, `bin/index.js`),
    format: 'cjs',
  },
  //声明项目的运行时依赖避免 rollup 发出警告
  external: [
    'commander',
    'deepmerge',
    'fs-extra',
    'inquirer',
    'lodash',
    'shelljs',
    'fs',
    'path',
  ],
  plugins: [
    typescript(),
    json({
      include: ['src/**', 'package.json'],
    }),
  ],
}
