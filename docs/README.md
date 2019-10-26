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

然后就创建了一个开箱即用的 JavaScript SDK 项目了。

默认包含

- [x] rollup: 打包
- [x] babel: 编译
- [x] jest: 测试
- [x] esdoc: 文档生成
- [ ] eslint: linter 代码约束
- [ ] prettier: 格式化

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
