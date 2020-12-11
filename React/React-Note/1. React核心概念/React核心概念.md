## 1. 组件和组件属性

组件：包含内容、样式和功能的UI单元

### 1-1. 创建一个组件
*特别注意：组件的名称首字母必须大写*

- 函数组件
返回一个React元素

- 类组件
必须继承React.Component

必须提供render函数，用于渲染组件

### 1-2. 组件的属性
- 对于函数组件，属性会作为一个对象的属性，传递给函数的参数
- 对于类组件，属性会作为一个对象的属性，传递给构造函数的参数

注意：组件的属性，应该使用小驼峰命名法

*组件无法改变自身的属性。*

之前学习的React元素，本质上，就是一个组件（内置组件）

React中的哲学：数据属于谁，谁才有权力改动

*React中的数据，自顶而下流动*

## 2. 组件状态

组件状态：组件可以自行维护的数据

组件状态仅在类组件中有效

状态（state），本质上是类组件的一个属性，是一个对象

### 状态初始化
```javascript
import React, { Component } from 'react';

export default class MyClassComp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            left: this.props.number
        }

        this.timer = setInterval(() => {
            // 更改状态
            this.setState({
                left: this.state.left - 1
            })
            if(this.state.left === 0) {
                clearInterval(this.timer)
            }
        }, 1000)
    }

    render() {
        return <h1>{this.state.left}</h1>
    }
}
```

### 状态的变化

不能直接改变状态：因为React无法监控到状态发生了变化

必须使用this.setState({})改变状态

一旦调用了this.setState，会导致当前组件重新渲染

### 组件中的数据

props：该数据是由组件的使用者传递的数据，所有权不属于组件自身，因此组件无法改变该数组
state：该数组是由组件自身创建的，所有权属于组件自身，因此组件有权改变该数据

## 3. 事件
在React中，组件的事件，本质上就是一个属性

按照之前React对组件的约定，由于事件本质上是一个属性，因此也需要使用小驼峰命名法

### 如果没有特殊处理，在事件处理函数中，this指向undefined

1. 使用bind函数，绑定this
2. 使用箭头函数

## 4. 深入认识setState
setState，它对状态的改变，可能是异步的

*`如果改变状态的代码处于某个HTML元素的事件中，则其是异步的，否则是同步`*

如果遇到某个事件中，需要同步调用多次，需要使用函数的方式得到最新状态

最佳实践：

1. 把所有的setState当作是异步的
2. 永远不要信任setState调用之后的状态
3. 如果要使用改变之后的状态，需要使用回调函数（setState的第二个参数）
4. 如果新的状态要根据之前的状态进行运算，使用函数的方式改变状态（setState的第一个函数）

React会对异步的setState进行优化，将多次setState进行合并（将多次状态改变完成后，再统一对state进行改变，然后触发render）

## 5. 生命周期
生命周期：组件从诞生到销毁会经历一系列的过程，该过程就叫做生命周期。React在组件的生命周期中提供了一系列的钩子函数（类似于事件），可以让开发者在函数中注入代码，这些代码会在适当的时候运行。

*生命周期仅存在于类组件中，函数组件每次调用都是重新运行函数，旧的组件即刻被销毁*

### 旧版生命周期

React < 16.0.0

1. constructor
    - 同一个组件对象只会创建一次
    - 不能在第一次挂载到页面之前，调用setState，为了避免问题，构造函数中严禁使用setState
2. componentWillMount
    - 正常情况下，和构造函数一样，它只会运行一次
    - 可以使用setState，但是为了避免bug，不允许使用，因为在某些特殊情况下，该函数可能被调用多次
3. render
    - 返回一个虚拟DOM，会被挂载到虚拟DOM树中，最终渲染到页面的真实DOM中
    - render可能不只运行一次，只要需要重新渲染，就会重新运行
    - 严禁使用setState，因为可能会导致无限递归渲染
4. **componentDidMount**
    - 只会执行一次
    - 可以使用setState
    - 通常情况下，会将网络请求、启动计时器等一开始需要的操作，书写到该函数中

组件进入活跃状态

5. componentWillReceiveProps
    - 即将接收新的属性值
    - 参数为新的属性对象
    - 该函数可能会导致一些bug，所以不推荐使用
6. **shouldComponentUpdate**
    - 指示React是否要重新渲染该组件，通过返回true和false来指定
    - 默认情况下，会直接返回true
7. componentWillUpdate
    - 组件即将被重新渲染
8. componentDidUpdate
    - 往往在该函数中使用dom操作，改变元素
9. **componentWillUnmount**
    - 通常在该函数中销毁一些组件依赖的资源，比如计时器

### 新版生命周期
React >= 16.0.0

React官方认为，某个数据的来源必须是单一的

1. getDerivedStateFromProps
    - 通过参数可以获取新的属性和状态
    - 该函数是静态的
    - 该函数的返回值会覆盖掉组件状态
    - 该函数几乎是没有什么用
2. getSnapshotBeforeUpdate
    - 真实的DOM构建完成，但还未实际渲染到页面中。
    - 在该函数中，通常用于实现一些附加的dom操作
    - 该函数的返回值，会作为componentDidUpdate的第三个参数

### 传递元素内容

如果给自定义组件传递元素内容，则React会将元素内容作为children属性传递过去。