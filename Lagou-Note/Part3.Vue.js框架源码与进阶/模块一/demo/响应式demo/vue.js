class Vue {
    constructor(options) {
        console.log(options)
        // 1. 通过属性保存选项的数据 $options  $data  $el
        this.$options = options || {}
        this.$data = options.data
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        // 2. 把data中的成员转换成getter和setter，注入到vue实例中
        this._proxyData(this.$data)
        // 3. 调用observer对象，监听数据变化
        new Observer(this.$data)
        // 4. 调用compiler对象，解析指令和插值表达式
        new Compiler(this)
    }
    _proxyData(data) {
        Object.keys(data).forEach(item => {
            Object.defineProperty(this, item, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[item]
                },
                set(newValue) {
                    if (newValue === data[item]) return
                    data[item] = newValue
                }
            })
        })
    }
}