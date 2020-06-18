const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECT = "reject"
class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject)
    }
    // 定义全局状态、成功之后的值、失败之后的错误信息变量
    status = PENDING;
    value = undefined;
    error = undefined;
    resolve = (value) => {
        // 状态不是pendig的时候，不继续执行
        if (this.status !== PENDING) return
        // 更改状态为成功
        this.status = FULFILLED
        // 保存成功之后的值
        this.value = value
    }
    reject = (error) => {
        // 状态不是pendig的时候，不继续执行
        if (this.status !== PENDING) return
        // 更改状态为失败
        this.status = REJECT
        // 保存失败后的错误信息
        this.error = error
    }

    then(successCallback, errorCallback) {
        if (this.status == FULFILLED) {
            successCallback(this.value)
        } else if (this.status == REJECT) {
            errorCallback(this.error)
        }
    }
}

module.exports = MyPromise