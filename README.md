# liuli-cli

## 简介

一个 JavaScript/TypeScript SDK cli 工具，帮助开发者快速生成一个开箱即用 SDK，避免在每个项目都复制一堆的配置文件。

## 使用

### 安装

使用 `yarn` 全局安装 `liuli-cli`

```sh
yarn global add liuli-cli
```

或者使用 npm

```sh
npm i -g liuli-cli
```

> 因为 yarn 相比于 npm 存在一些优势，所以该文档之后的内容皆使用 yarn 进行演示。

### 创建项目

```sh
li create [project-name]
```

然后选择创建的项目类型

- `JavaScript 模板`
- `TypeScript 模板`
- `命令行工具模板`

之后根据引导即可创建一个开箱即用的项目了。

### 可选插件

#### TypeScript

- `(*) Jest`：单元测试
- `( ) Prettier`：格式化
- `( ) TypeDoc`：API 文档生成
- `( ) Staged`：强制执行 Linter
- `( ) License`：选择许可证

#### JavaScript

- `(*) Babel`：编译
- `( ) ESLint`：代码约束
- `( ) Prettier`：格式化
- `( ) Jest`：单元测试
- `( ) ESDoc`：API 文档生成
- `( ) Staged`：强制执行 Linter
- `( ) License`：选择许可证

#### CLI

### 打包

默认调用 rollup 和 babel 进行打包，打包后的目录是 _dist_。

```sh
yarn build
```

### 测试

默认调用 jest 进行即时测试，并启动监听模式。

```sh
yarn test
```

> 附：如果只想要测试一次，请使用 `yarn test-all` 命令

### 发布

直接使用 `npm publish` 即可发布项目到 NPM 上，记得在此之前要先进行**测试/打包**。

## 目标功能

- [x] 基本打包支持
- [x] 模块化 umd/es
- [x] jest 单元测试支持
- [x] 代码压缩支持
- [x] babel 支持
- [x] ts 支持
- [x] linter 支持
- [x] prettier 格式化支持
- [x] git 钩子支持
- [x] esdoc
- [x] typedoc
- [x] 许可证选择支持
- [ ] jsconfig/tsconfig 支持
- [ ] 自定义模板

## 常见问题

### 为什么要写 liuli-cli

因为之前最初写 JS/TS SDK 发布到 NPM 上，出现了很多问题，消耗了大量的时间，而现在，吾辈需要重构公司内部多个 SDK，所以就想是否能够把这部分单独抽离成一个脚手架。

### 这个项目会继续下去么

是的，该项目的目的是为了生成开箱即用的 JS/TS SDK 脚手架，并且，依赖的版本都是调试过的，不会出现奇怪的依赖版本问题（说的就是你 Babel/tsc）。目前最初版本将实现一些 SDK 常用生成插件的实现，而渐进式添加则放到下个版本。

> `Vue/React/Angular` 目前没有任何实现的计划。

### 使用最新的语法 ESLint 报错了，但 Babel 能够正常编译

ESLint 默认支持解析最新的 [最终阶段](https://github.com/eslint/eslint/blob/a675c89573836adaf108a932696b061946abf1e6/README.md#what-about-experimental-features) 标准，不支持 Babel 实验性的功能。这里我们默认不支持 ES 最新特性，因为我们不希望使用最新的不稳定特性（目前默认支持 ES2017），你可以自行配置 [babel-eslint](https://github.com/babel/babel-eslint) 插件。
