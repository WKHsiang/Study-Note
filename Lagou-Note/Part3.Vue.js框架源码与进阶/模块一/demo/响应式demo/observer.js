class Observer {
    constructor(data) {
        this.walk(data)
    }
    // 遍历对象的所有属性
    walk(data) {
        // 1. 判断data是否为对象
        // 2. 遍历data对象的所有属性
        data instanceof Object && Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    // 调用Object.defineProperty方法把属性转化为getter和setter
    defineReactive(obj, key, val) {
        let self = this
        // 如果val是对象，把val内部的属性转换成响应式数据
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                return val
            },
            set(newValue) {
                if (newValue === val) return
                self.walk(newValue)
                val = newValue
                // 发送通知
            }
        })
    }
}