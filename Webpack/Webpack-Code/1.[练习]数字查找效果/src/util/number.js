import judgeIsPrime from './isPrime'

export default class NumbersTimer {
    constructor(duration = 500) {
        this.duration = duration
        this.number = 0  // 当前的数字
        this.timer = null
        this.onNumberCreated = null  // 当一个数字产生时，要调用的回调函数
    }
    start() {
        if(this.timer) return
        this.timer = setInterval(() => {
            this.number++
            this.onNumberCreated && this.onNumberCreated(this.number, judgeIsPrime(this.number))
        }, this.duration)
    }
    stop() {
        clearInterval(this.timer)
        this.timer = null
    }
}