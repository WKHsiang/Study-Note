// function myMap(fn) {
//     let self = this // this为调用者
//     let resultArr = []
//     for (let s of self) {
//         resultArr.push(fn(s))
//     }
//     return resultArr
// }

// Array.prototype.myMap = myMap

// let arr = [1, 2, 3, 4, 5]

// let result = arr.myMap(item => item * 2)
// console.log(result)


// function myEvery(array, fn) {
//     for (let a of array) {
//         if (!fn(a)) {
//             return false
//         }
//     }
//     return true
// }
// console.log(myEvery([1, 2, 3, 4], item > 8))

// function mySome(array, fn) {
//     for (let a of array) {
//         if (fn(a)) {
//             return true
//         }
//     }
//     return false
// }
// let someResult = mySome([1, 2, 3, 4], item => item > 7)
// console.log(someResult)

// var a = []
// for(var i = 0; i < 10; i++) {
//     a[i] = function() {
//         console.log(i)
//     }
// }
// a[6]()

// var tmp = 123
// if(true) {
//     console.log(tmp)
//     let tmp
// }

// var arr = [23, 45, 1, 34, 67,32]

// console.log(Math.min(...arr))

// var a= 10
// var obj = {
//     a: 20,
//     fn() {
//         setTimeout(() => {
//             console.log(this.a)
//         })
//     }
// }
// obj.fn()
// setTimeout使用了箭头函数，箭头函数中没有this，所以谁调用fn方法，this就指向谁，obj调用fn的时候，setTimeout中的this.a就是obj.a，即20

// Symbol用途
// 私有化变量

// (function(){
//     var x = y = 1
// })()

// console.log(y)
// console.log(x)

// let show = () => {
//     console.log(this)
// }
// let obj = { show }
// obj.show()
// obj.otherShow = show.bind(obj)
// obj.otherShow()
// let newObj = new obj.otherShow()

// 观察者模式
class Subject {
    constructor() {
        this.Observers = []
    }

    add(observer) {
        this.Observers.push(observer)
    }
    remove(observer) {
        this.Observers.filter(item => item === observer)
    }
    notify() {
        this.Observers.forEach(item => {
            item.update()
        })
    }
}

class Observer {
    constructor(name) {
        this.name = name
    }
    update() {
        console.log(this.name)
    }
}

// 发布订阅模式
let pubsub = (() => {
    let topics = {}
    function subscribe(topic, fn) {
        if (!topics[topic]) {
            topics[topic] = []
        }
        topics[topic].push(fn)
    }

    function publisher(topic, ...arg) {
        if (!topics[topic]) return
        for (let fn of topics[topic]) {
            fn(...arg)
        }
    }
    return { subscribe, publisher }
})()

// ----------------------------------------
const xhr = XMLHttpRequest()

xhr.open(method, url, async)

xhr.send(data)

xhr.onreadystatechange = () => {
    if (xhr.readyStatus === 4) {
        if (xhr.status == 200) {
            console.log(xhr.responseText)
        }
    }
}