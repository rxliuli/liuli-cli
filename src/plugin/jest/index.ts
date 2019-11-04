import dep from './generator/dep.json'
import { writeJSONSync, readJSONSync, copySync } from 'fs-extra'
import { resolve } from 'path'

/**
 * 初始化 jest 配置
 * @param projectDir
 */
export function initJestJS(projectDir: string) {
  const packagePath = resolve(projectDir, 'package.json')
  const json = readJSONSync(packagePath)

  // 修改 JSON 部分
  // TODO 还需要添加测试 script
  json.devDependencies = {
    ...json.devDependencies,
    ...dep,
  }
  writeJSONSync(packagePath, json)
  // 拷贝配置文件
  copySync(
    resolve(__dirname, 'generator/jest.config.js'),
    resolve(projectDir, 'jest.config.js'),
  )
  // TODO 还需要拷贝基本测试文件
}
