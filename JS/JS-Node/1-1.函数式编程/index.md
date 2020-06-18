# 函数式编程

## 1. 函数式编程优点：

- vue3开始使用函数式编程

- 函数式编程可以抛弃this

- 打包过程中可以更好地利用 tree shaking过滤无用代码

- 方便测试、方便并行处理

## 2. 函数式编程的概念

- 函数式编程(Functional Programming，FP)，FP是编程范式之一，其他编程范式还有面向过程编
程、面向对象编程

    - 面向对象编程的思维方式：把现实世界中的事物抽象成程序世界中的类和对象，通过封装、继承和多态来演示事物事件的联系
    - 函数式编程的思维方式：把现实世界的事物和事物之间的联系抽象到程序世界（对运算过程进行抽象）
        - 程序的本质：根据输入通过某种运算获得相应的输出，程序开发过程中会涉及很多有输入和输出的函数
        - x -> f(联系、映射) -> y, y = f(x)
        - 函数式编程中的函数不是程序中的函数（方法），而是数学中函数即映射关系，例如：`y=sin(x)`,x和y的关系
        - 相同的输入始终要得到相同的输出（纯函数）
        - 函数式编程用来描述数据（函数）之间的映射

## 3. 前置知识回顾

### 3.1 函数式一等公民

### 3.2 高阶函数（Higher-order function）

#### 3.2.1 什么是高阶函数

- 可以把函数作为参数传给递另一个函数
```javascript
// 模拟forEach
 function foreach(array, fn) {
     for(let a of array) {
         fn(a)
     }
 }

 foreach([1,2,3], function(item) {
     console.log(item)

 })
```

```javascript
// 模拟filter
function filter(array, fn) {
     let returnArr = []
     for(let a of array) {
         if(fn(a)) {
             returnArr.push(a)
         }
     }
     return returnArr
 }

// 过滤奇数项
let result = filter([1,2,1,5,6], function(item) {
    return item % 2
})
console.log(result)
```

- 可以把函数作为另一个函数的返回结果
```javascript
function once(fn) {
    let flag = false
    return function() {
        if(!flag) {
            flag = true
            return fn.apply(this, arguments)  // 此处的apply不是为改变this而使用，而是为了获取可能传入的参数
        }
    }
}

let pay = once(function() {
    console.log('我只会被打印一次！')  
})
```

#### 3.2.2 高阶函数的意义
- 抽象可以帮我们屏蔽细节，我们只需要关注目标
- 高阶函数可以用来抽象通用的问题

#### 3.2.3 常用高阶函数
- forEach、map、filter、every、some、find、findIndex、reduce、sort等
```javascript
// 模拟map
function myMap(fn) {
    let self = this // this为调用者
    let resultArr = []
    for (let s of self) {
        resultArr.push(fn(s))
    }
    return resultArr
}

Array.prototype.myMap = myMap

let arr = [1, 2, 3, 4, 5]

let result = arr.myMap(function (item) {
    return item * 2
})
console.log(result)
// 模拟every
function myEvery(array, fn) {
    for(let a of array) {
        if(!fn(a)) {
            return false
        }
    }
    return true
}
let everyResult = myEvery([1, 2, 3, 4], function(item) {
    return item > 2
})
console.log(everyResult)
// 模拟some
function mySome(array, fn) {
    for(let a of array) {
        if(fn(a)) {
            return true
        }
    }
    return false
}
let someResult = mySome([1, 2, 3, 4], function(item) {
    return item > 2
})
console.log(someResult)
```

### 3.3 闭包（Closure）

- 定义：函数和其周围的状态（词法环境）的引用捆绑在一起形成闭包

    - 可以在另一个作用域中调用一个函数的内部函数并访问到该函数的作用域中的成员

- 本质：函数在执行的时候会被放到一个执行栈上，当函数执行完毕之后会从执行栈上移除，但是堆上的作用域成员因为被外部引用不能释放，因此内部函数依然可以访问外部函数的成员

## 4. 纯函数

- 概念：*相同的输入永远会得到相同的输出*，而且没有任何可观察的副作用
    - 纯函数就类似数学中的函数（用来描述输入和输出之间的关系），y=f(x)
- lodash是一个纯函数的功能库，提供了对数组、数字、字符串、函数等操作的一些方法
- 数组的slice和splice分别是：纯函数和不纯的函数
    - slice 返回数组中的指定部分，不会改变原数组
    - splice 对数组进行操作返回该数组，会改变原数组
- 函数式编程不会保留计算中间的结果，所以变量是不可变的（无状态的）
- 可以把一个函数的执行结果交给另一个函数去处理

### 4.1 纯函数的优势
- 由于纯函数相同的输入永远得到相同的输出，所以可以将结果缓存，以便多次输入相同值时可以直接从缓存中获取
    - 使用lodash中的memoize方法将结果保存至缓存中
    ```javascript
    const _ = require("lodash")

    function getArea(r) {
        return Math.PI * r * r
    }
    let getAreaWithMemory = _.memoize(getArea)
    console.log(getAreaWithMemory(3)) // 会执行getArea方法
    console.log(getAreaWithMemory(3)) // 从缓存中取值
    console.log(getAreaWithMemory(3)) // 从缓存中取值

    // 模拟memoize
    function memoize(fn) {
        let cache = {}
        return function() {
            let key = JSON.stringify(arguments)
            cache[key] = cache[key] || fn.apply(fn, arguments)
            return cache[key]
        }
    }
    ```

- 纯函数让测试更加方便

- 并行处理
    - 在多线程环境下并行操作共享的内存数据很可能会出现意外情况
    - 纯函数不需要访问共享的内存数据，所以在并行环境下可以任意运行纯函数（Web Worker）

### 4.2 纯函数的副作用

副作用让一个函数变得不纯，纯函数根据相同的输入返回相同的输出，如果函数依赖与外部的状态就无法保证输出相同，就会带来副作用。

副作用来源：
- 配置文件
- 数据库
- 获取用户的输入
...

所有的外部交互都有可能代理副作用，副作用也是的方法通用性下降不适合扩展和可复用性，同时副作用会给程序中带来安全隐患给程序带来不确定性，但是副作用不可能完全禁止，尽可能控制他们在可控范围内发生。


## 5. 柯里化（Haskell Brooks Curry）

### 5.1 
柯里化是函数式编程的一个过程，在这个过程中我们把一个带有多个参数的函数转换成一系列的嵌套函数，它返回一个新函数，这个新函数期望传入下一个参数。

它不断地返回新函数，直到所有的参数都被使用。参数会一直保持alive，当柯里化函数链中最后一个函数被返回和调用的时候，他们会用于执行。

    - dangdang一个函数有多个参数的时候先传第一部分参数调用它
    - 然后返回一个新的函数接收剩余的参数，返回结果

```javascript
// 普通
function fn(a, b, c) {
    return a * b * c
}
// 柯里化
function fn(a) {
    return (b) => {
        return (c) => {
            return a * b * c
        }
    }
}

function checkAge(min) {
    return function(age) {
        return age >= min
    }
}

let checkAge18 = checkAge(18)
let checkAge20 = checkAge(20)

console.log(checkAge18(20), checkAge20(17))

```

### 5.2 lodash中的柯里化函数

- _.curry(fn)
    - 功能：创建一个函数，该函数接收一个或多个fn的参数，如果fn所需要的参数都被提供则执行fn并返回执行的结果。否则继续返回该函数并等待接收剩余的参数。
    - 参数：需要柯里化的函数
    - 返回值：柯里化后的函数
```javascript
const _ = require("lodash")
function getSum(a, b, c) {
    return a * b * c
}

const curried = _.curry(getSum)

console.log(curried(1, 2, 3))
console.log(curried(1, 2)(3))
console.log(curried(1)(2, 3))


// 柯里化实例
const myMatch = _.curry((reg, str) => {
    return str.match(reg)
})
// 匹配空格
const haveSpace = myMatch(/\s+/g)
// 匹配数字
const haveNumber = myMatch(/\d+/g)

console.log(haveSpace('abcde  f g'), haveNumber('1hhigjg4nh67'))

// -------------------------------------------------------------------

const cFilter = _.curry((arr, fn) => arr.filter(fn))

console.log(cFilter(haveSpace, ['hello world!']))

const findSpace = filter(haveSpace)
console.log(findSpace(['hihhihi jldjscdscd ff'], ['iii i']))
})
```

### 5.3 curry实现原理，模拟之

### 5.4 总结

- 柯里化可以让我们给一个函数传递较少的参数，得到一个已经记住了某些固定参数的新函数
- 这是一种对函数参数的'缓存'
- 让函数变得更灵活，让函数的粒度更小
- 可以把多元函数转换成一元函数，可以组合使用函数产生强大的功能


## 6. 函数组合

### 6.1

- 纯函数和柯里化很容易写出洋葱代码 h(g(f(x)))
    - 获取数组的最后一个元素再转换成大写字母，`_.toUpper(_.first(_.reverse(array)))`
- 函数组合可以让我们把细粒度的函数重新组合生成一个新函数

定义：

- 函数组合（compose）：如果一个函数要经过多个函数处理才能得到最重值，这个时候可以把中间过程的函数合并成一个函数
    - 函数就像是数据的管道，函数组合就是把这些管道连接起来，让数据穿过多个管道形成最终结果
    - 函数组合默认是从右到左执行
```javascript
function compose(f, g) {
    return value => f(g(value))
}

function reverse(arr) {
    return arr.reverse()
}

function first(arr) {
    return arr[0]
}

let last = compose(first, reverse)

console.log(last([1, 2, 3, 1, 6]))
```

### 6.2 lodash中的组合函数

- lodash中组合函数flow() 或 flowRight()，他们都可以组合多个函数

- flow() 是从左到右运行

- flowRight() 是从右到左运行，使用的更多一些

```javascript
const _ = require("lodash")

const reverse = arr => arr.reverse()

const first = arr => arr[0]

const toupper = arr => arr.toUpperCase()

let fn = _.flowRight(toupper, first, reverse)

console.log(fn([1, 3, 6, 2, 8, 'ui']))

```
### 6.3 flowRight实现原理，模拟之

### 6.4 结合律（associativity）
```javascript
let fn = compose(f, g, h)

let associative = compose(compose(f, g), h) == compose(f, compose(g, h))
// true
```

### 6.5 lodash/fp
    - lodash的fp模块提供了实用的对函数式编程友好的方法
    - 提供了不可变 auto-curried iteratee-first data-last 的方法
```javascript
const fp = require('lodash/fp')
const fn = fp.flowRight(fp.join('-'), fp.map(fp.toLower), fp.split(' '))
console.log(fn('NEVER SAY DIE'))
```

## 7. Point Free

**Point Free**我们可以把数据处理的过程定义成与数据无关的合成运算，不需要用到代表数据的那个参数，是要把简单的运算步骤合成到一起，在使用这种模式之前我们需要定义一些辅助的基本运算函数

- 不需要指明处理的数据
- 只需要合成运算过程
- 需要定义一些辅助的基本运算函数
```javascript
// world wild web ==> W. W. W
const fp = require("lodash/fp")

// const firstLetterToUpper = fp.flowRight( fp.join('. '), fp.map(fp.first), fp.map(fp.toUpper), fp.split(' '))
const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.flowRight(fp.first, fp.toUpper)), fp.split(' '))

console.log(firstLetterToUpper("world wild web"))
```

## 8. Functor(函子)

### 8.1 为何要学函子

将副作用控制在可控的范围内

### 8.2 什么是Functor

- 容器：包含值和值的变形关系（这个变形关系就是函数）
- 函子：是一个特殊的容器，通过一个普通的对象来实现，该对象具有map方法，map方法可以运行一个函数对之进行处理（变形关系）
```javascript
// class Container {
//     constructor (value) {
//         this._value = value
//     }

//     map(fn) {
//         return new Container(fn(this._value))
//     }
// }

// new Container(6)
// .map(v => v * 2)
// .map(v => v + 2)

class Container {
    static of (value) {
        return new Container(value)
    }

    constructor (value) {
        this._value = value
    }

    map (fn) {
        return Container.of(fn(this._value))
    }
}
```

### 8.3 MayBe函子
MayBe函子的作用是可以对外部的空值情况做处理（控制副作用在允许的范围）
```javascript
    class MayBe {
        static of(value) {
            return new MayBe(value)
        }
        constructor (value) {
            this._value = value
        }
        map (fn) {
            return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
        }
        isNothing() {
            return this._value === null || this._value === undefined
        }
    }
```

### 8.4 Either函子
- Either两者中的任何一个，类似于if...else...的处理
- 异常会让函数变得不纯，Either函子可以用来做异常处理
```javascript
class Left {
    static of(value) {
        return new Left(value)
    }
    constructor (value) {
        this._value_ = value
    }
    map(fn) {
        return this
    }
}

class Right {
    static of(value) {
        return new Right(value)
    }
    constructor (value) {
        this._value = value
    }
    map (fn) {
        return Right.of(fn(this._value))
    }
}
let l = Left.of(10).map(x => x + 4)
let r = Right.of(10).map(x => x + 4)
console.log(l, r)

// 测试
function parseJSON(str) {
    try {
        return Right.of(JSON.parse(str))
    } catch (e) {
        return Left.of({error: e.message})
    }
}
let r = parseJSON('{name: KHsiang}').map(x => x.name.toUpperCase())
console.log(r)
```

### 8.5 IO函子
- IO函子中的_value是一个函数，这里是把函数作为值来处理
- IO函子可以把不纯的动作存储到_value中，延迟执行这个不纯的操作（惰性执行），包装当前的操作
- 把不纯的操作交给调用者来处理
```javascript
const fp = require("lodash/fp")
class IO {
    static of(value) {
        return new IO(function() {
            return value
        })
    }
    constructor(fn) {
        this._value = fn
    }
    map(fn) {
        return new IO(fp.flowRight(fn, this._value))
    }
}
```

### 8.6 Folktale

Task异步执行
- 异步任务的实现过于复杂，我们使用folktale中的Task来演示
- folktale：一个标准的函数式编程库
    - 和lodash、ramda不同的是，他没有提供很多功能函数
    -只提供了一些函数式处理的操作。例如：compose、curry等，一些函子 Task、Either、MayBe等
