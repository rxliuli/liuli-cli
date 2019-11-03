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
    // 启用代码映射，便于调试之用
    sourcemap: true,
    file: resolve(__dirname, 'bin/li.js'),
    format: 'cjs',
  },
  plugins: [
    typescript(),
    json({
      include: ['src/**', 'package.json'],
    }),
  ],
}
