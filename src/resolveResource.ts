import { resolve } from 'path'

export function resolveResource(...paths: string[]) {
  return resolve(__dirname, ...paths)
}
