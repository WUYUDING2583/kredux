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