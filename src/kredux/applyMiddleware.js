
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