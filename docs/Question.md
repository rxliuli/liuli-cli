# 问题

## 列表

- [ ] 生成 TS 项目时没有更新 `package.json` 中的 `main` 和 `module` 字段
- [ ] TS 项目默认没有添加 `types` 字段
- [ ] 生成的项目不应该有 `postinstall`（待商榷）
- [ ] 打包后的 `li.js` 有问题

## 可能

Directory before compilation

- src
  - index.js
  - babel
    - plugin.js
    - resource
      - babel.config.js

Want the compiled directory

- dist
  - bundle.js
  - resource.xsd91
    - babel.config.js
