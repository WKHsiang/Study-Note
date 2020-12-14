# Vuex 状态管理

## 1、课程目标

- Vue 组件间通信方式回顾

- Vuex 核心概念和基本使用回顾

- 购物车案例

- 模拟实现 Vuex

## 2、组件内的状态管理流程

- 状态管理：

    - state：驱动应用的数据源

    - view：以声明方式将 state 映射到视图

    - actions：响应在 view 上的用户输入导致的状态变化

## 3、组件间通信方式回顾

- 四种通信方式：

    - 父组件给子组件传值

        - 子组件通过 props 接收数据

        - 父组件中给子组件通过相应属性传值

    - 子组件给父组件传值

        - 子组件通过 this.$emit(fn, data)

        - 父组件中给子组件通过 v-on:子组件emit的函数名=父组件函数名

    - 不相关组件传值

        - 通过事件中心 eventbus 触发和注册事件

        ```js      
        import Vue from 'vue'
        export default new Vue()
        ```

        - 触发 eventsbus 中的事件

        ```js
        <template>
            <div>
                <h1>Event Bus Sibling01</h1>
                <div class="number" @click="sub">-</div>
                <input type="text" style="width: 30px; text-align: center" :value="value">
                <div class="number" @click="add">+</div>
            </div>
            </template>

            <script>
            import bus from './eventbus'

            export default {
            props: {
                num: Number
            },
            created () {
                this.value = this.num
            },
            data () {
                return {
                value: -1
                }
            },
            methods: {
                sub () {
                if (this.value > 1) {
                    this.value--
                    bus.$emit('numchange', this.value)
                }
                },
                add () {
                    this.value++
                    bus.$emit('numchange', this.value)
                }
            }
        }
        </script>

        <style>
        .number {
            display: inline-block;
            cursor: pointer;
            width: 20px;
            text-align: center;
        }
        </style>
        ```

        - 注册事件

        ```js
        <template>
            <div>
                <h1>Event Bus Sibling02</h1>

                <div>{{ msg }}</div>
            </div>
            </template>

            <script>
            import bus from './eventbus'
            export default {
            data () {
                return {
                    msg: ''
                }
            },
            created () {
                bus.$on('numchange', (value) => {
                    this.msg = `您选择了${value}件商品`
                })
            }
        }
        </script>

        <style>

        </style>
        ```

        - 通过 ref 获取子组件

            - ref 两个作用

            - 在普通 HTML 标签上使用 ref，获取到的是 DOM
        ```js
        <template>
            <div>
                <h1>ref Child</h1>
                <input ref="input" type="text" v-model="value">
            </div>
            </template>

            <script>
            export default {
            data () {
                return {
                value: ''
                }
            },
            methods: {
                focus () {
                this.$refs.input.focus()
                }
            }
        }
        </script>
        ```

        - 在组件标签上使用 ref，获取到的是组件实例
        
        ```js
        <template>
            <div>
                <h1>ref Parent</h1>

                <child ref="c"></child>
            </div>
        </template>

        <script>
            import child from './04-Child'
            export default {
            components: {
                child
            },
            mounted () {
                this.$refs.c.focus()
                this.$refs.c.value = 'hello input'
            }
        }
        </script>
        ```

## 4、Vuex 回顾

- 什么是 Vuex:

    - Vuex 专门为 Vue.js 设计的状态管理库

    - Vuex 采用集中式的方式存储需要共享的状态

    - Vuex 的作用是进行状态管理，解决复杂组件通信，数据共享

    - Vuex 集成到了 devtools 中，提供了 time-travel 时光旅行历史回滚功能

- 什么情况下使用 Vuex

    - 非必要的情况下不要使用 Vuex

    - 大型的单页应用程序

        - 多个视图依赖于同一状态

        - 来自不同视图的行为需要变更同一状态

## 5、Vuex 核心概念回顾

- Store： 是一个容器，包含着应用中的大部分状态，不能直接改变 store 中的状态，要通过 mutation 的方式改变状态。

- State：是状态，保存在 Store 中，因为 Store 是唯一的，所以 State 也是唯一的，也称为单一状态树。这里的状态是响应式的。
Getter：是 Vuex 中的计算属性，方便从一个属性派生出其他的值。它内部会对计算的属性进行缓存，只有当依赖改变的时候，才会重新进行计算。

- Mutation：状态的变换必须要通过提交 Mutation 来完成。

- Action：和 MuTation 类似，不同的是 Action 可以进行异步的操作，内部改变状态的时候，都需要提交 Mutation。

- Module：当 Store 太过臃肿时，可以将 Store 分成多个模块，每个模块里有 State、Mutation、Action、Getter，甚至是子模块。

## 6、State

- store/index.js 中定义 store

```js
export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  mutations: {},
  actions: {},
  modules: {}
})
```

- App.vue 文件中引入 store

```vue
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <!-- count：{{ count }} <br>
    msg: {{ msg }} -->
    <!-- count：{{ $store.state.count }} <br>
    msg: {{ $store.state.msg }} -->
    count: {{ num }} <br>
    msg: {{ message }}
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    ...mapState({ num: 'count', message: 'msg' })
  }
}
</script>
```

## 7、Getter

- 用法：
```js
export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {},
  actions: {},
  modules: {}
})
```

```vue
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    reverseMsg: {{ reverseMsg }}
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['reverseMsg'])
  }
}
</script>
```

## 8、Mutation

```vue
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <!-- count：{{ count }} <br>
    msg: {{ msg }} -->
    <!-- count：{{ $store.state.count }} <br>
    msg: {{ $store.state.msg }} -->
    count: {{ num }} <br>
    msg: {{ message }}
    <h2>Getter</h2>
    reverseMsg: {{ reverseMsg }}
    <h2>Mutation</h2>
    <!-- <button @click="$store.commit('increate', 2)">Mutation</button> -->
    <button @click="increate(3)">Mutation</button>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    ...mapState({ num: 'count', message: 'msg' }),
    ...mapGetters(['reverseMsg'])
  },
  methods: {
    ...mapMutations(['increate'])
  }
}
</script>
```

```js
export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {},
  modules: {}
})
```

## 9、Action

```vue
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    count: {{ num }} <br>
    <!-- <div @click="$store.dispatch('increateAsync', 5)">Action</div> -->
    <div @click="increateAsync(6)">Action</div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    ...mapState({ num: 'count', message: 'msg' }),
    ...mapGetters(['reverseMsg'])
  },
  methods: {
    ...mapMutations(['increate']),
    ...mapActions(['increateAsync'])
  }
}
</script>
```

```js
export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000)
    }
  },
  modules: {}
})
```

## 10、Module

```js
import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000)
    }
  },
  modules: {
    products,
    cart
  }
})
```

- 在 store 中添加 modules 属性，开启多个子模块，products 中的代码如下：

```js
const state = {
  products: [
    { id: 1, title: 'iPhone 11', price: 8000 },
    { id: 2, title: 'iPhone 12', price: 10000 }
  ]
}
const getters = {}
const mutations = {
  setProducts (state, payload) {
    state.products = payload
  }
}
const actions = {}

export default {
  namespaced: true,  // 开启命名空间
  state,
  getters,
  mutations,
  actions
}
```

- App.vue 中的代码如下：

```vue
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <!-- count：{{ count }} <br>
    msg: {{ msg }} -->
    <!-- count：{{ $store.state.count }} <br>
    msg: {{ $store.state.msg }} -->
    count: {{ num }} <br>
    msg: {{ message }}
    <h2>Getter</h2>
    reverseMsg: {{ reverseMsg }}
    <h2>Mutation</h2>
    <!-- <button @click="$store.commit('increate', 2)">Mutation</button> -->
    <button @click="increate(3)">Mutation</button>
    <!-- <div @click="$store.dispatch('increateAsync', 5)">Action</div> -->
    <div @click="increateAsync(5)">Action</div>

    <h2>Module</h2>
    products: {{ products }} <br>
    <button @click="setProducts([])">Module</button>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    ...mapState({ num: 'count', message: 'msg' }),
    ...mapGetters(['reverseMsg']),
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapMutations(['increate', 'setProducts']),
    ...mapActions(['increateAsync']),
    ...mapMutations('products', ['setProducts'])
  }
}
</script>
```

## 11、Vuex 严格模式

- Vuex 中的状态的更新要通过提交 mutation 来修改，但其实在组件中还可以通过$store.state.msg进行修改，从语法从面来说这是没有问题的，但是这破坏了 Vuex 的约定，如果在组件中直接修改 state，devtools 无法跟踪到这次状态的修改。

- 开启严格模式之后，如果在组件中直接修改 state 会抛出错误，但数据仍被成功修改。

- 如何开启：在 store 中增加一个属性 strict 为 true

```js
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
})
```

- 注意：不要在生产模式下开启严格模式，严格模式会深度检查状态树，检查不合规的状态改变，会影响性能。

- 我们可以在开发模式下开启严格模式，在生产模式中关闭严格模式:

- `strict: process.env.NODE_ENV !== 'production'`

## 12、Vuex插件介绍

- Vuex的插件就是一个函数

- 这个函数接受一个store参数

- 这个参数可以订阅一个函数，让这个函数在所有的mutation结束之后执行。

```js
const myPlugin = store => {
  // 当store初始化后调用
  store.subscribe((mutation, state) => {
    // 每次mutation之后调用
    // mutation的格式为{ type, payload }
  })
}
```

- Store/index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'
Vue.use(Vuex)

const myPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.startsWith('cart/')) {
      window.localStorage.setItem('cart-products', JSON.stringify(state.cart.cartProducts))
    }
  })
}

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    products,
    cart
  },
  plugins: [myPlugin]
})
```

## 13、模拟 Vuex 的实现

```js
let _Vue = null
class Store {
  constructor (options) {
    const {
      state = {},
      getters = {},
      mutations = {},
      actions = {}
    } = options
    this.state = _Vue.observable(state)
    this.getters = Object.create(null)
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](state)
      })
    })
    this._mutations = mutations
    this._actions = actions
  }

  commit (type, payload) {
    this._mutations[type](this.state, payload)
  }

  dispatch (type, payload) {
    this._actions[type](this, payload)
  }
}

function install (Vue) {
  _Vue = Vue
  _Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        _Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default {
  Store,
  install
}
```