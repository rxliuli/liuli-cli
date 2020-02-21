import { resolve } from 'path'
import { RootPath } from '../RootPath'

/**
 * JS 插件
 */
export enum JSPlugin {
  Babel,
  ESLint,
  Prettier,
  Jest,
  ESDoc,
  Staged,
  License,
}

/**
 * TS 的插件
 */
export enum TSPlugin {
  Jest,
  Prettier,
  TypeDoc,
  Staged,
  License,
}

export const ResourcePath = resolve(RootPath, './resource')
