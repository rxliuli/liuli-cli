import dep from './dep.json'
import { resolve } from 'path'
import { readFileSync, writeFileSync, copyFileSync } from 'fs'
import * as ts from 'typescript'
/**
 * 初始化 babel 插件
 * @param {*} projectDir
 */
export function initBabel(projectDir: string) {
  const packagePath = resolve(projectDir, 'package.json')
  const data = readFileSync(packagePath, {
    encoding: 'utf8',
  })
  const json = JSON.parse(data)

  // 修改 JSON 部分
  json.devDependencies = {
    ...json.devDependencies,
    ...dep,
  }
  // 复制文件
  const babelName = '.babelrc'
  copyFileSync(resolve(__dirname, babelName), resolve(projectDir, babelName))
  //修改 base dev 配置
  const program = ts.createProgram(
    [resolve(projectDir, 'build/rollup.config.base.js')],
    {},
  )

  writeFileSync(packagePath, JSON.stringify(json, null, 2))
}
