# liuli-cli

## 简介

一个 JavaScript/TypeScript SDK cli 工具，覆盖整个 SDK 的创建、测试、打包、部署、文档生成这几个周期，避免在每个项目都复制一堆的配置文件。

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
- [x] JSconfig/tsconfig 支持
- [x] esdoc
- [x] typedoc
- [ ] 自定义模板
- [x] 许可证选择支持

## 常见问题

### 为什么要写 liuli-cli

因为之前最初写 JS/TS SDK 发布到 NPM 上，出现了很多问题，消耗了大量的时间，而现在，吾辈需要重构公司内部多个 SDK，所以就想是否能够把这部分单独抽离成一个脚手架。

### 为什么不用 yoeman

首先，吾辈最初写这个工具的时候确实不知道 yoeman 是个通用性的工具，但实际上之前写 VSCode Plugin 的时候也有用到，但没有意识到这是个通用性工具。然而，yoeman 吾辈觉得太通用了，甚至可以生成其它语言的脚手架，所以配置花的时间未必就比从零开始配置更简单。
吾辈希望提供的是一个可以一开始不用了解任何 `Babel/ESLint/Prettier/ESDoc/Jest` 的开发者可以直接进入 SDK 的开发，不必关心依赖和配置就能直接得到一个开箱即用的 SDK 脚手架项目。

### 这个项目会继续下去么

是的，该项目的目的是为了生成开箱即用的 JS/TS SDK 脚手架，并且，依赖的版本都是调试过的，不会出现奇怪的依赖版本问题（说的就是你 Babel/tsc）。目前最初版本将实现一些 SDK 常用生成插件的实现，而渐进式添加则放到下个版本。

> `Vue/React/Angular` 目前没有任何实现的计划。

### 使用最新的语法 ESLint 报错了，但 Babel 能够正常编译

ESLint 默认支持解析最新的 [最终阶段](https://github.com/eslint/eslint/blob/a675c89573836adaf108a932696b061946abf1e6/README.md#what-about-experimental-features) 标准，不支持 Babel 实验性的功能。这里我们默认不支持 ES 最新特性，因为我们不希望使用最新的不稳定特性（目前默认支持 ES2017），你可以自行配置 [babel-eslint](https://github.com/babel/babel-eslint) 插件。
