import { copySync } from 'fs-extra'
import { resolve } from 'path'
import { updateJSONFile } from '../../util/updateJSONFile'
import dep from './generator/dep.json'

//初始化 lint-staged
export function initStaged(projectDir: string) {
  updateJSONFile(resolve(projectDir, 'package.json'), json => {
    json.devDependencies = {
      ...json.devDependencies,
      ...dep,
    }
  })

  copySync(
    resolve(__dirname, 'generator/.huskyrc'),
    resolve(projectDir, '.huskyrc'),
  )
  copySync(
    resolve(__dirname, 'generator/.lintstagedrc'),
    resolve(projectDir, '.lintstagedrc'),
  )
}
