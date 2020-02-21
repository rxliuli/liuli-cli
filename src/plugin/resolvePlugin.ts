import { resolve } from 'path'
import { RootPath } from '../RootPath'

export function resolvePlugin(...paths: string[]) {
  return resolve(RootPath, './resource/plugin/', ...paths)
}
