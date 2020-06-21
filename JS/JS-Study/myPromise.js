const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECT = "reject";

class MyPromise {
    constructor(executor) {

        // 定义全局状态、成功之后的值、失败之后的错误信息变量
        // 全局状态
        this.status = PENDING;
        // 成功的值
        this.value = undefined;
        // 失败的值
        this.error = undefined;
        // 成功回调
        this.successCallback = [];
        // 失败回调
        this.errorCallback = [];

        this.resolve = (value) => {
            // 状态不是pendig的时候，不继续执行
            if (this.status !== PENDING) return
            // 更改状态为成功
            this.status = FULFILLED
            // 保存成功之后的值
            this.value = value
            // 异步 成功
            // this.successCallback && this.successCallback(this.value)
            while (this.successCallback.length) {
                this.successCallback.shift()()
            }
        }
        this.reject = (error) => {
            // 状态不是pendig的时候，不继续执行
            if (this.status !== PENDING) return
            // 更改状态为失败
            this.status = REJECT
            // 保存失败后的错误信息
            this.error = error
            // 异步 失败
            // this.errorCallback && this.errorCallback(this.error)
            while (this.errorCallback.length) {
                this.errorCallback.shift()()
            }
        }

        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
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
            return MyPromise.resolve(callback()).then(()=>val)
            // callback()
            // return val
        }, err => {
            return MyPromise.resolve(callback()).then(()=>{ throw err })
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
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (val instanceof MyPromise) {
        // Promise对象
        val.then(reslove, reject)
    } else {
        // 普通值
        resolve(val)
    }
}

module.exports = MyPromise