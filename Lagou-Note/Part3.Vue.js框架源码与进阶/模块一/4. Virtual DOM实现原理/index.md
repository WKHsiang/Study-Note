## 四. Virtual DOM 的实现原理

### 4-1. 什么是 Virtual DOM

- Virtual DOM（虚拟 DOM），是由普通的 JS 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM
- 可以使用 Virtual DOM 来描述真实的 DOM

### 4-2. 为什么使用 Virtual DOM

- 手动操作 DOM 比较麻烦，还需要考虑浏览器兼容问题，虽然 jQuery 等库简化了 DOM 操作，但是随着项目的复杂 DOM 操作复杂提升
- 为了简化 DOM 的复杂操作于是出现了各种 MVVM 框架，MVVM 框架解决了视图和状态的同步问题
- 为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是 Virtual DOM 出现了
- Virtual DOM 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟树来描述 DOM，Virtual DOM 内部将弄清楚如何有效(diff)的更新 DOM

### 4-3. 虚拟 DOM 的作用

- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 除了渲染 DOM 外，还可以实现 SSR(Nuxt.js/Next.js)、原生应用(Weex/React Native)、小程序(mpvue/uni-app) 等
- 并不是所有情况使用虚拟DOM都能提升性能，只有在视图比较复杂的情况下，使用虚拟DOM才会提高渲染性能