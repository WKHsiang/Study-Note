import judgeIsPrime from './util/isPrime'
import getRandomColor from './util/getRandomColor'
import NumbersTimer from './util/number'
import appendNumber from './page/appendNumber'

console.log("Hello World", judgeIsPrime(4))

console.log(getRandomColor())

let n = new NumbersTimer(1000)

n.onNumberCreated = function(n, isPrime) {
    appendNumber(n, isPrime)
}

n.start()