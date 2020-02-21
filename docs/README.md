# 使用文档

## 安装

使用 `yarn` 全局安装 `liuli-cli`

```sh
yarn global add liuli-cli
```

或者使用 npm

```sh
npm i -g liuli-cli
```

> 因为 yarn 相比于 npm 存在一些优势，所以该文档之后的内容皆使用 yarn 进行演示。

## 创建项目

```sh
li create [project-name]
```

然后选择创建的项目类型

- `JavaScript 模板`
- `TypeScript 模板`
- `命令行工具模板`

之后根据引导即可创建一个开箱即用的项目了。

## 可选插件

### TypeScript

- `(*) Jest`：单元测试
- `( ) Prettier`：格式化
- `( ) TypeDoc`：API 文档生成
- `( ) Staged`：强制执行 Linter
- `( ) License`：选择许可证

### JavaScript

- `(*) Babel`：编译
- `( ) ESLint`：代码约束
- `( ) Prettier`：格式化
- `( ) Jest`：单元测试
- `( ) ESDoc`：API 文档生成
- `( ) Staged`：强制执行 Linter
- `( ) License`：选择许可证

### CLI

## 打包

默认调用 rollup 和 babel 进行打包，打包后的目录是 _dist_。

```sh
yarn build
```

## 测试

默认调用 jest 进行即时测试，并启动监听模式。

```sh
yarn test
```

> 附：如果只想要测试一次，请使用 `yarn test-all` 命令

## 发布

直接使用 `npm publish` 即可发布，默认添加了钩子会自动进行构建和全部单元测试。
