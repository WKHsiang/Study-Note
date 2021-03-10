# 组件化开发

开源组件库

- Element-UI
- iView
- ...

CDD(Component-Driven Development)

- 自上而下
- 从组件级别开始，到页面级别结束

CDD 的好处

- 组件在最大程度被重用
- 并行开发
- 可视化测试

## 处理组件边界情况

文档地址：https://cn.vuejs.org/v2/guide/components-edge-cases.html

- $root
  - 通过 $root ,可以访问到 Vue 的根实例，操作根实例中的成员。在小型的使用少量组件的应用中，可以在 Vue 根实例里存储共享数据，这样做很方便，但是在大多数情况下，推荐使用 Vuex 管理
- $parent/$children
  - 用来获取父组件或者子组件，通过 $parent 可以操作父组件中的成员，可以替换 props 使用，但绝大多数情况下不推荐使用 $parent, 因为如果通过这种方式改变了父组件中的成员，出现问题的话就很难找到更改的位置
  - $children 在获取子组件的时候，代码的可读性不高，要用索引来获取，如果要获取所有子组件，我们可以使用这种方式。如果只获取单个特定的子组件，可以使用 $refs
- $refs
  - 通过 $refs 可以访问子组件，在开发自定义组件的过程中会用到
  - 如果 ref 用在普通标签上，通过 $refs 获取到的是普通的 DOM 对象
  - 如果 ref 用在子组件上，通过 $refs 获取到的就是对应的子组件对象，需要注意的是，需要等待组件渲染完毕之后再通过 $refs 获取子组件。（mounted）
- 依赖注入 provide / inject
  - 如果组件嵌套比较多的话，使用 $parent 获取父组件中的成员就会比较麻烦，这时就可以使用依赖注入
  - 通过依赖注入的成员不是响应式的
  - 带来的影响：组件之间的耦合变高，重构变得困难
- $attrs / $listeners
  - $attrs
    - 把父组件中非 prop 属性绑定到内部组件
  - $listeners
    - 把父组件中的 DOM 对象的原生事件绑定到内部组件

## 快速原型开发

- VueCLI 中提供了一个插件可以进行原型快速开发
- 需要先额外安装一个全局的扩展
  - npm install -g @vue/cli-service-global
- 使用 vue serve 快速查看组件的运行效果

vue serve

- vue serve 如果不指定参数，默认会在当前目录找以下的入口文件
  - main.js、index.js、App.vue、app.vue
- 可以指定加载的组件
  - vue serve ./src/login.vue ...

原型开发的好处是如果只开发少量的组件会很方便

## 快速原型开发-ElementUI

### 安装 ElementUI

- 初始化 package.json
  - npm init -y
- 安装 ElementUI
  - vue add element
- 加载 ElementUI, 使用 Vue.use() 安装插件

## 组件开发-步骤条组件

### 组件分类

- 第三方组件：ElementUI，iView...
- 基础组件：文本框，按钮，表单...
- 业务组件：针对特定行业封装的组件

## Monorepo

两种项目的组织方式

- Multirepo(Multiple Repository)

  - 每一个包对应一个项目

- Monorepo(Monolithic Repository)

  - 一个项目仓库中管理多个模块/包

  - 文件结构

    ```
    .
    |-- package.json
    |-- packages
        |-button(e.g.)
          |-__tests__
          |- dist
          |- src
          index.js
          LICENSE
          package.json
      README.md
    ```


## [Storybook](https://storybook.js.org/)

- 可视化的组件展示平台
- 在隔离的开发环境中，以交互式的方式展示组件
- 独立开发组件
- 支持的框架
  - React、React Native、Vue、Angular
  - Ember、HTML、Svelte、Mithril、Riot

### Storybook 安装

- 自动安装
  - npx -p @storybook/cli sb init --type vue
  - yarn add vue
  - yarn add vue-loader vue-template-compiler --dev
- 手动安装

## yarn workspaces

开启 yarn 的工作区

- 项目根目录的 package.json

  ```json
  "private": true,
  "workspaces": [
  	"./packages/*"
  ]
  ```

yarn workspaces 使用

- 给工作区根目录安装开发依赖
  - yarn add jest -D -W
- 给指定工作区安装依赖
  - yarn workspace lg-button add lodash@4
- 给所有的工作区安装依赖
  - yarn install

## Lerna

### Lerna 介绍

- Lerna 是一个优化使用 git 和 npm 管理多包仓库的工作流工具
- 用于管理具有多个包的 JavaScript 项目
- 它可以一键把代码提交到 git 和 npm 仓库

### Lerna 使用

- 全局安装
  - yarn global add lerna
- 初始化
  - lerna init
- 发布
  - lerna publish

确保 npm 登录，可以使用 npm whoami 查看

确保 npm 镜像源为 https://registry.npmjs.org/ 使用 ```npm config get registry``` 可查看镜像源，如果不是，使用``` npm config set registry https://registry.npmjs.org/``` 设置

## Vue 组件的单元测试

单元测试就是对一个函数的输入和输出进行测试，使用断言的方式，根据输入判断实际的输出和预测的输出是否相同。使用单元测试的目的是发现模块的内部可能出现的错误。

组件的单元测试是使用单元测试工具对组件的各种状态和行为进行测试，确保组件发布之后在项目使用组建的过程中不会导致程序出现错误。

vue 单元测试官方文档：https://cn.vuejs.org/v2/guide/testing.html#%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95

组件单元测试好处

- 提供描述组件行为的文档
- 节省手动测试的时间
- 减少研发新特性时产生的 bug
- 改进设计
- 促进重构

### 安装依赖

- Vue Test Utils
- Jest
- vue-jest
- babel-jest
- 安装
  - yarn add jest @vue/test-utils vue-jest babel-jest -D -W

### 配置测试脚本

- package.json(根目录)

  ```json
  "scripts": {
  	"test": "jest",
  	...
  }
  ```

### Jest 配置文件

- jest.config.js(根目录)

  ```js
  module.exports = {
    "testMatch": ["**/__tests__/**/*.[jt]s?(x)"],
    "moduleFileExtensions": [
      "js",
      "json",
      // 告诉 Jest 处理 `*.vue` 文件
      "vue"
    ],
    "transform": {
      // 用 `vue-jest` 处理 `*.vue` 文件
      ".*\\.(vue)$": "vue-jest",
      // 用 `babel-jest` 处理 js
      ".*\\.(js)$": "babel-jest"
    }
  }
  ```

### Babel 配置文件

- babel.config.js

  ```js
  module.exports = {
    presets: [
      [
        '@babel/preset-env'
      ]
    ]
  }
  ```

- 解决找不到 babel 的问题，因为 Jest 用的是Babel6

  - 使用 Babel 桥接
    - yarn add babel-core@bridge -D -W

Jset 常用 API

- 全局函数
  - describe(name, fn)       把相关测试组合在一起
  - test(name, fn)               测试方法
  - expect(value)                断言
- 匹配器
  - toBe(value)                   判断值是否相等
  - toEqual(obj)                  判断对象是否相等
  - toContain(value)           判断数组或者字符串中是否包含
  - ...
- 快照
  - toMatchSnapshot()

Vue Test Utils 常用 API

- mount()
  - 创建一个包含被挂载和渲染的 Vue 组件的 Wrapper
- Wrapper
  - vm             wrapper 包裹的组件实例
  - props()      返回 Vue 实例选项中的 props 对象
  - html()        组件生成的 HTML 标签
  - find()         通过选择器返回匹配到的组件中的 DOM 元素 
  - trigger()     触发DOM原生事件，自定义事件 wrapper.vm.$emit()
  - ...

编写 **.test.js 文件然后测试：yarn test / yarn test -u(删掉之前的快照，重新生成)

## Rollup 打包

- Rollup 是一个模块打包器
- Rollup 支持 Tree-shaking
- 打包的结果比 Webpack 要小
- 开发框架/组件库的时候使用 Rollup 更合适

安装依赖

- Rollup
- rollup-plugin-terser (压缩代码)
- rollup-plugin-vue@5.1.9 (把单文件组件编译成 js 代码)
- vue-template-compiler

```bash
yarn add rollup rollup-plugin-terser rollup-plugin-vue@5.1.9 vue-template-compiler -D -W
```

在组件包中创建 rollup.config.js 文件

```js
import { terser } from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'
module.exports = [
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'es'
      }
    ],
    plugins: [
      vue({
        css: true, // Dynamically inject css as a <style> tag
        compileTemplate: true, // Explicitly convert template to render function
      }),
      terser()
    ]
  }
]
```

然后再组件包的package.json 中配置 scripts

```
"scripts"： {
	"build": "rollup -c"
}
```

可以在根目录中使用工作区运行打包

```
yarn workspace k-button run build
```

## Rollup 打包所有组件

### 安装依赖

``` bash
yarn add @rollup/plugin-json rollup-plugin-postcss @rollup/plugin-node-resolve -D -W
```

### 配置文件

项目根目录创建 rollup.config.js

```js
import fs from 'fs'
import path from 'path'
import json from '@rollup/plugin-json'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
const isDev = process.env.NODE_ENV !== 'production'
// 公共插件配置
const plugins = [
  vue({
    // Dynamically inject css as a <style> tag
    css: true,
    // Explicitly convert template to render function
    compileTemplate: true
  }),
  json(),
  nodeResolve(),
  postcss({
    // 把 css 插入到 style 中
    // inject: true,
    // 把 css 放到和js同一目录
    extract: true
  })
]
// 如果不是开发环境，开启压缩
isDev || plugins.push(terser())
// packages 文件夹路径
const root = path.resolve(__dirname, 'packages')
module.exports = fs.readdirSync(root)
  // 过滤，只保留文件夹
  .filter(item => fs.statSync(path.resolve(root, item)).isDirectory())
  // 为每一个文件夹创建对应的配置
  .map(item => {
    const pkg = require(path.resolve(root, item, 'package.json'))
    return {
      input: path.resolve(root, item, 'index.js'),
      output: [
        {
          exports: 'auto',
          file: path.resolve(root, item, pkg.main),
          format: 'cjs'
        },
        {
          exports: 'auto',
          file: path.join(root, item, pkg.module),
          format: 'es'
        },
      ],
      plugins: plugins
    }
  })
```

### 在每一个包中设置 package.json 中的 main 和 module 字段

```json
"main": "dist/cjs/index.js",
"module": "dist/es/index.js"
```

### 根目录的 package.json 中配置 scripts

```json
"build": "rollup -c"
```

## 设置环境变量

先安装 cross-env

``` bash
yarn add cross-env -D -W
```

然后再根目录的 package.json 中配置 scripts

```json
    "build:prod": "cross-env NODE_ENV=production rollup -c",
    "build:dev": "cross-env NODE_ENV=development rollup -c"
```

## 清理

### 清理所有包的 node_modules

根目录的 package.json 配置 scripts 

```json
"clean": "lerna clean"
```

### 清理所有包的 dist

先安装依赖

```
yarn add rimraf -D -W
```

然后给每个包的 package.json  配置 scripts

```json
"del": "rimraf dist"
```

然后可以通过 ``` yarn workspaces run del``` 清理

## 基于模板生成组件基本结构

安装 Plop 依赖

```bash
yarn add plop -D -W
```

然后写模板文件，放置在 plop-template 文件夹下

再在根目录中创建 plofile.js 文件

之后再根目录的 package.json 中添加 scripts

```
"plop": "plop"
```