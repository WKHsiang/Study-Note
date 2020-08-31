## 一. Vue.js 基础回顾

### 1-1. 基础结构

- 使用 new Vue({ el: '#app', data: {} })
- 使用 new Vue({ data: {}, render(h) {} }).$mount('#app')

### 1-2. 生命周期
- new Vue() 新建 Vue 实例
- beforeCreate 初始化事件 & 生命周期
- created 初始化注入 & 校验
- 是否指定 “el” 选项和 “template” 选项
- beforeMount
- mounted 创建 vm.$el并用其替换 el
- 当 data 被修改时，触发 beforeUpdate
- 虚拟 DOM 重新渲染并应用更新，触发 updated
- 当调用 vm.$destroy() 函数时，触发 beforeDestroy
- destroyed 解除绑定，销毁子组件以及事件监听器
- 销毁完毕

### 1-3. Vue 语法和概念
- 插值表达式 `{{}}`
- 指令
- 计算属性和侦听器 `computed watch`
- Class 和 Style
- 条件渲染/列表渲染
- 表单输入绑定
- 组件
- 插槽
- 插件
- 混入 mixin
- 深入响应式原理
- 不同构建版本的 Vue
