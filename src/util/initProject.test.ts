import { initProject } from './initProject'
import RootPath from 'app-root-path'
import { resolve } from 'path'
import { TemplateType } from './TemplateType'
import { pathExistsSync, removeSync } from 'fs-extra'

describe('测试初始化项目', () => {
  it('基本路径测试', () => {
    const path = resolve(RootPath.path, 'test/cli-example')
    removeSync(path)
    initProject(path, TemplateType.Cli)
    expect(pathExistsSync(path)).toBe(true)
    removeSync(path)
  })
})
