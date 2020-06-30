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
// Mixed类型 Any类型 所有类型的联合类型 string | number | boolean | ...
function passMixed (value: mixed) {}
passMixed('string')
passMixed(100)
//------------------------------------------------------------
function passMixed (value: any) {}
passMixed('string')
passMixed(100)

// 两者差异： any 弱类型    mixed 强类型
// 所有类型网址  https://flow.org/en/docs/types/        
// https://www.saltycrane.com/cheat-sheets/flow-type/latest/
```

## 3. TypeScript
- JS的超集（superset）
```typescript
// 基本类型
const a: string = 'hhhh'
const b: number = Infinity // NaN // 100
const c: boolean = false // true
const d: null = null
const e: void = undefined
const f: symbol = Symbol()
// Object 不单指普通的对象，而是包括了数组、对象
const foo: object = function() {} // [] // {}
// 数组类型
const arr1: Array<number> = [1, 2, 3]
const arr2: number[] = [1, 2, 3]
// 元组
const arr3: [string, number] = ['hhh', 100]
// 枚举类型
enum PostStatus {
    Draft = 5,
    Unpublished,
    published
}
const post = {
    title: '...',
    status: PostDtatus.published
}
// 函数类型
function func (a: number, b?: string, ...rest: number[]): string {
    return 'hhh'
}
func(1, 2)
// 类型断言
const nums = [1, 2, 3, 4]
const res = nums.find(i => i > 0) // ts无法判断res一定为number，它认为res为 number | undefined
const num1 = res as number  // 推荐使用
const num2 = <number>res    // JSX下不能使用
```
*显示中文错误提示：`tsc --locale zh-CN`*

### 3-1. 接口 Interfaces
用于约束一个对象的结构
```typescript
interface Post {
    title: string
    content: string
    subtitle?: string         // 可选
    readonly summary: string  // 只读
}

function printPost (post: Post) {
    console.log(post.title)
    console.log(post.content)
}

printPost({
    title: "标题",
    content: "内容"
})
// -----------------------------------------------------------
interface Cache {
    [prop: string]: string  // 限定 k 和 v 都是string类型
}

const cache: Cache = {}

cache.foo = "hhh"
// -----------------------------------------------------------
// 类
class Person {
    public name: string // 公有属性
    private age: number // 私有属性
    protected gender: string // 受保护的 只能在 自身 及 其子类 中访问
    constructor(name: string, age: number) {
        this.name = name
        this.age = age
        this.gender = '男'
    }
}

class Student extends Person {
    private constructor(name: string, age: number) {
        super(name, age)
        console.log(this.gender)
    }

    static create (name: string, age: number) {
        return new Student(name, age)
    }
}

const student = Student.create('hhh', 18)
// -----------------------------------------------------------
// 类和接口
interface Eat {
    eat(food: string): void
}

interface Run {
    run(distance: number): void
}

class People implements Eat, Run {
    eat(food: string): void {
        console.log(`吃${food}`)
    }
    run(distance: number): void {
        console.log(distance)
    }
}

class Animal implements Eat, Run {
    eat(food: string): void {
        console.log(`舔着吃${food}`)
    }
    run(distance: number): void {
        console.log(distance)
    }
}

// -----------------------------------------------------------
// 抽象类
abstract class Aniamls {
    eat(food: string): void {
        console.log(`吃${food}`)
    }
    abstract run(distance: number): void
}
class Dog extends Aniamls {
    run(distance: number): void {
        console.log(`Dog自身的${distance}`)
    }
}
const dog = new Dog()
dog.eat('骨头')
dog.run(100)
// -----------------------------------------------------------
// 泛型
function createArray<T>(length: number, value: T): T[] {
    const arr = Array<T>(length).fill(value)
    return arr
}
```