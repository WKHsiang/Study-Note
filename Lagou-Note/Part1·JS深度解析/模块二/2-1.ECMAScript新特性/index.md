# ECMAScript新特性

## 一、ES5 let与块级作用域

- let、const声明的变量只能在块级作用域内生效，即 {} 内 

```javascript
var elements = [{}, {}, {}]
for(var i = 0; i < elements.length; i++) {
    elemets[i].onclick = function() {
        console.log(i)
    }
}
elements[1].onclick()
// -----------------------------------------
var elements = [{}, {}, {}]
for(let i = 0; i < elements.length; i++) {
    elemets[i].onclick = (function(i) {
        return function() {
            console.log(i)
        }
    })(i)
}
elements[1].onclick()
// -----------------------------------------
var elements = [{}, {}, {}]
for(let i = 0; i < elements.length; i++) {
    elemets[i].onclick = function() {
        console.log(i)
    }
}
elements[1].onclick()
```
-const 被定义后不能修改定义变量所指的内存地址

## 二、数组解构
```javascript
const arr = [100, 200, 300]
const [,,c] = arr
```

## 三、带标签的模板字符串
```javascript
const name = 'wang'
const gender = false
function myTagFunc(strings, name, gender) {
    const sex = gender ? 'man' : 'women'
    return strings[0] + strings[1] + sex + strings[2]
}
const result = myTagFunc`hey, ${name} is a ${gender}`
console.log(result)
```
## 四、字符串的扩展方法
- includes() 字符串是否包含
- startWith() 字符串是否以...开始
- endsWith() 字符串是否以...结尾

## 五、对象的扩展方法
- Object.assign 将多个源对象中的属性复制到一个目标对象中
```javascript
    const source1 = {
        a: 123,
        b: 123
    }
    const target = {
        a: 456,
        c: 456
    }
    const result = Object.assign(target, source1)
    console.log(result === target) // true
```

- Object.is 判断两个值是否相等，比===更准确

- `Object.defineProperty vue3.0以前使用该方法来实现数据响应，从而实现双向数据绑定`

ES2015中，使用proxy来为对象设置代理访问器（类似于门卫）
```javascript
const person = {
    name: 'wgx',
    age: 20
}
const personProxy = new Proxy(person, {
    // target要代理的目标对象； property外部访问该属性的属性名
    get(target, property) {
        return property in target ? target[property] : 'default'
    },
    // target要代理的目标对象； property要写入的属性名； value要写入的属性值
    set(target, property, value) {
        if(property === 'age') {
            if(!Number.isInteger(value)) {
                throw new TypeError(`${value} is not an int`)
            }
        }
        target[property] = value
        console.log(target, property, value) // { name: 'wgx', age: 20 } gender true
    }
})

property.gender = true

```

- Proxy 对比 Object.defineProperty

    - Object.defineProperty 只能监视属性的读写
    - Proxy 能够见监视到更多的对象操作
        - get 读取某个属性
        - set 写入某个属性
        - has in 操作
        - deleteProperty delete操作符
        - getPrototypeOf Object.getPrototypeOf()
        - setPrototypeOf Object.setPrototypeOf()
        - isExtensible Object.isExtensible()
        - preventExtensions Object.preventExtensions()
        - getOwnPropertyDescriptor Object.getOwnPropertyDescriptor()
        - defineProperty Object.defineProperty()
        - ownKeys Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()
        - apply 调用一个函数
        - construct 用 new 调用一个函数

    - Proxy 更好的支持数组对象的监视
        ```javascript
        const list = []
        // 使用Proxy监视数组的操作
        const listProxy = new Proxy(list, {
            set(target, property, value) {
                console.log('set', property, value) // set 0 100
                target[property] = value
                return true
            }
        })

        listProxy.push(100)
        ```
    - Proxy是以非侵入的方式监管了对象的读写

- Reflect 统一的对象操作API，它属于一个静态类，不能通过new的方式构建一个新的实例对象

    ```javascript
    const obj = {
        foo: '123',
        bar: '456'
    }
    const proxy = new Proxy(obj, {
        get(target, property) {

            console.log('lol...........')
            return Reflect.get(target, property)
        }
    })
    ```
    - Reflect内部封装了一系列对对象的底层操作
        - Reflect.apply()
            - 对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 Function.prototype.apply() 功能类似
        - Reflect.construct()
            - 对构造函数进行 new 操作，相当于执行 `new target(...args)`
        - Reflect.defineProperty()
            - 和 `Object.defineProperty()` 类似
        - Reflect.deleteProperty()
            -作为函数的delete操作符，相当于执行`delete target[name]`
        - Reflect.get()
            - 获取对象身上某个属性的值，类似于 `target[name]`
        - Reflect.getOwnPropertyDescriptor()
            - 返回指定对象上一个自有属性对应的属性描述符，类似于 `Object.getOwnPropertyDescriptor()`
        - Reflect.getPropertyOf()
            - 返回指定对象的原型，类似于 `Object.getPrototypeOf()`
        - Reflect.has()
            - 判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同
        - Reflect.isExtensible()
            - 类似于 `Object.isExtensible()`，判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）
        - Reflect.ownKeys()
            - 返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 `Object.keys()`, 但不会受enumerable影响)
        - Reflect.preventExtensions()
            - 让一个对象变的不可扩展，类似于 `Object.preventExtensions()`，返回一个Boolean
            ```javascript
            const object1 = {};

            Object.preventExtensions(object1);

            try {
            Object.defineProperty(object1, 'property1', {
                value: 42
            });
            } catch (e) {
            console.log(e);
            // Expected output: TypeError: Cannot define property property1, object is not extensible
            }
            ```
        - Reflect.set()
            - 将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true
        - Reflect.setPropertyOf()
            - 设置一个指定的对象的原型，类似于 `Object.setPrototypeOf()`
        
        *在`arr.forEach()`中，可以使用`arr.some(true)`或 `arr.every(false)`来终止循环*