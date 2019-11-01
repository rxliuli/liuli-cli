import { writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * 一些初始化操作，修改项目名
 * @param projectDir
 */
export function initProject(projectDir: string, projectName: string) {
  const packagePath = resolve(projectDir, 'package.json')
  const data = readFileSync(packagePath, {
    encoding: 'utf8',
  })
  const json = JSON.parse(data)
  const projectPathList = projectName.split('/')
  json.name = projectPathList[projectPathList.length - 1]
  writeFileSync(packagePath, JSON.stringify(json, null, 2))
}

// initProject(resolve(process.cwd(), 'test/node-example'), 'node-example')
