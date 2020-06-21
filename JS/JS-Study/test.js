const MyPromise = require('./myPromise.js')

// let promise = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("&*&*&*")
//     }, 3000)
//     // throw new Error("executor error")
//     // reject("&*&*&*")
// })

// promise.then(val => {
//     console.log(val, 1)
//     // throw new Error('then error')
//     return '888'
// }, err => {
//     console.log(err)
//     return 1000
// }).then(val=>{
//     console.log(val)
// },err=>{
//     console.log(err.message)
// })

// world wild web ==> W. W. W
const fp = require("lodash/fp")
const { resolve } = require('./myPromise.js')

// const firstLetterToUpper = fp.flowRight( fp.join('. '), fp.map(fp.first), fp.map(fp.toUpper), fp.split(' '))
const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.flowRight(fp.first, fp.toUpper)), fp.split(' '))

console.log(firstLetterToUpper("world wild web"))

class Left {
    static of(value) {
        return new Left(value)
    }
    constructor(value) {
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
    constructor(value) {
        this._value = value
    }
    map(fn) {
        return Right.of(fn(this._value))
    }
}
// let l = Left.of(10).map(x => x + 4)
// let r = Right.of(10).map(x => x + 4)
// console.log(l, r)
function parseJSON(str) {
    try {
        return Right.of(JSON.parse(str))
    } catch (e) {
        return Left.of({ error: e.message })
    }
}
let r = parseJSON('{"name": "KHsiang"}').map(x => x.name.toUpperCase())
console.log(r)

console.log('---------------------------------------------------------------')
console.log('---------------------------------------------------------------')

// let promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         var a = 'hello '
//         resolve(a)
//     }, 1000)
// })
// setTimeout(() => {
//     promise.then(val => {
//         var b = 'lagou '
//         return val + b
//     }, err => {
//         reject(err)
//     }).then(val => {
//         setTimeout(() => {
//             var c = 'I ♥ U'
//             console.log(val + c)
//         }, 1000)
//     })
// }, 2000)

const cars = [
    { name: 'xxxx', hhh: 444, ddd: 222, in_stock: true },
    { name: 'qqqq', hhh: 999, ddd: 444, in_stock: true },
    { name: 'wwww', hhh: 888, ddd: 111, in_stock: true },
    { name: 'eeee', hhh: 222, ddd: 333, in_stock: true },
    { name: 'rrrr', hhh: 442, ddd: 222, in_stock: true },
    { name: 'uuuu', hhh: 111, ddd: 999, in_stock: false },
]

let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
let averageDollarValue = function (cars) {
    let fr = fp.flowRight(_average, fp.map(car => car.dollar_value))
    return fr(cars)
}


const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let maybe = Maybe.of([5, 6, 1])
let ex1 = () => {
    let fr = fp.flowRight(fp.map(fp.add(num)))
    return maybe.map(fr)
}



// const fn = fp.flowRight(fp)



const PEDDING = 'pedding' //等待
const FUFILLED = 'fufilled' //成功
const REJECT = 'reject' //失败

class MyPromise {
    constructor(exeuctor) {
        try {
            exeuctor(this.resolve, this.reject)
        } catch (error) {
            this.reject(error)
        }
    }
    // 全局状态
    status = PEDDING
    //成功之后的值
    value = undefined
    //失败之后的原因
    reason = undefined
    //成功的回调
    // successCallback = undefined  只能处理一个回调函数
    successCallback = []
    //失败的回调
    // failCallback = undefined
    failCallback = []


    //使用箭头函数定义是为了执行方法的时候让this指向MyPromise的实例对象
    resolve = value => {
        // 状态不是pendig的时候，不继续执行
        if (this.status !== PEDDING) return
        // 更改状态为成功
        this.status = FUFILLED
        //保存成功之后的值
        this.value = value
        // 异步 成功
        // this.successCallback && this.successCallback(this.value)
        while (this.successCallback.length) {
            // this.successCallback.shift()(this.value)
            this.successCallback.shift()()
        }
    }

    reject = reason => {
        // 状态不是pendig的时候，不继续执行
        if (this.status !== PEDDING) return
        this.status = REJECT
        // 更改状态为失败
        this.reason = reason
        // 异步 失败
        // this.failCallback && this.failCallback(this.reason)
        while (this.failCallback.length) {
            this.failCallback.shift()()
        }
    }

    then(successCallback, errorCallback) {
        // 当then中不传参数时，将原有的状态返回
        successCallback = successCallback ? successCallback : value => value
        errorCallback = errorCallback ? errorCallback : error => { throw error }
        let promise = new MyPromise((resolve, reject) => {
            if (this.status == FULFILLED) {
                setTimeout(() => {
                    try {
                        // 判断val的值是普通值还是Promise对象
                        // 如果是普通值，直接调用resolve
                        // 如果是promise对象，查看promise对象返回的结果
                        // 再根据promise对象返回的结果，决定调用resolve还是调用reject
                        let val = successCallback(this.value)
                        resolvePromise(promise, val, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.status == REJECT) {
                setTimeout(() => {
                    try {
                        // 判断val的值是普通值还是Promise对象
                        // 如果是普通值，直接调用resolve
                        // 如果是promise对象，查看promise对象返回的结果
                        // 再根据promise对象返回的结果，决定调用resolve还是调用reject
                        let val = errorCallback(this.error)
                        resolvePromise(promise, val, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                }, 0)
            } else {
                // 当前状态为pending，将两个函数存起来
                this.successCallback.push(() => {
                    // successCallback()
                    try {
                        // 判断val的值是普通值还是Promise对象
                        // 如果是普通值，直接调用resolve
                        // 如果是promise对象，查看promise对象返回的结果
                        // 再根据promise对象返回的结果，决定调用resolve还是调用reject
                        let val = successCallback(this.value)
                        resolvePromise(promise, val, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
                this.errorCallback.push(() => {
                    // errorCallback()
                    try {
                        // 判断val的值是普通值还是Promise对象
                        // 如果是普通值，直接调用resolve
                        // 如果是promise对象，查看promise对象返回的结果
                        // 再根据promise对象返回的结果，决定调用resolve还是调用reject
                        let val = errorCallback(this.error)
                        resolvePromise(promise, val, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })

        return promise
    }

    finally(callback) {
        return this.then(val => {
            return MyPromise.resolve(callback()).then(() => val)
            // callback()
            // return val
        }, err => {
            return MyPromise.resolve(callback()).then(() => { throw err })
            // callback()
            // throw err
        })
    }

    catch(errorCallback) {
        return this.then(undefined, errorCallback)
    }

    static all(arr) {
        let result = []
        let index = 0

        return new MyPromise((resolve, reject) => {
            function addData(key, val) {
                result[key] = val
                if (index === arr.length) {
                    resolve(result)
                }
            }

            for (let i = 0; i < arr.length; i++) {
                let current = arr[i]
                if (current instanceof MyPromise) {
                    // Promise对象
                    current.then(val => addData(i, val), err => reject(err))
                } else {
                    // 普通值
                    addData(i, arr[i])
                }
            }
        })
    }

    static resolve(value) {
        // 是promise则返回自身
        if (value instanceof MyPromise) return value
        // 不是promise对象则将其转化为promise对象
        return new MyPromise(resolve => resolve(value))
    }

}

function resolvePromise(promise, val, resolve, reject) {
    // 识别自返回，若是则报错
    if (promise === val) {
        return reject(new TypeError("Chaining cycle detected for promise #<Promise>    "))
    }
    if (val instanceof MyPromise) {
        // Promise对象
        val.then(resolve, reject)
    } else {
        // 普通值
        resolve(val)
    }
}

module.exports = MyPromise