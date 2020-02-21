import { readFileSync } from 'fs'
import { resolve } from 'path'
import { RootPath } from './RootPath'

export function hello() {
  const { name } = JSON.parse(
    readFileSync(resolve(RootPath, 'resource/user.json'), { encoding: 'utf8' }),
  )
  console.log(`hello ${name}`)
}
