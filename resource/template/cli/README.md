# cli-template

## 简介

这是一个 TypeScript CLI SDK 项目，你可以直接编写 CLI 代码了，入口文件是 _src/index.ts_。

## npm scripts

- `build`: 打包脚本
- `clean`: 清理打包脚本目录
- `index`: 方便即时使用 CLI 的命令
  - 注：一般需要自定义命令的名字，但同时记得修改 `bin.index`。
- `link:add`: 将包软链接到本地便于测试
- `link:remove`: 删除包的软链接
- `pkg`: 打包可执行的二进制文件

## 帮助
