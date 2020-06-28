# TypeScript

## 1. 类型系统

### 1-1. 强类型、弱类型(类型安全角度)

   - 强类型要求函数实参与形参的类型必须相同，不允许有任意的隐式类型转换
   - 弱类型不限制实参的类型，允许任意的数据类型转换

### 1-2. 静态类型、动态类型(类型检查角度)
    - 动态类型中，变量没有类型，变量中存的值是有类型的；运行阶段才能够明确变量类型，而且变量的类型随时可以改变
    - 静态类型中，一个变量声明时它的类型就是明确的，声明之后，它的类型就不允许再修改

### 1-3. JS类型系统特征

- 弱类型 且 动态类型
    - 优点：灵活多变    缺点：缺失了类型系统的可靠性

### 1-4. 强类型的优势

- 错误可以更早暴露
- 代码更智能，编码更准确
- 重构更牢靠
- 减少不必要的类型判断

## 2. Flow
- JS的类型检查器
```javascript
// 基本类型
const a: string = 'hhhh'
const b: number = Infinity // NaN // 100
const c: boolean = false // true
const d: null = null
const e: void = undefined
const f: symbol = Symbol()
// 数组类型
const arr1: Array<number> = [1, 2, 3]
const arr2: number[] = [1, 2, 3]
// 元组
const arr3: [string, number] = ['hhh', 100]
// 对象类型
const obj1: {a: number, b: string} = {a: 100, b: 'hhh'}
const obj2: {a?: number, b: string} = {b: 'hhh'} // a 为可选

const obj3: {[string]: number} = {}
obj3.key1 = 'value1'
obj3.key2 = 'value2'
// 函数类型
function foo (callback: (string, number) => void) {
    callback('string', 100)
}
foo(function(str, num) {
    // str => string
    // num => number
})
// 特殊类型
const a: 'male' | 'female' = 'male'

type StringOrNumber = string | number
const b: StringOrNumber = 'hhh'
```