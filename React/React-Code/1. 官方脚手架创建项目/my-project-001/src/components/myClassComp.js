import React, { Component } from 'react';

export default class MyClassComp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            left: props.number
        }

        this.setInputVal = (e) => {
            this.setState({
                left: e.target.value
            })
        }

        this.timer = setInterval(() => {
            // 更改状态
            // this.setState({
            //     left: this.state.left - 1
            // })
            // if(this.state.left === 0) {
            //     clearInterval(this.timer)
            // }
        }, 1000)
    }

    render() {
    return <><h1>{this.state.left}</h1><input defaultValue={this.state.left} onChange={this.setInputVal} /><p>{this.state.left}</p></ >
    }
}