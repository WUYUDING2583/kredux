English | **简体中文**

kredux是模仿redux编写的简版redux，实现了`createStore`，`applyMiddleware`，`combineReducers`以及简版redux中间件`thunk`和`logger`。

## 用法

### 创建store

```javascript
import { createStore, combineReducers,applyMiddleware } from "../kredux";

function counterReducer(state = 0, { type, payload }) {
    switch (type) {
        case "ADD":
            return state + payload;
        case "MINUS":
            return state - payload;
        default:
            return state;
    }

}

function counterReducer2(state = { num: 0 }, { type, payload }) {
    switch (type) {
        case "ADD2":
            return { num: state.num + payload };
        case "MINUS2":
            return { num: state.num - payload };
        default:
            return state;
    }
}

const store = createStore(
    combineReducers({
        count: counterReducer,
        count2: counterReducer2
    }),
    applyMiddleware(promise,thunk,logger)
);

export default store;
```

### 引入及使用

```javascript
import React, { Component } from "react";
import store from "../store";

class ReduxPage extends Component {
    
    componentDidMount() {
	//订阅store
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        })
    }

    componentWillUnmount() {
        //取消订阅
        this.unsubscribe();
    }

    //直接调用
    add = () => {
        store.dispatch({ type: "ADD", payload: 1 });
    }

    //异步调用
    asyAdd=()=>{
        console.log("store.dispatch",store.dispatch);
        store.dispatch(({getState,dispatch})=>{
            console.log("dispatch",dispatch);
            setTimeout(() => {
                dispatch({type:"ADD",payload:10})
            }, 1000);
        })
    }
    
    //Promise
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
```

## 实现

### 中间件实现

```javascript
import { isFSA } from "flux-standard-action";
import isPromise from "is-promise";

function thunk({ getState, dispatch }) {
    return next => action => {
        if (typeof action === 'function') {
            return action({ getState, dispatch });
        }

        return next(action)
    }
}

function logger({getState}){
    return next=>action=>{
        console.log('====================================');
        console.log("action",action);
        console.log("preState",getState());
        let returnValue=next(action);
        console.log("curState",getState());
        console.log('====================================');
        return returnValue;
    }
}

function promise({dispatch}){
    return next=>action=>{
        if(!isFSA(action)){
            return isPromise(action)?action.then(dispatch):next(action);
        }

        return isPromise(action.payload)?
            action.payload
                .then((result)=>dispatch({...action,payload:result}))
                .catch(err=>{
                    dispatch({...action,payload:err});
                    Promise.reject(err)
                })
            :next(action);
    }
}
```

### createStore

```javascript
export default function createStore(reducer, enhancer) {
    if (enhancer) {
        return enhancer(createStore)(reducer);
    }
    let currentState;
    let currentListener = [];
    function dispatch(action) {
        currentState = reducer(currentState, action);
        currentListener.forEach(listener => listener());
    }

    function getState() {
        return currentState;
    }

    function subscribe(listener) {
        currentListener.push(listener);
        return () => {
            currentListener = currentListener.filter(item => item !== listener);
        }
    }

    dispatch({ type: "&*%#@!(<>?{}|:L:><__+(***&" })

    return {
        dispatch,
        subscribe,
        getState,
    }
}
```

### applyMiddleware

```javascript

function applyMiddleware(...funcs) {
    return createStore=>reducer=>{
        const store=createStore(reducer);
        let dispatch=store.dispatch;
        const midApi={
            getState:store.getState,
            dispatch:(action,...args)=>dispatch(action,...args),
        }
        const middlewareChain=funcs.map(middleware=>middleware(midApi));
        dispatch=compose(middlewareChain)(store.dispatch);
        return {
            ...store,
            dispatch
        }
    }
    
}

function compose(funcs) {
    if(funcs.length===0){
        return args=>args;
    }

    if(funcs.length===1){
        return funcs[0];
    }

    return funcs.reduce((a,b)=>(...args)=>a(b(...args)));
}

export default applyMiddleware;
```

### combineReducer

```javascript
export default function combineReducers(reducers) {
    return (state = {}, action) => {
        let nextState = {};
        let hasChange = false;
        for (let key in reducers) {
            const reducer = reducers[key];
            nextState[key] = reducer(state[key], action);
            hasChange = hasChange || nextState[key] !== state[key];
        }

        hasChange = hasChange || Object.keys(nextState) !== Object.keys(state);
        return hasChange ? nextState : state;
    }
}
```

