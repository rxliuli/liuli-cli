import { resolve, sep } from 'path'
import { readJSONSync, writeJSONSync } from 'fs-extra'

/**
 * 一些初始化操作，修改项目名
 * @param projectDir
 */
export function initProject(projectDir: string) {
  const packagePath = resolve(projectDir, 'package.json')
  const json = readJSONSync(packagePath)
  const projectPathList = projectDir.split(sep)
  json.name = projectPathList[projectPathList.length - 1]
  writeJSONSync(packagePath, json)
}
