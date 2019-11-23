import { resolve, sep } from 'path'
import { copySync, readJSONSync, removeSync, writeJSONSync } from 'fs-extra'
import { updateJSONFile } from './util/updateJSONFile'

/**
 * 一些初始化操作，修改项目名
 * @param projectDir
 * @param template
 */
export function initProject(projectDir: string, template: string) {
  removeSync(projectDir)
  copySync(resolve(__dirname, `../template/${template}`), projectDir)
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    const projectPathList = projectDir.split(sep)
    json.name = projectPathList[projectPathList.length - 1]
  })
}
