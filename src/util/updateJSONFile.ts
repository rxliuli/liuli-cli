import { resolve } from 'path'
import { readJSONSync, writeJSONSync } from 'fs-extra'

/**
 * 更新 json 文件
 * @param file
 * @param fn
 */
export function updateJSONFile<T>(file: string, fn: (json: any) => any) {
  const path = resolve(file)
  const json = readJSONSync(path)
  const res = fn(json)
  writeJSONSync(path, res === undefined ? json : res, {
    spaces: 2,
  })
}
