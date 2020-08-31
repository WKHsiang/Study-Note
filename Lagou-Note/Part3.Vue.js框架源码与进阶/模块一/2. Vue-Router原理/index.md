## 二. Vue-Router 原理实现

### 2-1. Hash 模式和 History 模式的区别
- 不管哪种方式，都是客户端路由的实现方式，当路径发生变化不会向服务器发送请求
- 表现形式的区别

    - Hash 模式：https://music.163.com/#/playl...
    - History 模式：https://music.163.com/playlis...

- 原理的区别

    - Hash 模式是基于锚点，以及 onhashchange 事件
    - History 模式是基于 HTML5 中的 History API，history.pushState() IE 10 以后才支持， history.replaceState

### 2-2. History 模式的使用

- History 需要服务器的支持
- 单页应用中，服务端不存在 http://www/testurl.com/login 这样的地址会返回找不到该页面
- 在服务端应该除了静态资源外都返回单页应用的 index.html

**History 模式 - Node.js**
```javascript
/* app.js */
const path = require('path')
// 导入处理 history 模式的模块
const history = require('connect-history-api-fallback')
// 导入 express
const express = require('express')

const app = express()
// 注册处理 history 模式的中间件
app.use(history())
// 处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, '../web')))

// 开启服务器，端口是 3000
app.listen(3000, () => {
  console.log('服务器开启，端口：3000')
})
```

**History 模式 - nginx**

- 从官网下载 nginx 压缩包 http://nginx.org/en/download....
- 把压缩包解压到 c 盘根目录，c:nginx-1.18.0 文件夹
- 打开命令行，切换到目录 c:nginx-1.18.0

nginx 相关命令
```c#
# 启动
start nginx
# 重启
nginx -s reload
# 停止
nginx -s stop
```

nginx.conf 文件
```c#
server {
  # ...
  location / {
    root   html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}
```

### 2-3. VueRouter 实现原理

Hash 模式

- URL 中 # 后面的内容作为路径地址
- 监听 hashchange 事件
- 根据当前路由地址找到对应组件重新渲染

History 模式

- 通过 history.pushState() 方法改变地址栏
- 监听 popstate 事件
- 根据当前路由地址找到对应组件重新渲染

*1.实现一个静态install方法，因为作为插件都必须有这个方法，给Vue.use()去调用；*
*2.可以监听路由变化；*
*3.解析配置的路由，即解析router的配置项routes，能根据路由匹配到对应组件；*
*4.实现两个全局组件router-link和router-view；*

Vue 的构建版本

- 运行时版：不支持 template 模板，需要打包的时候提前编译
- 完整版：包含运行时和编译器，体积比运行时版大 10K 左右，程序运行的时候把模板转换成 render 函数
