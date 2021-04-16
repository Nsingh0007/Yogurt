
const initialState = {
    count: 0
}
const TestReducer = (state = initialState, action) => {

    switch(action.type) {
        case 'COUNT_INC': return {
            ...state,
            count: state.count + 1
        }
        default: return state;
    }
}

export default TestReducer;