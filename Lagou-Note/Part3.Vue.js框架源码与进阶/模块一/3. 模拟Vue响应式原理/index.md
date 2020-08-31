## 三. 模拟 Vue.js 响应式原理

### 3-1. 数据驱动

数据响应式、双向绑定、数据驱动

数据响应式

- 数据模型仅仅是普通的 JS 对象，而当我们修改数据时，视图会进行更新，避免了繁琐的DOM操作，提高开发效率

双向绑定

- 数据改变，视图改变；试图改变，数据也随之改变
- 我们可以使用 v-model 在表单元素上创建双向数据绑定

数据驱动

- 数据驱动是 vue 最独特的特性之一
- 开发过程中仅需要关注数据本身，不需要关心数据是如何渲染到视图的

### 3-2. 响应式的核心原理

Vue 2.x

- Object.defineProperty
- 浏览器兼容 IE8 以上（不兼容 IE8）

Vue 3.x

- Proxy
- 直接监听对象，而非属性
- ES6 中新增，IE 不支持，性能由浏览器优化

### 3-3. 发布订阅模式和观察者模式

#### 3-3-1. 发布/订阅模式
- 订阅者
- 发布者
- 信号中心

我们假定，存在一个“信号中心”，某个人物执行完成，就向信号中心“发布”（publish）一个信号，其他任务可以向信号中心“订阅”（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做“发布/订阅模式”（publish-subscribe pattern）

Vue 的自定义事件
```javascript
let vm = new Vue()

vm.$on('dataChange', () => {
  consloe.log('dataChange1')
})

vm.$on('dataChange', () => {
  consloe.log('dataChange2')
})

vm.$emit('dataChange')
```
兄弟组件通信过程
```javascript
// eventBus.js
// 事件中心
let eventHub = new Vue()

// ComponentA.vue
// 发布者
addTodo: function () {
  // 发布消息(事件)
  eventHub.$emit('add-todo', { text: this.newTodoText })
  this.newTodoText = ''
}

// ComponentB.vue
// 订阅者
created: function () {
  // 订阅消息(事件)
  eventHub.$on('add-todo', this.addTodo)
}
```
模拟 Vue 自定义事件的实现
```javascript
class EventEmitter {
  constructor () {
      // { 'click': [fn1, fn2], 'change': [fn] }
      this.subs = Object.create(null)
  }
  $on (eventType, handler) {
      this.subs[eventType] = this.subs[eventType] || []
      this.subs[eventType].push(handler)
  }
  $emit (eventType) {
      if (this.subs[eventType]) {
          this.subs[eventType].forEach(handler => {
              handler()
          })
      }
  }
}
```

#### 3-3-2. 观察者模式
- 观察者（订阅者） -- Watcher

    - update(): 当事件发生时，具体要做的事情

- 目标(发布者) -- Dep

    - subs 数组: 存储所有的观察者
    - addSub(): 添加观察者
    - notify(): 当事件发生时，调用所有观察者的 update() 方法

- 没有事件中心

总结

- **观察者模式**是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的
- **发布/订阅模式**由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在

### 3-4. 模拟Vue响应式原理

#### 3-4-1. 整体分析

- Vue 基本结构
- 打印 Vue 实例观察
- 整体结构
- 把 data 中的成员注入到 Vue 实例，并且把 data 成员转成 getter/setter
- Observer: 能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知 Dep

#### 3-4-2. Vue

- 负责接收初始化的参数
- 负责把 data 中的属性注入到 Vue 实例，转换成 getter/setter
- 负责调用 observer 监听 data 中所有属性的变化
- 负责调用 compiler 解析指令/插值表达式
```js
class Vue {
    constructor(options) {

        // 1. 通过属性保存选项的数据 $options  $data  $el
        this.$options = options || {}
        this.$data = options.data
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

        // 2. 把data中的成员转换成getter和setter，注入到vue实例中
        this._proxyData(this.$data)

        // 3. 调用observer对象，监听数据变化
        // 4. 调用compiler对象，解析指令和插值表达式
    }
    _proxyData(data) {
        // 1. 遍历数据中的所有属性
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this, key, {
                enumerable: true,   // 可枚举
                configurable: true, // 可配置
                get() {
                    return data[key]
                },
                set(newValue) {
                    if(data[key] === newValue) return
                    data[key] = newValue
                }
            })
        })
        // 把data的属性注入到vue实例中
    }
}
```

#### 3-4-3. Observer

- 负责把 data 选项中的属性转换成响应式数据
- data 中的某个属性也是对象，把该属性转换成响应式数据
- 数据变化发送通知

#### 3-4-4. Compiler

- 负责编译模板，解析指令/插值表达式
- 负责页面的首次渲染
- 当数据变化后重新渲染视图

#### 3-4-5. Dep (Dependency)

- 收集依赖，添加观察者（watcher）
- 通知所有观察者

#### 3-4-6. Watcher

- 当数据变化触发依赖，dep 通知所有的 Watcher 实例更新视图
- 自身实例化的时候往 dep 对象中添加自己

### 3-5. 总结

问题

- 给 data 中某个属性重新赋值成对象，是否是响应式的？ --- 是
- 给 Vue 实例新增一个成员是否是响应式的？ --- 否
