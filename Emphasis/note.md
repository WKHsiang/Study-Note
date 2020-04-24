本文档整理较为重要 & 难懂的知识点

## JS

1. Array.prototype.slice.call(a) & [].slice.call(a)
- a是类数组，它会调用Array.prototype上的slice方法，将该类数组转化为真正的数组

2. Object.defineProperty(obj, 'objName', {
    get() {
    
    },
    set(val) {

    }
   })
- obj：要定义属性的对象
- objName：要定义或修改的属性的名称 或 Symbol
- {...}：要定义或修改的属性描述符

3. Object.create()
- 用于创建一个新对象，使用现有的对象（括号内）来提供新创建的对象的__proto__，就是将括号内的对象变成新创建的对象的__proto__

## ES6

1. Array.from()
- 该方法用于将两类对象转化为真正的数组：类似数组的对象(属性名为数字或数字的字符串形式，同时具有length属性)和可遍历的对象
- Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组
```javascript
Array.from(arrayLike, x => x * x)
// 等同于
Array.from(arrayLike).map(x=> x * x)
```
