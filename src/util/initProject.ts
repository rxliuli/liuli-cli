import { resolve, sep } from 'path'
import { copySync, removeSync } from 'fs-extra'
import { updateJSONFile } from './updateJSONFile'
import { TemplateType } from './TemplateType'
import { ResourcePath } from './constant'

/**
 * 一些初始化操作，修改项目名
 * @param projectDir
 * @param type
 */
export function initProject(projectDir: string, type: TemplateType) {
  removeSync(projectDir)
  const templateDirMap = {
    [TemplateType.JavaScript]: 'javascript',
    [TemplateType.TypeScript]: 'typescript',
    [TemplateType.Cli]: 'cli',
  }
  const templateDir = templateDirMap[type]
  copySync(resolve(ResourcePath, `./template/${templateDir}`), projectDir)
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    const oldName = json.name
    const projectPathList = projectDir.split(sep)
    json.name = projectPathList[projectPathList.length - 1]
    if (type === TemplateType.JavaScript || type === TemplateType.TypeScript) {
      json.main = json.main.replace(oldName, json.name)
      json.module = json.module.replace(oldName, json.name)
    }
  })
}
