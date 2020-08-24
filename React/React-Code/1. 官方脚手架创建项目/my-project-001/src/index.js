import React from 'react';
import ReactDOM from 'react-dom';
import MyFuncComp from './components/myFuncComp'
import MyClassComp from './components/myClassComp'


ReactDOM.render(<><MyFuncComp /><MyClassComp number={10} /></>, document.getElementById('root'))

// let srcs = [1, 3, 5]

// let index = 0

// let timer = null

// function render() {
//   ReactDOM.render(<span onMouseEnter={stopSetInterval} onMouseLeave={startSetInterval}>{srcs[index]}</span>, document.getElementById('root'))
// }

// function stopSetInterval() {
//   clearInterval(timer)
// }

// function startSetInterval() {
//   start()
// }

// function start() {
//   stopSetInterval()
//   timer = setInterval(() => {
//     index = (index + 1) % 3
//     render()
//   }, 1000)
// }

// start()
