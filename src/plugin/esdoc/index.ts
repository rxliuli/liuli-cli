import { updateJSONFile } from '../../util/updateJSONFile'
import dep from './generator/dep.json'
import { resolve } from 'path'
import { copySync } from 'fs-extra'

/**
 * 初始化
 * @param projectDir
 */
export function initESDoc(projectDir: string) {
  //更新 json 文件
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...dep,
    }
    json.scripts = {
      ...json.scripts,
      docs: 'esdoc',
    }
  })
  // 拷贝配置文件
  copySync(
    resolve(__dirname, './generator/.esdoc.json'),
    resolve(projectDir, '.esdoc.json'),
  )
}
