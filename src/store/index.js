import { isFSA } from "flux-standard-action";
import isPromise from "is-promise";
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

export default store;