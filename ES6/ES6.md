### 1. let & const
#### 1-1. 暂时性死区
暂时性死区：在代码块中，使用let、const命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区” (temporal dead zone)
```typescript
function bar(x = y, y = 2) {
    return [x, y]
}
bar()
// 此代码会报错，因为x = y时, y未经声明，如果将x = y 和 y = 2调换位置则不会报错
```

#### 1-2. 块级作用域
为何需要块级作用域？
A: 没有块级作用域的情况下：
- 1. 内层变量可能会覆盖外层变量
```javascript
var tmp = new Date()
function() {
    console.log(tmp)
    if(false) {
        var tmp = 'hello'
    }
}
fn() // if中的tmp会覆盖外层的tmp
```
- 2. 用来计数的循环变量泄露为全局变量
```javascript
var s = 'hello'
for (car i = 0; i < s.length; i++>) {
    console.log(s[i])
}
console.log(i) // 5 此时 i 已泄露成为全局变量
```

**块级作用域的出现，使匿名立即执行函数表达式不再必要了**

#### 1-3. const
- const实际保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单数据类型来说，值就保存在变量指向的那个内存地址，因此等同于变量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的，至于它指向的数据结构是不是可变的，就完全不能控制了。


#### 1-4. ES6声明变量的六种方法：
- var
- function
- let
- const
- import
- class

其中var、function声明的全局变量，会变成顶层对象(浏览器为window，node为global)的属性，let、const、class声明的全局变量，不属于顶层对象的属性




### 2. Array
- Array.from() 用于将两类对象转为真正的数组：类似数组的对象(array-like object) 和 可遍历(iterable)的对象，该方法对应了ES5中的`[].slice.call()`，可以接受第二个参数，用来对每个元素进行处理，将处理后的值放入返回的数组。Array.from()还可以用作将字符串转为数组，然后返回字符串的长度。因为它能够正确地处理各种Unicode字符，可以避免JS将大于\uFFFF的Unicode字符，算作两个字符的bug。

- Array.of() 用于将一组值，转换为数组
    - 参数不小于2个：返回参数组成的新数组
    - 参数个数为1：指定数组的长度为1
    - 参数为0：返回 []

- arr.copyWithin(target, start, end) 在当前数组内部，将指定位置的成员复制到其他位置(会覆盖原有成员)，然后返回当前数组(此方法会修改当前数组)
    - target：从该位置开始替换数据
    - start：从该位置开始读取数据，默认为0
    - end：到该位置前停止读取数据，默认等于数组的长度

- arr.find() 用于找出第一个符合条件的数组成员(找出第一个返回值为true的成员，然后返回该成员)，若没有符合条件的成员，则返回undefined
    - arr.find((value, index, arr)=>{return value > 0}) find方法的回调函数可以接受三个参数，以此为当前的值、当前值的索引和原数组
    -arr.findIndex() 和find方法类似，返回第一个符合条件成员的索引，无符合条件成员时，返回-1
    - arr.find() 和 arr.findIndex() 都可以接受第二个参数，用来绑定回调函数的this，即回调函数中的this指向这个参数。
    - findIndex方法配合Object.is()方法，可以弥补indexOf()的不足
    ```jacascript
    [NaN].indexOf(NaN) //  -1

    [NaN].findIndex(x=> Object.is(NaN, x)) // 0
    ```

- arr.fill() 使用给定值，填充一个数组
    - fill可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置
```javascript
['a', 'b' ,'c'].fill(7) // [7, 7, 7]

new Array(3).fill(7) // [7, 7, 7]
```

- arr.entries() arr.keys() arr.values()

- arr.includes() 判断某个数组是否包含给定的值，该方法的第二个参数表示搜索索引的起始位置，默认为0
    - includes VS indexOf：
        - indexOf有两个缺点，一是不够语义化，要比较是否不等于-1，表达起来不够直观；二是，它内部使用严格相等运算符进行判断，会导致对NaN的误判
        - includes 不存在这种问题，返回 true 或 false

### 3. 对象

#### 连判断运算符
- `?.` 用于读取对象内部某个属性时判断该属性是否存在，左侧的对象为null或undefined时，不再往下运算，返回undefined
```javascript
// 读取message.body.user.firstName
const firstName = message?.body?.user?.firstName
```

#### Null判断运算符
- `??` 类似于 ||，但是只有运算符左侧的值为null或undefined时，才会返回右侧的值。

#### 对象新增方法
- Object.is() 比较两个值是否严格相等，与 === 的行为基本一致，不同之处有两个，一是+0不等于-0，二是NaN等于自身

- Object.assign() 用于对象的合并
    - 只有一个参数（参数为对象），会直接返回该参数
    - 参数不是对象，则会先转成对象，再返回
    - 若将undefined和null作为参数，会报错
    - 如果非对象参数出现在源对象位置(即非首参数)，不会报错
    - 该方法实行的是浅拷贝
    - 处理数组时会将数组当成对象来处理

- Object.getOwnPropertyDescriptior(obj, valueName) 用于获取obj中的valueName属性的描述对象(Descriptor)
```javascript
let obj = {foo, 123}
Object.getOwnPropertyDescriptor(obj, 'foo')
// {
//      value: 123
//      writable: true,
//      enumerable: true,
//      configurable: true
// }
```

- Object.getOwnPropertyDescriptors() 返回某个对象属性的描述对象

- Object.setPropertyOf(obj, prototype) 将prototype设置为obj的原型

#### 4-1.普通符号

符号是ES6新增的一个数据类型，它通过使用函数```Symbol(符号描述)```来创建

```javascript
let syb1 = Symbol()
let syb2 = Symbol(abc)
```
示例：
```typescript
const hero = {
    power: 300,
    hp: 30,
    defence: 10,
    attack() {
        let dmg = this.attcak*this.getRandom(0.7, 1.5)
    },
    // 辅助函数，不愿被外部访问到，此时，就需要将其私有化
    getRandom(min, max) {
        return Math.random()*(max - min) + min
    } 
}
```

符号设计的初衷，是为了给对象设置私有属性

符号具有以下特点：

- 没有字面量
- 使用typeof得到的类型是"symbol"
- **每次调用Symbol函数的到的符号永远不相等，无论符号名是否相同**
    - Symbol括号中的字符串为描述信息，只是方面开发

    ```javascript
    const syb1 = Symbol("随便写的描述信息")
    const syb2 = Symbol("abc")
    console.log(syb1 === syb2) // false  
    ```
- 符号可以做为对象的属性名存在，这种属性称之为符号属性
    - 开发者可以通过精心的设计，让这些属性无法通过常规方式被外界访问
    - 符号属性是不能枚举的，因此在for-in循环中无法读取到符号属性，Object.keys方法也无法读取到符号属性
    - Object.getOwnPropertyNames尽管可以得到所有无法枚举的属性，但是仍然无法读取到符号属性
    - ES6新增 Object.getOwnPropertySymbols 方法，可以读取符号
- 符号无法被隐式转换，因此不能被用于数学运算、字符串拼接会其他隐式转换的场景，但符号可以显示的转换为字符串，通过 String 构造函数进行转换即可， console.log 之所以可以输出符号，是它在内部进行了显式转换

```typescript
const hero = (function() {
    const getRandom = Symbol()

    return {
        power: 300,
        hp: 30,
        defence: 10,
        attack() {
            let dmg = this.attcak*this.[getRandom](0.7, 1.5)
        },
        [getRandom](min, max) {
            return Math.random()*(max - min) + min
        } 
    }
})()
hero.gongji()
hero.getRandom() // 报错
```

#### 4-2.共享符号

根据某个符号名称(符号描述)能够得到同一个符号

```js
Symbol.for("符号名/符号描述")  // 获取共享符号
```

#### 4-3.知名(公共、具名)符号

知名符号是一些具有特殊含义的共享符号，通过 Symbol 的静态属性得到

ES6 延续了 ES5 的思想：减少魔法，暴露内部实现

因此，ES6 用知名符号暴露了某些场景的内部实现

1. Symbol.hasInstance

该符号用于定义构造函数的静态成员，它将影响 instanceof 的判定

```js
obj instanceof A

// 等效于

A[Symbol.hasInstance](obj)
```

2. Symbol.isConcatSpreadable

    该知名符号会影响数组的concat方法

3. Symbol.toPrimitive

    该知名符号会影响类型转换的结果

4. Symbol.toStringTag

该知名符号会影响 Object.prototype.toString 的返回值

#### 5-0.回顾事件循环

JS运行的环境称之为宿主环境

执行栈：call stack，一个数据结构，用于存放各种函数的执行环境，每一个函数执行之前，它的相关信息会加入到执行栈，函数调用之前，创建执行环境，然后加入到执行栈；函数调用之后，销毁执行环境

JS引擎永远执行的是执行栈的最顶部

异步函数：某些函数不会立即执行，需要等到某个时机到达后才会执行，这样的函数称之为异步函数。比如事件处理函数。异步函数的执行时机，会被宿主环境控制。

浏览器宿主环境中包含5个线程：

1. JS引擎：负责执行执行栈的最顶部代码

2. GUI线程：负责渲染页面

3. 事件监听机制：负责监听各种事件

4. 计时线程：负责计时

5. 网络线程：负责网络通信

当上面的线程发生了某些事情，如果该线程发现，这件事情有处理程序，它会将该处理程序加入一个叫做事件队列的内存。当JS引擎发现，执行栈中已经没有了任何内容后，会将事件队列中的第一个函数加入到执行栈中执行。

JS引擎对事件队列的取出执行方式，以及与宿主环境的配合，称之为事件循环。

事件队列在不同的宿主环境中有所差异，大部分宿主环境会将事件队列进行细分。在浏览器中，事件队列分为两种：

- 宏任务(队列)：macroTask，计时器结束的回调、事件回调、http回调等等绝大部分异步函数进入宏队列
- 微任务(队列)：MutationObserver，Promise产生的回调进入微队列

> MutationObserver用于监听DOM发生的变化

当执行栈清空时，JS引擎首先会将微任务中的所有任务依次执行结束，如果没有微任务，则执行宏任务

#### 5-1.事件和回调函数的缺陷

事件：某个对象的属性是一个函数，当发生某一件事时，运行该函数

回调：运行某个函数以实现某个功能的时候，传入一个函数作为参数，当发生某件事的时候，会运行该函数

本质上，事件和回调并没有本质的区别，只是把函数放置的位置不同而已。

目前，该模式主要面临以下两个问题：
1. 回调地狱：某个异步操作需要等待之前的异步操作完成，无论回调还是事件，都会陷入不断的嵌套
2. 异步之间的联系：某个异步操作需要等待多个异步操作的结果，对这种联系的处理，会让代码的复杂度剧增

#### 5-2. 异步处理的通用模型

1. ES6将某一件可能发生的异步操作的事情，分为两个阶段：**unsettled**和**settled**

- unsettled：未决阶段，表示事情还在进行前期的处理，并没有发生通向结果的那件事
- settled：已决阶段，事情已经有了一个结果，不管这个结果是好是坏，整件事情无法逆转

事情总是从 未决阶段 逐步发展到 已决阶段的，并且，未决阶段拥有控制何时通向已决阶段的能力。

2. ES6将事情划分为三种状态：pending、resolved、rejected
- pending：挂起，处于未决阶段，表示这件事情还在挂起
- resolved：已处理，已决阶段的一种状态，表示整件事情已经出现结果，并是一个可以按照正常逻辑进行下去的结果
- rejected：已拒绝，已决阶段的一种状态，表示整件事情已经出现结果，并是一个可以按照正常逻辑进行下去的结果，通常表示一个错误

由于未决阶段有权力决定事情的走向，故，未决阶段可以决定事情最终的状态

我们将 把事情变成resolved状态的过程叫做：resolve，推向改状态时，可能会传递一些数据

我们将把事情变成rejected状态的过程叫做：reject，推向改状态时，同样可能会传递一些数据，通常为错误信息

无论是阶段，还是状态，都是不可逆的

3. 当事情达到已决阶段后，通常需要后续处理，不同的已决状态，决定了不同的后续处理
- resolved状态：这是一个正常的已决状态，后续处理表示为thenable
- rejected状态：这是一个非正常的已决状态，后续处理表示为catchable

后续处理可能有多个，因此会形成作业队列，这些后续处理会按照顺序，当状态达到后依次执行

4. 整件事称之为 Promise

#### 5-3. Promise的基本使用

1. 未决阶段的处理函数是同步的，会立即执行

2. thenable和catchable函数是异步的，就算是立即执行，也会加入到事件队列中
等待执行，并且，加入的队列是微队列

3. pro.then可以只添加thenable函数，pro.catch可以单独添加catcable函数

4. 在未决阶段的处理函数中，如果发生未捕获的错误，会将状态推向rejected，并会被catchable捕获

5. 一旦状态推向了已决阶段，无法再对状态做任何改变

6. **Promise并没有消除回调，只是让回调变得可控**

```typescript
const pro = new Promise((resolve,reject) => {
    // pending
})    
pro.then(data =>{
    // resolved
}, err=>{
    // rejected
})
```

#### 5-4. Promise的串联
当后续的Promise需要用到之前的Promise的处理结果时，就需要Promise的串联

Promise对象中，无论是then方法，还是catch方法，都有返回值，返回值是一个全新的Promise对象，它的状态满足下面的规则：
1. 如果当前的Promise是未决状态，得到的新的Promise是挂起状态
2. 如果当前的Promise是已决状态，会运行响应的后续处理函数，并将后续处理函数的处理结果(返回值)作为resolved状态数据，应用到新的Promise中；如果后续处理函数发生错误，则把返回值作为rejected状态数据，应用到新的Promise中。

**后续的Promise一定会等到前面的Promise有了后续处理结果后，才变成已决状态**

如果前面的Promise的后续处理，返回的是一个Promise，则返回的新的Promise状态和后续处理返回的Promise状态保持一致

#### async

目的是简化在函数返回值中对Promise的创建

async用于修饰函数（无论是函数字面量还是函数表达式），放置在函数最开始的位置，被修饰函数的返回结果一定是Promise对象

#### await

必须出现在被async修饰的函数中

### Fetch Api

**XMLHttpRequest的问题**

1. 所有的功能全部集中在同一个对象上，容易书写出混乱不易维护的代码
2. 采用传统的事件驱动模式，无法适配新的Promise Api

**Fetch Api的特点**
1. 并非取代ajax，而是对ajax传统api的改进
2. 精细的功能分割：头部信息、请求信息、响应信息等均匀分布到不同的对象，更利于处理各种复杂的ajax场景
3. 使用Promise Api，更利于异步代码的书写
4. Fetch Api并非ES6的内容，属于HTML5新增的Web Api
