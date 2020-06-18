// world wild web ==> W. W. W
const fp = require("lodash/fp")

// const firstLetterToUpper = fp.flowRight( fp.join('. '), fp.map(fp.first), fp.map(fp.toUpper), fp.split(' '))
const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.flowRight(fp.first, fp.toUpper)), fp.split(' '))

console.log(firstLetterToUpper("world wild web"))

class Left {
    static of(value) {
        return new Left(value)
    }
    constructor (value) {
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
        return Left.of({error: e.message})
    }
}
let r = parseJSON('{"name": "KHsiang"}').map(x => x.name.toUpperCase())
console.log(r)