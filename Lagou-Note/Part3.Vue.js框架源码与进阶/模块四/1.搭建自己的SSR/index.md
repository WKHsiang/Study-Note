# Vue SSR 介绍

## Vue SSR 是什么

- 官方文档：https://ssr.vuejs.org/zh/
- Vue SSR （Vue.js Server-Side Rendering）是 Vue.js 官方提供的一个服务端渲染（同构应用）解决方案
- 使用它可以构建同构应用
- 基于原有的 Vue.js 技术栈

## 使用场景

在使用 SSR 前，应该确定自己是否真的需要它

技术层面：

- 更快的首屏渲染速度
- 更好的 SEO

业务层面：

- 不适合管理系统
- 适合门户咨询类网站，如企业官网、知乎、简书等
- 适合移动网站

## 如何实现 Vue SSR

(1) 基于 Vue SSR 官方文档提供的解决方案

官方方案具有更直接的控制应用程序的结构，更深入底层，更加灵活，同时在使用官方方案的过程中，也会对 Vue SSR 有更深的了解。

该方案需要熟悉 Vue.js 本身，并且具有 Node.js 和 webpack 的相当不错的应用经验

(2) Nuxt.js 开发框架

Nuxt 提供了平滑的开箱即用的体验，它建立在同等的 Vue 技术栈上，但抽象出了很多模板，并提供了一些额外的功能，例如静态站点生成。通过 Nuxt.js 可以快速的使用 Vue SSR 构建同构应用

---

# Vue SSR 基本使用

Vue SSR 基本用法

## 渲染一个 Vue 实例

使用 VueSSR 将一个 Vue 实例渲染为 HTML 字符串

模板渲染是服务端渲染中最基础的工作，其实就是如何在服务端使用 Vue 的方式解析替换字符串。

官方文档：https://ssr.vuejs.org/zh/guide/#%E5%AE%89%E8%A3%85

过程：

```bash
mkdir demo
cd demo
npm install vue vue-server-renderer
```

```demo/index.js```:
```js
// 第 1 步：创建一个 Vue 实例
const Vue = require('vue')
const app = new Vue({
  template: `<div>{{ message }}</div>`,
  data: {
    message: "Hello World"
  }
})
// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer()
// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
  // => <div data-server-rendered="true">Hello World</div>
})
// 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
renderer.renderToString(app).then(html => {
  console.log(html)
}).catch(err => {
  console.error(err)
})
```

## 与服务器集成

在 Node.js 服务器中使用时相当简单直接，例如 [Express](https://expressjs.com/)：

首先安装 Express 到项目中

```bash
npm i express
```

然后使用 Express 创建一个基本的 Web 服务

```js
const express = require('express')
const app = express()
app.get('/', (req, res) => {
    res.send('Hello World')
})
app.listen(3000, () => console.log('app listen at http://localhost:3000'))
```

启动 Web 服务

```bash
nodemon index.js
```

在 Web 服务中渲染 Vue 实例

```js
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()
server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })
  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})
server.listen(8080)
```

## 使用一个页面模板

当你在渲染 Vue 应用程序时，renderer 只从应用程序生成 HTML 标记 (markup)。在这个示例中，我们必须用一个额外的 HTML 页面包裹容器，来包裹生成的 HTML 标记。

为了简化这些，你可以直接在创建 renderer 时提供一个页面模板。多数时候，我们会将页面模板放在特有的文件中，例如 `index.template.html`：

```html
<!DOCTYPE html>
<html lang="en">
  <head><title>Hello</title></head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

注意 `<!--vue-ssr-outlet-->` 注释 -- 这里将是应用程序 HTML 标记注入的地方。

然后，我们可以读取和传输文件到 Vue renderer 中：

```js
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})
renderer.renderToString(app, (err, html) => {
  console.log(html) // html 将是注入应用程序内容的完整页面
})
```

-------

# 构建同构渲染

## 源码结构

我们需要使用 Webpack 来打包我们的 Vue 应用程序，事实上，我们可能需要在服务器上使用 Webpack 打包 Vue 应用程序，因为：

- 通常 Vue 应用程序是由 Webpack 和 vue-loader 构建，并且许多 Webpack  特定功能不能直接在 Node.js 中运行（例如：通过 file-loader 导入文件，通过 css-loader 导入 CSS）
- 尽管 Node.js 最新版本能够完全支持 ES2015 特性，但我们还是需要转译客户端代码以适应老版本浏览器，这也会涉及到构建步骤

所以基本看法是，对于客户端应用程序和服务器应用程序，我们都要使用 Webpack 打包。服务器需要【服务器 bundle】然后用于服务器端渲染（SSR），而【客户端 bundle】会发送给浏览器，用于混合静态标记

使用 Webpack 来处理服务器和客户端的应用程序，大部分源码可以使用通用方式编写，可以使用 Webpack 支持的所有功能。同时，在编写通用代码时，应注意一些[规范](https://ssr.vuejs.org/zh/guide/universal.html)

一个基本项目可能是这样的：

```bash
src
|-- components
|	|-- A.vue
|	|-- B.vue
|	|-- C.vue
|-- App.vue
|-- app.js # 通用 entry (universal entry)
|-- entry-client.js # 仅运行于浏览器
|-- entry-server.js # 仅运行于服务器
server.js
index.template.html
```

### App.vue

```vue
<template>
	<!-- 客户端渲染的入口节点 -->
	<div id="app">
        <h1>
            Hello
    	</h1>
    </div>
</template>
<script>
export default {
    name: 'App'
}
</script>
```

### app.js

```app.js``` 是应用程序的【通用 entry】。在纯客户端应用程序中，我们将在此文件中创建根 Vue 实例，并直接挂载到 DOM。但是，对于服务端渲染（SSR），责任将转移到纯客户端 entry 文件，```app.js``` 只是简单地使用 export 导出一个 ```createApp``` 函数：
```js
/**
 * 通用启动入口
 */
import Vue from 'vue'
import App from './App.vue'
// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app }
}
```

### entry-client.js

客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中：

```js
import { createApp } from './app'
// 客户端特定引导逻辑...
const { app } = createApp()
// 这里假定 App.vue 模板中根元素具有 id="app"
app.$mount('#app')
```

### entry-server.js

服务器 entry 使用 export default 导出函数，并且在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，它不会做太多事情 - 但是稍后将会在此执行服务器端路由匹配（server-side route matching）和数据预取逻辑（data pre-fetching logic）

```js
import { crateApp } from './app'
export default context => {
  const { app } = createApp()
  return app
}
```

### server.js

```js
/**
 * 通用应用 Web 服务启动脚本
 * 渲染一个 Vue 实例
 * 结合到 Web 服务中
 */
const express = require('express')
const Vue = require('vue')
const VueServerRenderer = require('vue-server-renderer')
const fs = require('fs')
const server = express() // 创建 express 实例
// 生成一个渲染器
const renderer = VueServerRenderer.createRenderer({
  // 渲染器就会自动把渲染的结果注入到模板中
  template: fs.readFileSync('./index.html', 'utf-8')
})
const createApp = () => {
  const app = new Vue({
    template: `
      <div id="app">
        <h1>Hello {{ message }}</h1>
        <input v-model="message">
      </div>
    `,
    data: {
      message: 'World'
    }
  })
  return app
}
// 设置一个路由
server.get('/', async (req, res) => {
  try {
    const app = createApp()
    const ret = await renderer.renderToString(app, {
      title: 'SSR...',
      meta: `
        <meta name="description" content="hello world"
	  `
    })
    res.end(ret)
  } catch (err) {
    res.status(500).end('Internal Server Error.')
  }
})
//  监听端口，启动 Web 服务
server.listen(3000, () => {
  console.log('server running at port 3000.')
})
```

### index.template.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>...</title>
  </head>
  <body>
    <!-- 服务端渲染的内容出口 -->
    <!--vue-ssr-outlet-->
  </body>
</html>

```

## 构建配置

### 安装依赖

(1) 安装生产依赖

```bash
npm i vue vue-server-renderer express cross-env
```

| 包                  | 说明                                |
| ------------------- | ----------------------------------- |
| vue                 | Vue.js 核心库                       |
| vue-server-renderer | Vue 服务端渲染工具                  |
| express             | 基于 Node 的 Web 服务框架           |
| cross-env           | 通过 npm scripts 设置跨平台环境变量 |

(2) 安装开发依赖

```bash
npm i -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core
@babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader urlloader file-loader rimraf vue-loader vue-template-compiler friendly-errorswebpack-plugin
```

| 包                                                           | 说明                                         |
| ------------------------------------------------------------ | -------------------------------------------- |
| webpack                                                      | webpack 核心包                               |
| webpack-cli                                                  | webpack 的命令行工具                         |
| webpack-merge                                                | webpack 配置信息合并工具                     |
| webpack-node-externals                                       | 排除 webpack 中的 Node 模块                  |
| rimraf                                                       | 基于 Node 封装的一个跨平台 ```rm -rf``` 工具 |
| friendly-errors-webpack-plugin                               | 友好的 webpack 错误提示                      |
| @bebel/core<br>@babel/plugin-transform-runtime<br>@babel/preset-enb<br>babel-loader | Babel 相关工具                               |
| vue-loader<br>vue-template-compiler                          | 处理 .vue 资源                               |
| file-loader                                                  | 处理字体资源                                 |
| css-loader                                                   | 处理 CSS 资源                                |
| url-loader                                                   | 处理图片资源                                 |

### 配置文件及打包命令

(1) 初始化 webpack 打包配置文件

```
build
|-- webpack.base.config.js # 公共配置
|-- webpack.client.config.js # 客户端打包配置文件
|-- webpack.server.config.js # 服务端打包配置文件
```

```webpack.base.cofig.js```
```js
/**
 * 公共配置
 */
const VueLoaderPlugin = require('vue-loader/lib/plugin') // 用来处理 .vue 资源的插件
const path = require('path') // 处理路径
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin') // 提供 webpack 打包的日志友好输出
const resolve = file => path.resolve(__dirname, file) // 得到一个绝对安全的文件路径
const isProd = process.env.NODE_ENV === 'production' // 判断是否开发模式
module.exports = {
  mode: isProd ? 'production' : 'development', // 打包模式
  output: {
    path: resolve('../dist/'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      // 路径别名，@ 指向 src
      '@': resolve('../src/')
    },
    // 可以省略的扩展名
    // 当省略扩展名的时候，按照从前往后的顺序依次解析
    extensions: ['.js', '.vue', '.json']
  },
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
  module: {
    rules: [
      // 处理图片资源
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      // 处理字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
      // 处理 .vue 资源
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 处理 CSS 资源
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      
      // CSS 预处理器，参考：https://vue-loader.vuejs.org/zh/guide/pre-processors.html
      // 例如处理 Less 资源
      // {
      //   test: /\.less$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader',
      //     'less-loader'
      //   ]
      // },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ]
}
```

```webpack.client.config.js```
```js
/**
 * 客户端打包配置
 */
const { merge } = require('webpack-merge') // 用来合并webpack配置信息
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
module.exports = merge(baseConfig, {
  entry: {
    app: './src/entry-client.js' // 基于打包所在目录
  },
  module: {
    rules: [
      // ES6 转 ES5
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
    ]
  },
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity
    }
  },
  plugins: [
    // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ]
})
```

```webpack.server.config.js```
```js
/**
 * 服务端打包配置
 */
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: './src/entry-server.js',
  // 这允许 webpack 以 Node 适用方式处理模块加载
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',
  output: {
    filename: 'server-bundle.js',
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    libraryTarget: 'commonjs2'
  },
  // 不打包 node_modules 第三方包，而是保留 require 方式直接加载
  externals: [nodeExternals({
    // 白名单中的资源依然正常打包
    allowlist: [/\.css$/]
  })],
  plugins: [
    // 这是将服务器的整个输出构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin()
  ]
})
```

(2) 在 npm scripts 中配置打包命令

```
  "scripts": {
    "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js",
    "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js",
    "build": "rimraf dist && npm run build:client && npm run build:server"
  }
```

运行测试

```bash
npm run build:client
npm run build:server
npm run build
```

### 启动应用

```js
// server.js
const Vue = require('vue')
const express = require('express')
const fs = require('fs')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync('./index.template.html', 'utf-8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const renderer = require('vue-serverrenderer').createBundleRenderer(serverBundle, {
  template,
  clientManifest
})
const server = express()
server.use('/dist', express.static('./dist'))
server.get('/', (req, res) => {
  renderer.renderToString({
    title: 'ff',
    meta: `
      <meta name="description" content="ff">
    `
  }, (err, html) => {
    if (err) {
      return res.status(500).end('Internal Server Error.')
    }
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  })
})
server.listen(3000, () => {
  console.log('server running at port 3000.')
})
```

### 解析渲染流程

(1) 服务端渲染

- renderer.renderToString 渲染了什么? Vue 实例
- renderer 是如何拿到 entry-server 模块的？
  - createBundleRenderer 中的 serverBundle
- server Bundle 是 Vue SSR 构建的一个特殊的 JSON 文件
  - entry: 入口
  - files：所有构建结果资源列表
  - maps：源代码 source map 信息
- server-bundle.js 就是通过 server.entry.js 构建出来的结果文件
- 最终把渲染结果注入到模板中

(2) 客户端渲染

- vue-ssr-client-manifest.json
  - publicPath：访问静态资源的根相对路径，与 webpack 配置中的 publicPath 一致
  - all：打包后的所有静态资源文件路径
  - initial：页面初始化时需要加载的文件，会在页面加载时配置到 preload 中
  - async：页面跳转时需要加载的文件，会在页面加载时配置到 prefetch 中
  - modules：项目的各个模块包含的文件的序号，对应 all 中文件的顺序；moduleldentifier 和 all 数组中文件的映射关系（modules 对象是我们查找文件引用的重要数据）

## 构建开发模式

上面实现了同构应用的基本功能，但是对于一个完整的应用来说还不足够。例如如何处理同构应用中的路由、如何在服务端渲染中进行数据预取等功能。在实现这些之前，先来解决一个关于打包的问题：

- 每次写完代码，都要重新打包构建
- 重新启动 Web 服务

每次都需要这样就很麻烦。下面来实现项目中的开发模式构建，希望能够实现：

- 写完代码，自动构建
- 自动重启 Web 服务
- 自动刷新页面内容等

### 基本思路

- 生产模式
  - npm run build 构建
  - node server.js 启动应用
- 开发模式：
  - 监视代码变动自动构建，热更新等功能
  - node server.js 启动应用

因此设计了如下的启动脚本：

```js
"scripts": {
    ...
    // 启动开发服务
    "dev": "node server.js"
    // 启动生产模式
    "start": "cross-env NODE_ENV=production && node server.js"
}
```

服务端配置：

```js
/**
* 服务端入口，仅运行于服务端
*/
const express = require('express')
const path = require('path')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const isProd = process.env.NODE_ENV === 'production'
const templatePath = './index.html'
let renderer
// 生产模式，直接基于已构建好的包创建渲染器
if (isProd) {
  const template = fs.readFileSync(templatePath, 'utf-8')
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
  })
} else {
  // 开发模式
  // 打包构建（客户端 + 服务端） -> 创建渲染器
}
const server = express()
server.use(express.static(path.resolve(__dirname, './dist/')))
async function render (req, res) {
  const context = { url: req.url }
  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
  // bundle renderer 在调用 renderToString 时，
  // 它将自动执行「由 bundle 创建的应用程序实例」所导出的函数（传入上下文作为参数），然后渲染它。
  try {
    const html = await renderer.renderToString(context)
    res.send(html)
  } catch (err) {
    res.status(500).end(err.message)
  }
}
server.get('*', isProd
? render // 生产模式：使用构建好的包直接渲染
: (req, res) => {
  // 开发模式：等编译构建好再渲染
})
server.listen(8080, () => console.log('running 8080'))
```

### 封装处理模块

```build/setup-dev-server.js```
```js
module.exports = function (app, templatePath, cb) {
  let ready
  const onReady = new Promise(r => ready = r)
  let serverBundle
  let clientManifest
  let template
  const update = () => {
    if (serverBundle && clientManifest) {
      // 构建完毕，通知 server 可以 render 渲染了
      ready()
      // 更新 server 中的 Renderer
      cb(serverBundle, {
        template,
        clientManifest
      })
    }
  }
  // 监视构建 template，调用 update 更新 Renderer
  
  // 监视构建 serverBundle，调用 update 更新 Renderer
  
  // 监视构建 clientManifest，调用 update 更新 Renderer
  
  return onReady
}
```

```server.js```
```js
const express = require('express')
const path = require('path')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const isProd = process.env.NODE_ENV === 'production'
const templatePath = './index.html'
const app = express()
let renderer
let onReady
// 生产模式，直接基于已构建好的包创建渲染器
if (isProd) {
  const template = fs.readFileSync(templatePath, 'utf-8')
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
  })
} else {
  // 开发模式
  // 打包构建（客户端 + 服务端）
  // ↓
  // 创建渲染器
  // 模板 + 客户端 bundle + 服务端 bundle
  // 改变 -> 从新生成渲染器
  // 源码改变 -> 打包客户端 Bundle + 服务端 Bundle
  // onReady 是一个 Promise,当它完成的时候意味着初始构建已完成
  onReady = require('./build/setup-dev-server')(
    app,
    templatePath,
    (serverBundle, options) => {
      // 该回调函数是重复调用的
      // 每当生成新的 template、客户端 bundle、服务端 bundle 都会重新生成新的渲染器
      renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false, // 推荐
        ...options
      })
    }
  )
}
app.use(express.static(path.resolve(__dirname, './dist/')))
async function render (req, res) {
  const context = { url: req.url }
  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
  // bundle renderer 在调用 renderToString 时，
  // 它将自动执行「由 bundle 创建的应用程序实例」所导出的函数（传入上下文作为参数），然后渲染它
  try {
    const html = await renderer.renderToString(context)
    res.send(html)
  } catch (err) {
    res.status(500).end(err.message)
  }
}
app.get('*', isProd
  ? render // 生产模式：使用构建好的包直接渲染
  : async (req, res) => {
    // 开发模式：等第一次构建好再渲染
    await onReady
    render(req, res)
})
app.listen(8080, () => console.log('running 8080'))
```

### 更新模板

关于 Node 中的监视的问题：

- fs.watch
- fs.watchFile
- 第三方包：[chokidar](https://www.npmjs.com/package/chokidar)

```js
// 监视构建 template，调用 update 更新 Renderer
template = fs.readFileSync(templatePath, 'utf-8')
chokidar.watch(templatePath).on('change', () => {
  template = fs.readFileSync(templatePath, 'utf-8')
  update()
})
```

### 更新服务端打包

```js
// 监视服务端打包构建
const serverConfig = require('./webpack.server.config')
const serverCompiler = webpack(serverConfig)
serverCompiler.watch({
  // 监视打包的可选配置参数
}, (err, stats) => {
  if (err) throw err
  if (stats.hasErrors()) return
 
  // read bundle generated by vue-ssr-webpack-plugin
  serverBundle = JSON.parse(fs.readFileSync('./dist/vue-ssr-server-bundle.json','utf-8'))
    
  // 更新 Renderer
  update()
})
```

### 将打包结果存储到内存中

webpack 默认会把构建结果存储到磁盘中，对于生产模式构建来说是没有问题的，但是我们在开发模式中会频繁的修改代码触发构建，也就意味着要频繁的操作磁盘数据，而磁盘数据操作相对于来说是比较慢的，所以我们可以把数据存储到内存中，这样可以极大的提高构建的速度。

[memfs](https://github.com/streamich/memfs)是一个兼容 Node 中 fs 模块 API 的内存文件系统，通过它可以轻松的实现把 webpack 构建结果输出到内存中进行管理

方案一：自己配置 memfs

```js
const { createFsFromVolume, Volume } = require('memfs')
// 自定义 webpack 把数据写入内存中
serverCompiler.outputFileSystem = createFsFromVolume(new Volume())
// memfs 模块去除了 join 方法，所以这里我们需要手动的给它提供 join 方法
serverCompiler.outputFileSystem.join = path.join.bind(path)
serverCompiler.watch({
  // 监视构建的配置选项
}, (err, stats) => {
  // 每当构建成功，就会执行该回调函数
  if (err) {
    throw err
  }
  if (stats.hasErrors()) {
    return
  }
  
  // 读取打包之后的最新结果
  serverBundle = JSON.parse(serverCompiler.outputFileSystem.readFileSync(resolve('../dist/vuessr-server-bundle.json'), 'utf-8'))
  // update 更新
  update()
})
```

方案二：使用[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)

webpack-dev-middleware 作用是以监听模式启动 webpack，将编译结果输出到内存中，然后将内存文件输出到 Express 服务中

安装依赖

```bash
npm i -D webpack-dev-middleware
```

配置到构建流程中

```js
// 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
const serverConfig = require('./webpack.server.config')
const serverCompiler = webpack(serverConfig)
webpackDevMiddleware(serverCompiler, {
  logLevel: 'silent'
})
serverCompiler.hooks.done.tap('server', () => {
  serverBundle = JSON.parse(serverCompiler.outputFileSystem.readFileSync(resolve('../dist/vue-ssrserver-bundle.json'), 'utf-8'))
  update()
})
```

### 更新客户端打包

```js
// 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
const clientConfig = require('./webpack.client.config')
const clientCompiler = webpack(clientConfig)
clientDevMiddleware = webpackDevMiddleware(clientCompiler, {
  publicPath: clientConfig.output.publicPath, // 重要！输出资源的访问路径前缀，应该和客户端打包输出的 publicPath 一致
  logLevel: 'silent'
})
clientCompiler.hooks.done.tap('client', () => {
  clientManifest = JSON.parse(clientCompiler.outputFileSystem.readFileSync(resolve('../dist/vue-ssrclient-manifest.json'), 'utf-8'))
  update()
})
// 重要！将内存中的资源通过 Express 中间件对外公开访问
server.use(clientDevMiddleware)
```

### 热更新

热更新功能需要使用[webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware)工具包

```bash
npm i -D webpack-hot-middleware
```

```js
const hotMiddleware = require('webpack-hot-middleware')
// 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
const clientConfig = require('./webpack.client.config')
// ====================== 热更新配置 ============================
clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
clientConfig.entry.app = ['webpack-hot-middleware/client?reload=true&noInfo=true', clientConfig.entry.app]
clientConfig.output.filename = '[name].js'
// ======================== /热更新配置 ==========================
const clientCompiler = webpack(clientConfig)
clientDevMiddleware = webpackDevMiddleware(clientCompiler, {
  publicPath: clientConfig.output.publicPath,
  logLevel: 'silent'
})
clientCompiler.hooks.done.tap('client', () => {
  clientManifest = JSON.parse(clientCompiler.outputFileSystem.readFileSync(resolve('../dist/vue-ssrclient-manifest.json'), 'utf-8'))
  update()
})
server.use(clientDevMiddleware)
// 挂载热更新的中间件
server.use(hotMiddleware(clientCompiler, {
  log: false
}))
```

工作原理：

- 中间件将自身安装为 webpack 插件，并侦听编译器事件
- 每个连接的客户端都有一个 Server Sent Events 连接，服务器将在编译器事件上向连接的客户端发布通知
  - [MDN - 使用服务器发送事件](https://developer.mozilla.org/zh-CN/docs/Server-sent_events/Using_server-sent_events)
  - [Server-Sent Events 教程](http://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
- 当客户端收到消息时，它将检查本地代码是否为最新。如果不是最新版本，它将触发 webpack 热模块重新加载

-------

# [编写通用代码](https://ssr.vuejs.org/zh/guide/universal.html)

让我们花点时间来讨论编写"通用"代码时的约束条件 - 即运行在服务器和客户端的代码。由于用例和平台 API 的差异，当运行在不同环境中时，我们的代码将不会完全相同。所以这里我们将会阐述你需要理解的关键事项。

## 服务器上的数据响应

在纯客户端应用程序 (client-only app) 中，每个用户会在他们各自的浏览器中使用新的应用程序实例。对于服务器端渲染，我们也希望如此：每个请求应该都是全新的、独立的应用程序实例，以便不会有交叉请求造成的状态污染 (cross-request state pollution)。

因为实际的渲染过程需要确定性，所以我们也将在服务器上“预取”数据 ("pre-fetching" data) - 这意味着在我们开始渲染时，我们的应用程序就已经解析完成其状态。也就是说，将数据进行响应式的过程在服务器上是多余的，所以默认情况下禁用。禁用响应式数据，还可以避免将「数据」转换为「响应式对象」的性能开销。

## 组件生命周期钩子函数

由于没有动态更新，所有的生命周期钩子函数中，只有 `beforeCreate` 和 `created` 会在服务器端渲染 (SSR) 过程中被调用。这就是说任何其他生命周期钩子函数中的代码（例如 `beforeMount` 或 `mounted`），只会在客户端执行。

此外还需要注意的是，你应该避免在 `beforeCreate` 和 `created` 生命周期时产生全局副作用的代码，例如在其中使用 `setInterval` 设置 timer。在纯客户端 (client-side only) 的代码中，我们可以设置一个 timer，然后在 `beforeDestroy` 或 `destroyed` 生命周期时将其销毁。但是，由于在 SSR 期间并不会调用销毁钩子函数，所以 timer 将永远保留下来。为了避免这种情况，请将副作用代码移动到 `beforeMount` 或 `mounted` 生命周期中。

## 访问特定平台(Platform-Specific) API

通用代码不可接受特定平台的 API，因此如果你的代码中，直接使用了像 `window` 或 `document`，这种仅浏览器可用的全局变量，则会在 Node.js 中执行时抛出错误，反之也是如此。

对于共享于服务器和客户端，但用于不同平台 API 的任务(task)，建议将平台特定实现包含在通用 API 中，或者使用为你执行此操作的 library。例如，[axios](https://github.com/axios/axios) 是一个 HTTP 客户端，可以向服务器和客户端都暴露相同的 API。

对于仅浏览器可用的 API，通常方式是，在「纯客户端 (client-only)」的生命周期钩子函数中惰性访问 (lazily access) 它们。

请注意，考虑到如果第三方 library 不是以上面的通用用法编写，则将其集成到服务器渲染的应用程序中，可能会很棘手。你*可能*要通过模拟 (mock) 一些全局变量来使其正常运行，但这只是 hack 的做法，并且可能会干扰到其他 library 的环境检测代码。

## 自定义指令

大多数自定义指令直接操作 DOM，因此会在服务器端渲染 (SSR) 过程中导致错误。有两种方法可以解决这个问题：

1. 推荐使用组件作为抽象机制，并运行在「虚拟 DOM 层级(Virtual-DOM level)」（例如，使用渲染函数(render function)）。
2. 如果你有一个自定义指令，但是不是很容易替换为组件，则可以在创建服务器 renderer 时，使用 [`directives`](https://ssr.vuejs.org/zh/api/#directives) 选项所提供"服务器端版本(server-side version)"。

---

# 路由和代码分割

https://ssr.vuejs.org/zh/guide/routing.html

----

# 管理页面 Head

无论是服务端渲染还是客户端渲染，都是用的同一个页面模板，页面中的 body 时动态渲染出来的，但是页面的 head 是写死的，。我们希望不同的页面可以拥有自己的 head 内容。

官方文档里描述的相对讲更原生，使用比较麻烦。我们采用第三方解决方案:[vue-meta](https://github.com/nuxt/vue-meta)

Vue Meta 是一个支持 SSR 的第三方 Vue.js 插件，可轻松的实现不同页面的 head 内容管理。使用它的方式非常简单，只需要在页面组件中使用 ``` metaInfo``` 属性配置页面的head 内容即可

----

# 数据预取和状态

https://ssr.vuejs.org/zh/guide/data.html