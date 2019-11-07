import { resolve } from 'path'
import { updateJSONFile } from '../../util/updateJSONFile'
import dep from './generator/dep.json'
import { copySync } from 'fs-extra'

/**
 * 初始化 prettier 标准格式化工具
 * @param projectDir
 */
export function initPrettier(projectDir: string) {
  //更新 package.json
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...dep,
    }
    json.scripts = {
      ...json.scripts,
      format: 'prettier --write src/**/*.js',
    }
  })

  //拷贝配置文件
  copySync(
    resolve(__dirname, 'generator/.prettierrc.js'),
    resolve(projectDir, '.prettierrc.js'),
  )
}
