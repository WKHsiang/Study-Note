# 模块化开发与规范化标准

## 一.模块化开发

### 1.模块化规范

- Nodejs中的CommonJS规范
    - 1. 一个文件就是一个模块
    - 2. 每个模块都有单独的作用域
    - 3. 通过module.exports导出成员
    - 4. 通过require函数载入模块
    - 5. 以同步模式加载模块

- 浏览器中的AMD规范（require.js）
    - 1. 用define定义模块
    - 2. 用require加载模块
    - AMD使用起来相对复杂，模块JS文件请求频繁
```javascript
define('conor',['Module1', ‘Module2’], function (Module1, Module2) {
    function foo () {
        Module1.test();
    }
    return {foo: foo}
});
require(['conor'], function (math) {
　　math.add(2, 3);
});
```

- 浏览器中的CMD规范（seaJs）
    - 1. CMD和AMD是同期出现的，使用也类似，不过CMD语法上更贴近CommonJS
    - 2. 对于依赖的模块，AMD是提前执行，CMD是延迟执行。不过RequireJS从2.0开始，也改成可以延迟执行（根据写法不同，处理方式不同）
    - 3. AMD推崇依赖前置（在定义模块的时候就要声明其依赖的模块），CMD推崇依赖就近（只有在用到某个模块的时候再去require —— 按需加载）

- ES6中推出的ESModule规范
    - 目前最主流的前端模块化方案

### 2. ES Modules语法特性

基本特性：
- 1.ESM默认是严格模式忽略’use strict’,严格模式下this指向undefined

- 2.ESM的每个模块都有单独的私有作用域

- 3.ESM是通过cors的方式请求外部JS模块的

- 4.ESM会延迟执行脚本
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        <!-- 通过给script添加type="module",就可以用ESModule的标准执行其中的JS代码了 -->
        <script type="module">
            console.log('ESModule语法特性');
        </script>

        <!-- ESM默认是严格模式忽略'use strict',严格模式下this指向undefined -->
        <script type="module">
            var foo = '123'
            console.log(foo);
            console.log(this);
        </script>

        <!-- 非严格模式this指向window -->
        <script>
            console.log(this);
        </script>
        
        <!-- ESM的每个模块都有单独的私有作用域 -->
        <script type="module">
            console.log(foo);//报错
        </script>

        <!-- ESM是通过cors的方式请求外部JS模块的 -->
        <script type="module" src="https://code.jquery.com/jquery-3.0.0.min.js"></script>

        <!-- 正常情况下的script代码会阻塞p标签的渲染,而ESM会延迟执行脚本 -->
        <script>
            alert('123')
        </script>
        
        <script type="module">
            alert('123')
        </script>
        
        <p>需要显示的内容</p>
    </body>
</html>
```

### 3. ES Modules

`用export导出,import导入.共有以下几种方式`

- export 单个导出
```javascript
//模块导出文件
export var name = 'foo module'
export function hello () {
    console.log('hello')
}
export class Person {}
```
```javascript
//模块导入文件
//import {name,hello,Person} from './module' 		//报错
//import {name,hello,Person} from 'module.js'   //报错,以字母开头会被认为是第三方模块
//模块引入必须是完整的./开头的相对路径  or /开头的觉得路径 or 一个cdn链接
import {name, hello, Person} from './module.js'
console.log(name)
console.log(hello)
console.log(Person)

//或者
import * as mod from './module.js' 
console.log(mod.name)
console.log(mod.hello)
console.log(mod.Person)

// 动态导入
import('./module.js').then(module => console.log(module))
```

- export 统一导出
```javascript
//模块导出文件
var name = 'foo module'
function hello () {
    console.log('hello Boy')
}
class Person {}

// as重命名,如果是default的话导入的时候就必须重命名
// 注意:这里导出的花括符不是对象的字面量,import的引入也不是对象的解构.而是ESM的一种固有的写法.
// 如果真的要导出一个对象的话可以用export default
export{name as default,hello as helloBoy,Person}
```
```javascript
//模块导入文件
import {default as fooName,helloBoy,Person} from './module.js'
console.log(fooName)
console.log(helloBoy)
console.log(Person)
```

- 默认导出
```javascript
// 模块导出文件
var name = 'foo module'
var obj = {name}
// 这样写的话,可以用任意名接收这个对象
export default obj
```
```javascript
//模块导入文件
//注意:这里导入的nameobj不是被拷贝的值而是一个地址,它会随着导出模块中变量的变化而变化.且这个值无法修改.
import nameobj from './module.js'
console.log(nameobj.name)
```

- 只执行模块而不导入
```javascript
//模块导入文件
import {} from './module.js'
//或者
import './module.js'
```

- 运行时按需使用模块
```javascript
var modulePath = './module.js'
import {name} from modulePath; //报错

if(true){
	import {name} from './module.js'; //报错
}

import ('./module.js').then((res)=>{
	console.log()
})
```

- 默认导出和正常导出一起使用
```javascript
//模块导出文件
var name = 'foo module'
function hello () {
    console.log('hello Boy')
}
class Person {}
export{hello as helloBoy,Person}
export default name
```
```javascript
//模块导入文件
import {helloBoy,Person,default as name} from './module.js' 
//或者
import name,{helloBoy,Person} from './module.js' 
console.log(name)
console.log(Person)
```

- 导出导入成员
```javascript
//模块导入文件
export {helloBoy,Person,default as name} from './module.js' 
//这里就访问不到helloBoy,Person,name
```

### 4. ES Modules兼容性
*将浏览器中不识别的esmodule代码去交给babel转换,然后对那些import下来的文件去进行ajax请求把请求下来的文件再去进行转换从而支持esm .
但是这样子的话在那些支持的环境中就会运行两次代码. 这个问题可以通过添加nomodule属性解决 .
这种方式效率很低下,只适合在开发环境中.在生产环境中还是要预先把代码都编译好再部署*

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        <script nomodule src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/babel-browser-build.js"></script>
        <script nomodule src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/browser-es-module-loader.js"></script>
        <script nomodule src="https://unpkg.com/promise-polyfill@8.1.3/dist/polyfill.min.js"></script>
        <script type="module">
            import {foo} from './module.js';
            console.log(foo);
        </script>
    </body>
</html>
```

### 5. 在node中使用ES Modules
*在node中如果要使用ESM,js文件名后缀需要用.mjs(在node12.10.0版本中可以在package.json中写入一个type:"module"字段这样ESM的后缀可以正常的用.js但是CommonJS的话要用.cjs后缀)
ESM中可以导入CommonJS模块类但不能在commonjs中require载入ESM
CommonJS模块类始终导出一个默认成员,所以接收的时候不能用{}
但是node的内置模块兼容了ESM的提取成员方式*

- 运行node --experimental-modules app.mjs

```javascript
//ESM模块

import {foo,hello,Person} from './module.mjs';
console.log(foo);

import fs from 'fs';
fs.writeFileSync('./foo.txt','es module working!');

// 内置模块兼容了ESM的提取成员方式
import {writeFileSync} from 'fs';
writeFileSync('./bar.txt','es module working!');

import _ from 'lodash';
console.log(_.camelCase('SSssSS'))

//不支持,因为第三方模块都是导出默认成员
// import { camelCase } from 'lodash'
// console.log(camelCase('ES Modules'))

// ESM中可以导入CommonJS模块类
// import mod from './commonjs.js'
// console.log(mod)

//不能直接提取
// import {foo} from './commonjs.js'
// console.log(foo) //报错

export const foo = 'es module export value'
```

```javascript
//commonjs模块

// module.exports = {
//     foo:'commonjs exports value'
// }

// 不能在node的commonjs中通过require载入ESM,但是在webpack中可以
// const mod = require('./index.mjs')
// console.log(mod)

//CommonJS始终导出一个默认成员,所以接收的时候不能用{}
exports.off="commonjs exports value"
```

```javascript
//ESM模块

//加载模块函数:require
//模块对象:module
//导出对象别名:exports
//当前文件的绝对路径:__filename
//当前文件所在目录:__dirname

//ESM中没有CommonJS中的以上这些模块全局成员,前三种可以用import和export代替
//__filename和__dirname可以通过 import.meta.url
console.log(import.meta.url)
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
console.log(__filename)

//__dirname
import {dirname} from 'path';
const __dirname = dirname(__filename);
console.log(__dirname)
```

### 6. 在node中使用ES Modules兼容性问题
*在node低版本中ESM同样需要转译,这里可以使用babel去处理*

## 二.Webpack打包

打包工具解决的是前端整体的模块化，并不单指 JavaScript 模块化


### webpack 工作模式
mode: 'production',
mode: 'development',
mode: 'none',

### webpack 资源模块加载
- JS file => Default Loader
- Other file => Other Loader

### webpack 导入资源模块
- JavaScript 驱动整个前端应用
- 在 js 中导入相关资源模块，逻辑合理，JS 确实需要这些资源文件
- 确保上线资源不缺失，都是必要的

> 学习一个新事物，不是学会它的所有用法就能提高，掌握新事物的思想才是突破点。能够搞明白这些新事物为什么这样设计，那就基本上算是出道了。

### webpack 文件资源加载器
- JS file => Default Loader => Bundle.js
- 图片、字体等资源文件 => File Loader => 文件路径 => Bundle.js


### webpack URL 加载器
协议 媒体类型和编码 文件内容

data:[<mediatype>][;base64],<data>

data:text/html;charset-UTF-8,<h1>content</h1>

data:image/png;base64,iVBORw0KGg...SuQmCC

最佳实践
- 小文件使用 Data URLs，减少请求次数
- 大文件单独提取存放，提高加载速度

```javascript
{
    test: /.png$/,
    use: {
        loader: 'url-loader',
        options: {
            limit: 10 * 1024 // 10 KB
        }
    }
}
```
- 超出 10KB 文件单独提取存放
- 小于 10KB 文件转换为 Data URLS 嵌入代码中

### webpack 常用加载器分类
- 编译转换类（css-loader => 以 JS 形式工作的我 CSS 模块）
- 文件操作类（file-loader => 导出文件访问路径）
- 代码检查类（eslint-loader => 检查通过/不通过）


### webpack 加载资源的方式
- 遵循 ES Modules 标准的 import 声明
- 遵循 CommonJS 标准的 require 函数
- 遵循 AMD 标准的 define 函数和 require 函数
- * 样式代码中的 @import 执行和 url 函数
- * HTML 代码中图片标签的 src 属性

### webpack 核心工作原理
Loader 机制是 Webpack 的核心

### webpack 插件机制 

- Loader 专注实现资源模块加载
- Plugin 解决其他自动化工作

Plugin 用途：
- 打包之前清除 dist 目录
- 拷贝静态文件至输出目录
- 压缩输出代码

常用的插件：
- clean-webpack-plugin  打包之前清除 dist 目录
- html-webpack-plugin  用于生成 index.html 文件
- copy-webpack-plugin  拷贝静态文件至输出目录

开发一个插件：插件是通过在生命周期的钩子中挂载函数实现扩展

### 如何增强 webpack 开发体验

- 自动编译
- 自动刷新浏览器
- webpack-dev-server：继承了以上特性的工具

### Source Map
- 运行代码与源代码之间完全不同
- 如果需要调试应用，或者运行应用过程中出现了错误，错误信息无法定位
- 调试和报错都是基于运行代码
- Source Map 解决了源代码与运行代码不一致所产生的问题

### Source Map 的方式

webpack 支持 12 种不同的 source-map 方式，每种方式的效率和效果各不相同

不同 devtool 之间的差异
- eval - 是否使用 eval 执行模块代码
- cheap - Source Map 是否包含行信息
- module - 是否能够得到 Loader 处理之前的源代码

#### 选择合适的 Source Map

开发模式：cheap-module-eval-source-map
- 我的代码每行不会超过 80 个字符
- 我的代码经过 Loader 转换过后的差异较大
- 首次打包速度慢无所谓，重新打包速度较快

生产环境：none / nosources-source-map
- 安全隐患，source-map 会暴露源代码
- 调试是开发阶段的事情
- 没有绝对的选择，理解不同模式的差异，适配不同的环境

### HMR 体验
HMR(Hot Module Replacement): 模块热替换
- 应用运行过程中实时替换某个模块
- 应用运行状态不受影响
- 自动刷新会导致页面状态丢失
- 热替换只将修改的模块实时替换至应用中

#### 开启 HMR
集成在 webpack-dev-server 中
- webpack-dev-server --hot
- 也可以通过配置文件开启

#### HMR 的疑问
- webpack 中的 HMR 并不可以开箱即用
- webpack 中的 HMR 需要手动处理模块热替换逻辑
- 为什么样式文件的热更新开箱即用？因为样式经过了 loader 处理，然后只需要替换掉某段 <style></style> 就可以实现
- 我的项目没有手动处理，JS 照样可以热替换？因为使用了框架，框架下的开发，每种文件都是有规律的
- 通过脚手架创建的项目内部都集成了 HMR 方案

总结：我们需要手动处理 JS 模块更新后的热替换


### Webpack 生产环境优化

- 生产环境跟开发环境有很大差异
- 生产环境注重运行效率，开发环境注重开发效率
- 模式（mode），为不同的工作环境创建不同的配置


### Webpack Tree Shaking
- 尽可能的将所有模块合并输出到一个函数中
- 既提升了运行效率，又减少了代码体积
- Tree Shaking 又被称为 Scope Hoisting 作用域提升

### Webpack Tree Shaking 与 Babel
- Tree Shaking 前提是 ES Modules
- 由 Webpack 打包的代码必须使用 ESM
- 为了转换代码中的 ECMAScript 新特性而使用 babel-loader ，就有可能导致 ESM => CommonJS，这取决我们有没有使用转换 ESM 的插件


### Webpack 代码分割

代码分包
- 所有代码最终都被打包到一起，bundle 体积过大
- 并不是每个模块在启动时都是必要的
- 模块打包是必要的，但是应用越来越大之后，需要进行分包，按需加载
- 有两种方式：多入口打包；ESM 动态导入


#### 多入口打包
- 常用于多页应用程序
- 一个页面对应一个打包入口
- 公共部分单独提取

#### 动态导入
- 按需加载，需要用到某个模块时，再加载这个模块
- 可以极大地节省带宽和流量
- 无需配置任何地方，只需要按照 ESM 动态导入的方式去导入模块，webpack 内部会自动处理分包和按需加载
- 使用单页应用开发框架（React/Vue），在项目中的路由映射组件就可以通过动态导入实现按需加载

#### Webpack 魔法注释
- 使用魔法注释可以为动态导入最终打包出来的文件命名
- 命名相同的模块最终会被打包到一起

#### Webpack 输出文件名 Hash
- 一般我们部署前端资源文件时，都会采用服务器的静态资源缓存
- 开启缓存的问题：缓存时间过短-效果不明显，缓存过期时间较长-应用发生了更新重新部署后客户端因为缓存得不到更新
- 解决上面问题，建议生产模式下，文件名使用 Hash，文件名不同也就是新的请求，解决了缓存的问题，服务器可以将缓存过期时间设置足够长

三种 Hash 方式
- hash: 整个项目级别的，项目中任意一个地方改动，重新打包之后的 hash 值都会改变
- chunkhash: chunk 级别的，同一路的打包 chunkhash 都是相同的
- contenthash: 文件级别的hash，根据文件内容生成的hash值，不同的文件就有不同的值

解决缓存问题的最佳 hash 方式 [contenthash:8]

## 三.rollup

### Rollup 概述

- Rollup 与 Webpack作用类似
- Rollup 更为小巧
- 仅仅是一款 ESM 打包器
- Rollup 中并不支持类似 HMR 这种高级特性
- Rollup 的初衷是提供一个充分利用 ESM 各项特性的高效打包器

### Rollup 快速上手

```bash
# 安装依赖
yarn add rollup --dev

# 指定打包的入口文件、打包输出格式、输出结果路径，执行打包
yarn rollup ./src/index.js --format iife --file dist/bundle.js
```

### Rollup 配置文件
- 在项目根目录创建 rollup.config.js

```javascript
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  }
}
```

- 执行命令 `yarn rollup --config` 完成打包，也可以在命令最后跟上文件名

### Rollup 使用插件
- 想加载其他类型的资源模块
- 想导入 CommonJS 模块、编译 ECMAScript 新特性
- Rollup 支持使用插件的方式扩展，插件是 Rollup 唯一扩展途径
- rollup-plugin-json 加载 json 文件的插件
- rollup-plugin-node-resolve 加载 npm 模块的插件
- rollup-plugin-commonjs 加载 CommonJS 模块

### Rollup 代码拆分
使用 Dynamic Imports 动态导入实现模块按需加载，实现代码拆分/分包

rollup.config.js 修改为：
```javascript
export default {
  input: 'src/index.js',
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife'
    dir: 'dist',
    format: 'amd'
  } 
}
```

### Rollup 多入口打包
- 将 rollup.config.js 文件中的 input 改为一个数组 或者 对象
- 对于以 amd 格式输出的文件，不能直接引入到页面上，需要配合 Require.js 这样的库使用

### Rollup VS Webpack 选用原则

优点：
- 输出结果更加扁平
- 自动移除未引用的代码
- 打包结果依然完全可读

缺点：
- 加载非 ESM 的第三方模块比较复杂
- 模块最终都被打包到一个函数中，无法实现 HMR
- 浏览器环境中，代码拆分功能依赖 AMD

选用原则：
- 如果我们正在开发应用程序 => webpack
- 如果我们正在开发框架或者类库 => rollup
- 大多数知名框架 / 库都在使用 rollup
- 社区中希望二者共存，webpack 大而全，rollup 小而美

## 四.规范化标准

### 规范化标准介绍

规范化是我们践行前端工程化中重要的一部分

为什么要有规范会标准？
- 软件开发需要多人协同
- 不同开发者具有不同的编码习惯和喜好
- 不同的喜好会增加项目的维护成本
- 每个项目或者团队需要明确统一的标准

哪里需要规范化标准？
- 代码、文档、甚至是提交日志
- 开发过程中人为编写的成果物
- 代码标准化规范最为重要

实施规范化的方法
- 编码前人为的标准约定
- 通过工具实现 Lint

常见的规范化实现方式
- ESLint 工具使用
- 定制 ESLint 校验规则
- ESLint 对 TypeScript 的支持
- ESLint 结合自动化工具或者 Webpack
- 基于 ESLint 的衍生工具
- StyleLint 工具的使用

### ESLint 介绍

- 最为主流的 JavaScript Lint 工具，检测 JS 代码质量
- ESLint 很容易统一开发者的编码风格
- ESLint 可以帮助开发者提升编码能力

### ESLint 快速上手

- 初始化项目，安装 ESLint 模块为开发依赖 `npm install eslint -D`
- 编写“问题”代码，使用 eslint 执行检测 `npx eslint ./01-prepare.js` 加上参数 `--fix` 可以自动修复格式问题
- 当代码中存在语法错误时，eslint 没法检查问题代码
- 完成 eslint 使用配置

### 结合自动化工具

- 集成之后，ESLint 一定会工作
- 与项目统一，管理更加方便
- 结合 gulp 使用，通过 `.pipe(plugins.eslint())` 让其工作

### ESLint 结合 Webpack

- Webpack 可以通过 loader 机制实现 eslint 的检测工作
- 安装 eslint eslint-loader 
- 在 webpack.config.js 文件配置 eslint-loader 应用在 .js 文件中
- 安装相关插件，如：eslint-plugin-react
- 修改 .eslintrc.js 的配置

### ESLint 检查 TypeScript
- 初始化项目
- 安装 eslint typescript
- 初始化 .eslintrc.js 配置文件，注意当询问 use TypeScript ? 是要选择 yes
- 执行 `npx eslint .\index.ts`

### Stylelint 认识
- 提供默认的代码检查规则
- 提供 CLI 工具，快速调用
- 通过插件支持 Sass Less PostCSS
- 支持 Gulp 或 Webpack 集成

快速上手
- 安装 stylelint `npm i stylelint -D`
- 安装 standard 插件 `npm i stylelint-config-standard -D`
- 创建 .stylelintrc.js 配置文件，并修改 extends 字段
```javascript
module.exports = {
    extends: 'stylelint-config-standard'
}
```
- 执行 `npx stylelint ./index.css`，加上参数 `--fix` 可以自动修复部分格式问题
- 检查 sass 文件，执行 `npm i stylelint-config-sass-guidelines -D`，修改 .stylelintrc.js 文件中的 extends 为数组，添加 sass 插件

### Prettier 的使用

- Prettier 几乎可以完成所有类型文件的格式化工作
- 安装， `npm i prettier -D`
- 检查某个文件并输出检查结果，`npx prettier style.css`
- 检查并格式化某个文件，`npx prettier style.css --write`
- 检查并格式化项目所有文件，`npx prettier . --write`

### ESLint 结合 Git Hooks

Git Hooks
- 代码提交至仓库之前未执行 lint 工作
- 使用 lint 的目的就是保证提交到仓库的代码是没有问题的
- 通过 Git Hooks 在代码提交前强制 lint
- Git Hooks 也称为 git 钩子，每个钩子都对应一个任务
- 通过 shell 脚本可以编写钩子任务触发时要具体执行的操作

快速上手
- 很多前端开发者并不擅长使用 shell
- Husky 可以实现 Git Hooks 的使用需求 `npm i husky -D`，然后在 package.json 中添加如下配置 
```javascript
    "husky": {
        "hooks": {
            "pre-commit": "npm run lint"
        }
    }
```
- 配合 lint-stage 使用，`npm i lint-staged -D`
```javascript
    "lint-staged": {
        "*.js*": [
            "eslint",
            "git add"
        ]
    }
```
