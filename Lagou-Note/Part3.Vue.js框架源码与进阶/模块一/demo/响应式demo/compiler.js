class Compiler {
    constructor(options) {
        this.vm = options
        this.el = options.$el
        this.compile(this.el)
    }

    // 编译模板，处理文本节点和元素节点
    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {

            if (this.isTextNode(node)) {
                // 处理文本节点
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                // 处理元素节点
                this.compileElement(node)
            }
            // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    // 编译元素节点，处理指令
    compileElement(node) {
        console.dir('元素节点', node)
    }
    // 编译文本节点，处理插值表达式
    compileText(node) {
        console.dir('文本节点', node)
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])

            // 创建watcher对象，当数据改变更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })

        }
    }
    // 判断元素的属性是否为指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    // 判断节点是否为文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }
    // 判断节点是否为元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}