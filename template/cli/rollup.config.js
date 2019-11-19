import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import { resolve } from 'path'

export default {
  // 入口文件
  input: resolve(__dirname, 'src/index.ts'),
  output: {
    // 打包名称
    name: 'index',
    // 文件顶部信息
    banner: '#!/usr/bin/env node',
    file: resolve(__dirname, 'bin/index.js'),
    format: 'cjs',
  },
  plugins: [
    typescript(),
    json({
      include: ['src/**', 'package.json'],
    }),
  ],
}
