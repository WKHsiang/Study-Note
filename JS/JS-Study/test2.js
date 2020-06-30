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