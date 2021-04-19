import { GetOrderStatus } from '@api';

const FETCH_ORDER_REQUEST = 'FETCH_ORDER_REQUEST';
const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS';
const FETCH_ORDER_ERROR = 'FETCH_ORDER_ERROR';

const initialCartData = {
  loading: false,
  error: false,
  OrderData: [],
};

export const getOrderReducer = (state = initialCartData, action) => {
  const {type, data} = action;
  switch (type) {
    case FETCH_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case FETCH_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        OrderData: data,
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

export const fetchOrderDataAsyncCreator = () => async dispatch => {
  dispatch({type: FETCH_ORDER_REQUEST, data: []});

  const GetAllOrderResponse = await GetOrderStatus();
  if (GetAllOrderResponse.result === true) {
    // let orderData = [];
    // var AllOrderData = GetPreviousOrderResponse.response;
    // previousOrderData.map((singlePrevOrder, index) => {
    //   if (singlePrevOrder.Status === 'Order Completed') {
    //     orderData.push(singlePrevOrder);
    //   }
    // });
    dispatch({type: FETCH_ORDER_SUCCESS, data: GetAllOrderResponse.response});
  } else {
    dispatch({type: FETCH_ORDER_ERROR, data: []});
  }
};
