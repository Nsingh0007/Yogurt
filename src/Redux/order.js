import Store from './store';
import {GetOrderStatus} from '../Api';

const FETCH_ORDER_REQEUST = 'FETCH_ORDER_REQEUST';
const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS';
const FETCH_ORDER_ERROR = 'FETCH_ORDER_ERROR';

const actionFetchOrderRequest = () => {
  return {
    type: FETCH_ORDER_REQEUST,
  };
};
const actionFetchOrderSuccess = payload => {
  return {
    type: FETCH_ORDER_SUCCESS,
    payload,
  };
};

const actionFetchOrderError = error => {
  return {
    type: FETCH_ORDER_ERROR,
  };
};

const initialState = {
  orders: [],
  success: false,
  loading: true,
  error: false,
};

const orderReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_ORDER_REQEUST:
      return {
        ...state,
        success: false,
        loading: true,
        error: false,
      };
    case FETCH_ORDER_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        orders: payload,
      };
    case FETCH_ORDER_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const fetchOrderRequest = async () => {
  try {
    Store.dispatch(actionFetchOrderRequest());
    let OrderResponse = await GetOrderStatus();
    if (OrderResponse.result === true) {
      Store.dispatch(actionFetchOrderSuccess(OrderResponse.response));
      return Promise.resolve(OrderResponse.response);
    } else {
      throw new Error('ERROR_GETORDERREQUEST');
    }
  } catch (error) {
    Store.dispatch(actionFetchOrderError());
    return Promise.reject(error);
  }
};

export default orderReducer;
