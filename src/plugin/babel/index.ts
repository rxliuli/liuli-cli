import dep from './dep.json'
import { resolve } from 'path'
import { readFileSync, writeFileSync, copyFileSync } from 'fs'
import { BabelFileResult, parseSync, transformFromAstSync } from '@babel/core'
import {
  Expression,
  File,
  isImportDeclaration,
  isExportDefaultDeclaration,
  ExportDefaultDeclaration,
  ObjectExpression,
  isObjectProperty,
  Identifier,
  ArrayExpression,
  ObjectProperty,
} from '@babel/types'
import { parseExpression } from '@babel/parser'
import { findLastIndex } from 'lodash'
import { formatPackageJSON } from '../../formatPackageJSON'

/**
 * 初始化 babel 插件
 * @param {*} projectDir
 */
export function initBabel(projectDir: string) {
  // TODO 修改为 fs-extra 模块，添加 generator 目录放置模板
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
  writeFileSync(packagePath, JSON.stringify(json, null, 2))
  formatPackageJSON(projectDir)

  // 复制文件
  const babelName = '.babelrc'
  copyFileSync(resolve(__dirname, babelName), resolve(projectDir, babelName))

  //修改 base dev 配置
  const babelPluginImport = ((parseSync(
    "import babel from 'rollup-plugin-babel'",
  ) as any) as File).program.body[0]
  const babelPluginConfig: Expression = parseExpression(`
      babel({
        exclude: '../node_modules/**'
      })
    `)
  const rollupConfigPath = resolve(projectDir, 'build/rollup.config.base.js')
  const str = readFileSync(rollupConfigPath, {
    encoding: 'utf8',
  })
  const ast = (parseSync(str) as any) as File
  // 找到最后一个 import 的位置，没有找到则放置到 0
  const index =
    findLastIndex(ast.program.body, node => isImportDeclaration(node)) + 1
  // 添加 import
  ast.program.body = [
    ...ast.program.body.slice(0, index),
    babelPluginImport,
    ...ast.program.body.slice(index),
  ]
  // 修改默认导出的值
  const exportDefaultNode = (ast.program.body.find(node =>
    isExportDefaultDeclaration(node),
  ) as any) as ExportDefaultDeclaration
  const plugins = (((((exportDefaultNode.declaration as any) as ObjectExpression).properties.find(
    node =>
      isObjectProperty(node) &&
      ((node.key as any) as Identifier).name === 'plugins',
  ) as any) as ObjectProperty).value as any) as ArrayExpression
  plugins.elements.push(babelPluginConfig as any)

  writeFileSync(
    rollupConfigPath,
    ((transformFromAstSync(ast) as any) as BabelFileResult).code,
    {
      encoding: 'utf8',
    },
  )
}
