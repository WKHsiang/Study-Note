### 1. Vue 3.0介绍

#### 一、Vue.js 3.0 源码组织方式

**1. Vue.js 3.0变化**

- 源码组织方式的变化

    - 源码采用TypeScript重写

    - 使用 Monorepo管理项目结构

- CompositionAPl

    - Vue.js 3.0新增的一组 API

    - —组基于函数的 API

    - 可以更灵活的组织组件的逻辑

- 性能提升

- Vite

**2. packages目录结构**

- packages
    - compiler-core/ --- 独立发行的包，和平台无关的编译器

    - compiler-dom/ --- 独立发行的包，浏览器平台的编译器，依赖于compiler-core

    - compiler-sfc/ --- 独立发行的包，用来编译单文件组件，依赖于compiler-core和compiler-dom

    - compiler-ssr/ --- 独立发行的包，服务端渲染的编译器，依赖于compiler-dom

    - reactivity/ --- 数据响应式系统，可以独立使用

    - runtime-core/ --- 编译相关的代码，和平台无关的运行时

    - runtime-dom/ --- 编译相关的代码，正对浏览器的运行时，处理原生dom的api，事件等

    - runtime-test/ --- 编译相关的代码，专门为测试编写的轻量级运行时，渲染出来为一个js对象，所以可以运行在所有的运行环境中，可以用它测试渲染是否正确，可以用于序列化dom和触发dom事件，以及记录某次更新中的dom操作

    - server-randerer/ --- 用于服务端渲染

    - shared/ --- vue内部使用的一些公关的api


    - size-check/ --- 私有的包，不会发布到npm，作用是在tree-shaking后检查包的大小

    - template-explorer/ --- 在浏览器中运行的实时编译组件，会输出render函数，函数内部的readme中提供在线访问的地址

    - vue/ --- 构建完整版的vue，依赖于compiler和runtime

    - global.d.ts

#### 二、不同的构建版本

**cjs    ---    完整版的vue，包含运行时和编译器**

    - vue.cjs.js    ---    开发版，代码没有被压缩
    
    - vue.cjs.prod.js    ---    生产版，代码被压缩

**global    ----    以下版本都可以在浏览器中通过script标签导入，导入后会增加一个vue的全局对象**

- vue.global.js    ---    完整版的vue，包含编译器和运行时，开发版，代码没有被压缩

- vue.global.prod.js    ---    完整版的vue，包含编译器和运行时，生产版，代码被压缩

- vue.runtime.global.js    ---    只包含运行时的构建版本，开发版，代码没有被压缩

- vue.runtime.global.prod.js    ---    只包含运行时的构建版本，生产版，代码被压缩

**browser    ----    都包含esm（ESmodule），在浏览器中可以直接通过script标签中type=modules来导入模块**

- vue.esm-browser.js    ---    完整版的esm，开发版

- vue.esm-browser.prod.js    ---    完整版的esm，生产版

- vue.runtime.esm-browser.js    ---    运行时版，开发版

- vue.runtime.esm-browser.prod.js    ---    运行时版，生产版

**bundler    ----    需要配合打包工具使用**

- vue.esm-bundler.js    ---    完整版，内容导入了runtime和compiler，也就是编译器

- vue.runtime.esm-bundler.js    ---    只导入了运行时，vue的最小版本，在项目完毕，重新打包的时候，只会打包使用到的代码，可以让vue的体积更小

#### 三、Composition API设计动机

**Options API**

- 包含一个描述组件选项(data、methods、props等)的对象

- Options APIl开发复杂组件，同一个功能逻辑的代码被拆分到不同选项

**Composition APl**

- Vue.js 3.0新增的一组 API

- —组基于函数的 API

- 可以更灵活的组织组件的逻辑

#### 四、性能提升

**响应式系统升级**

- Vue.js 2.x中响应式系统的核心defineProperty

- Vue.js 3.0中使用Proxy对象重写响应式系统

    - 可以监听动态新增的属性
    
    - 可以监听删除的属性
    
    - 可以监听数组的索引和length属性

**编译优化**

- Vue.js 2.x中通过标记静态根节点，优化diff 的过程

- Vue.js 3.0中标记和提升所有的静态根节点，diff 的时候只需要对比动态节点内容
    
    - Fragments(升级vetur插件)
    
    - 静态提升
    
    - Patch flag
    
    - 缓存事件处理函数

**源码体积的优化**

- Vue.js 3.0中移除了一些不常用的 API

    - 例如:inline-template、filter 等

- Tree-shaking

#### 五、Vite

**ES Module**

- 现代浏览器都支持ES Module (IE不支持)

- 通过下面的方式加载模块

    - ```<script type="module" src="..." ></script>```

- 支持模块的script默认延迟加载

    - 类似于script标签设置defer

    - 在文档解析完成后，触发DOMContentLoaded 事件前执行
    
**Vite**

- Vite在开发模式下不需要打包可以直接运行

- Vue-CLI开发模式下必须对项目打包才可以运行

**优点**

- 快速冷启动

- 按需编译

- 模块热更新

**打包**

- Vite在生产环境下使用Rollup 打包

    - 基于ES Module的方式打包

- Vue-CLI使用Webpack打包

### 2. Composition API

**watch**

- Watch的三个参数
    
    - 第一个参数:要监听的数据
    
    - 是新值和旧值
    
    - 第三个参数:选项对象，deep 和immediate

- Watch的返回值
    
    - 取消监听的函数
    
    - 第二个参数:监听到数据变化后执行的函数，这个函数有两个参数分别

**watchEffect**

- 接收一个函数作为参数，监听函数内响应式数据的变化

- 是watch函数的简化版本，也用来监视数据的变化

### 3. Vue.js 3.0 响应式系统原理

#### 一、响应式系统原理-介绍

- Proxy对象实现属性监听

- 默认监听动态添加的属性

- 默认监听属性的删除操作

- 默认监听数组索引和 length属性

- 可以作为单独的模块使用

- 多层属性嵌套，在访问属性过程中处理下一级属性

#### 二、响应式系统原理-Proxy对象回顾

- set 和 deleteProperty 中需要返回布尔类型的值

    - 在严格模式下，如果返回 false 的话，会出现 Type Error 的异常

- Proxy 和 reflect 中使用 receiver

    - Proxy中receiver：Proxy或者继承Proxy的设置

    - Reflect中 receiver：如果 target 对象设置了 getter，getter 中的 this 指向 receiver

#### 三、响应式系统原理-reactive

- 接收一个参数，判断这参数是否是对象

- 创建拦截器对象handler，设置get/set/deleteProperty

- 返回Proxy对象

#### 四、响应式系统原理-收集依赖

![Image text](./image.png)

**reactive vs ref**

- ref可以把基本数据类型数据，转成响应式对象

- ref返回的对象，重新赋值成对象也是响应式的

- reactive返回的对象，重新赋值丢失响应式

- reactive返回的对象不可以解构


### 4. Vite 实现原理

#### 一、Vite

**概念**

- Vite是一个面向现代浏览器的一个更轻、更快的 Web应用开发工具

- 它基于ECMAScript标准原生模块系统（ES Modules）实现

**Vite项目依赖**

- Vite

- @vue/compiler-sfc

**基础使用**

- vite serve

- vite build

vite serve
![Image text](./image1.png)
vue-cli-service serve
![Image text](./image2.png)

**HMR**

- Vite HMR
    
    - 立即编译当前所修改的文件

- Webpack HMR
    
    - 会自动以这个文件为入口重写build一次，所有的涉及到的依赖也都会被加载一遍

**Build打包**

- vite build

    - Rollup

    - Dynamic import

        - Polyfill

**打包or不打包**

- 使用 Webpack打包的两个原因:
    
    - 浏览器环境并不支持模块化
    
    - 零散的模块文件会产生大量的HTTP请求

**开箱即用**

- TypeScript-内置支持

- less/sass/stylus/postcss-内置支持（需要单独安装)

- JSX

- Web Assembly

**Vite特性**

- 快速冷启动

- 模块热更新

- 按需编译

- 开箱即用

**Vite核心功能**

- 静态Web服务器

- 编译单文件组件
    
    - 拦截浏览器不识别的模块，并处理

- HMR
