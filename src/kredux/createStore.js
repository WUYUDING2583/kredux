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