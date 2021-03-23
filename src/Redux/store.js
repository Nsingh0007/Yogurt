import ReduxThunk from 'redux-thunk';
import RootReducer from './rootReducer';
import {createStore, applyMiddleware} from 'redux';

const Store = createStore(RootReducer, applyMiddleware(ReduxThunk));

export default Store;
