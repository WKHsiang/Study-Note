function myMap(fn) {
    let self = this // this为调用者
    let resultArr = []
    for (let s of self) {
        resultArr.push(fn(s))
    }
    return resultArr
}

Array.prototype.myMap = myMap

let arr = [1, 2, 3, 4, 5]

let result = arr.myMap(item => item * 2)
console.log(result)


function myEvery(array, fn) {
    for (let a of array) {
        if (!fn(a)) {
            return false
        }
    }
    return true
}
console.log(myEvery([1, 2, 3, 4], item > 8))

function mySome(array, fn) {
    for (let a of array) {
        if (fn(a)) {
            return true
        }
    }
    return false
}
let someResult = mySome([1, 2, 3, 4], item => item > 7)
console.log(someResult)