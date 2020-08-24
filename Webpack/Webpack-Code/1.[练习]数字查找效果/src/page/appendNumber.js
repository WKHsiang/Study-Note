import getRandomColor from '../util/getRandomColor'

let numberWrap = document.getElementById("number-wrap")
let centerWrap = document.getElementById("center-wrap")

export default function appendNumber(n, isPrime) {
    let span = document.createElement("span")
    span.innerText = n
    isPrime && (span.style.color = getRandomColor())
    numberWrap.appendChild(span)

    appendCenterNumber(n, isPrime, span.style.color)
}

function appendCenterNumber(n, isPrime, color) {
    centerWrap.innerText = n
    centerWrap.style.color = isPrime ? color : '#fff'
}