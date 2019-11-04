import dep from './generator/dep.json'
import { writeJSONSync, readJSONSync, copySync, readFileSync } from 'fs-extra'
import { resolve, sep } from 'path'
import { last } from 'lodash'
import { writeFileSync } from 'fs'

/**
 * 初始化 jest 配置
 * @param projectDir
 */
export function initJestJS(projectDir: string) {
  const packagePath = resolve(projectDir, 'package.json')
  const json = readJSONSync(packagePath)

  // 修改 JSON 部分
  json.devDependencies = {
    ...json.devDependencies,
    ...dep,
  }
  json.scripts = {
    ...json.scripts,
    test: 'jest --all',
  }
  writeJSONSync(packagePath, json)
  // 拷贝配置文件
  copySync(
    resolve(__dirname, 'generator/jest.config.js'),
    resolve(projectDir, 'jest.config.js'),
  )

  // 拷贝一个基本的测试文件
  // TODO 如何同时使用 jest 测试 yarn link 的本地包
  let path = resolve(projectDir, 'test/index.test.js')
  copySync(resolve(__dirname, 'generator/index.test.js'), path)
  const data = readFileSync(path, {
    encoding: 'utf8',
  }).replace('javascript-template', last(projectDir.split(sep))!)
  writeFileSync(path, data)
}
