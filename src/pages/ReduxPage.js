import React, { Component } from "react";
import store from "../store";

class ReduxPage extends Component {

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    add = () => {
        store.dispatch({ type: "ADD", payload: 1 });
    }

    asyAdd=()=>{
        store.dispatch(({getState,dispatch})=>{
            setTimeout(() => {
                dispatch({type:"ADD",payload:10})
            }, 1000);
        })
    }

    promiseMinus=()=>{
        store.dispatch(Promise.resolve({type:"MINUS",payload:10}));
       
    }

    minus2 = () => {
        store.dispatch({ type: "MINUS2", payload: 100 });
    }

    render() {
        return (
            <>
                <h3>ReduxPage</h3>
                <div>{store.getState().count}</div>
                <button onClick={this.add}>add</button>
                <button onClick={this.asyAdd}>asy add</button>
                <button onClick={this.promiseMinus}>promiseMinus</button>
                <button onClick={this.minus2}>{store.getState().count2.num}</button>
            </>

        )
    }
}

export default ReduxPage;