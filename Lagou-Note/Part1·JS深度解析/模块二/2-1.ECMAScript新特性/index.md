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
        - getProper