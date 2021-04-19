import Store from './store';
import { GetOrderStatus } from '../Api';

export class ORDER_ACTIONS {
    static FETCH_ORDER_REQEUST = 'FETCH_ORDER_REQEUST';
    static FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS';
    static FETCH_ORDER_ERROR = 'FETCH_ORDER_ERROR';
}
class OrderActionCreators {
    actionFetchOrderRequest = () => {
        return {
            type: ORDER_ACTIONS.FETCH_ORDER_REQEUST,
        }
    }
    actionFetchOrderSuccess = (payload) => {
        return {
            type: ORDER_ACTIONS.FETCH_ORDER_SUCCESS,
            payload
        }
    }

    actionFetchOrderError = (error) => {
        return {
            type: ORDER_ACTIONS.FETCH_ORDER_ERROR,
        }
    }
}
class OrderStore extends OrderActionCreators {
    store;
    initialState;
    constructor() {
        super();
        this.store = Store;
        this.initialState = {
            orders: [],
            success: false,
            loading: true,
            error: false
        }
    }
    orderReducer = (state = this.initialState, action) => {
        const { type, payload } = action;
        switch (type) {
            case ORDER_ACTIONS.FETCH_ORDER_REQEUST:
                return {
                    ...state,
                    success: false,
                    loading: true,
                    error: false
                };
            case ORDER_ACTIONS.FETCH_ORDER_SUCCESS:
                return {
                    ...state,
                    success: true,
                    loading: false,
                    orders: payload
                };
            case ORDER_ACTIONS.FETCH_ORDER_ERROR:
                return {
                    ...state,
                    loading: false,
                    error: true
                };
            default:
                return state;
        }
    }
    fetchOrderRequest = async () => {
        try {
            Store.dispatch(this.actionFetchOrderRequest());
            let OrderResponse = await GetOrderStatus();
            if (OrderResponse.result === true) {
                Store.dispatch(this.actionFetchOrderSuccess(OrderResponse.response));
                return Promise.resolve(OrderResponse.response);
            } else {
                throw new Error('ERROR_GETSLIDEBYUSER');
            }
        }
        catch (error) {
            Store.dispatch(this.actionFetchOrderError());
            return Promise.reject(error);
        }
    }
}

export default new OrderStore();
