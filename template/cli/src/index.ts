import { Command } from 'commander'
import { version } from '../package.json'
import { hello } from './hello'

new Command()
  .option('-d, --debug', '输出内部调试信息')
  // 版本号
  .version(version, '-v, --version', `cli ${version}`)
  .description('一个 nodejs cli 模板')
  .arguments('[name]')
  .action(hello)
  .parse(process.argv)
