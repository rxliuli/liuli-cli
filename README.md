# liuli-cli

## 简介

一个 JavaScript/TypeScript SDK cli 工具，覆盖整个 SDK 的创建、测试、打包、部署、文档生成这几个周期，避免在每个项目都复制一堆的配置文件。

## 目标功能

- [x] 基本打包支持
- [x] 模块化 umd/es
- [ ] jest 单元测试支持
- [x] 代码压缩支持
- [ ] babel 支持
- [ ] ts 支持
- [ ] linter 支持
- [ ] prettier 格式化支持
- [ ] git 钩子支持
- [ ] JSconfig/tsconfig 支持
- [ ] typedoc/esdoc
- [ ] 自定义模板
- [ ] 许可证选择支持

## 常见问题

### 使用最新的语法 ESLint 报错了，但 Babel 能够正常编译

ESLint 默认支持解析最新的 [最终阶段](https://github.com/eslint/eslint/blob/a675c89573836adaf108a932696b061946abf1e6/README.md#what-about-experimental-features) 标准，不支持 Babel 实验性的功能。这里我们默认不支持 ES 最新特性，因为我们不希望使用最新的不稳定特性（目前默认支持 ES2017），你可以自行配置 [babel-eslint](https://github.com/babel/babel-eslint) 插件。
