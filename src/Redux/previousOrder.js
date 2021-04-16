import { GetOrderStatus } from '@api';

const FETCH_PREV_REQUEST = 'FETCH_PREV_REQUEST';
const FETCH_PREV_SUCCESS = 'FETCH_PREV_SUCCESS';
const FETCH_PREV_ERROR = 'FETCH_PREV_ERROR';

const initialCartData = {
  loading: false,
  error: false,
  PreviousData: [],
};

export const getPrevReducer = (state = initialCartData, action) => {
  const {type, data} = action;
  switch (type) {
    case FETCH_PREV_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case FETCH_PREV_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        PreviousData: data,
      };
    case FETCH_PREV_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const fetchPrevOrderDataAsyncCreator = () => async dispatch => {
  dispatch({type: FETCH_PREV_REQUEST, data: []});
  console.log('Prev Calling')
  const GetPreviousOrderRespone = await GetOrderStatus();
  if (GetPreviousOrderRespone.result === true) {
    let prevdata = [];
    var previousOrderData = GetPreviousOrderRespone.response;
    previousOrderData.map((singlePrevOrder, index) => {
      if (singlePrevOrder.Status === 'Order Completed') {
        prevdata.push(singlePrevOrder);
      }
    });
    dispatch({type: FETCH_PREV_SUCCESS, data: prevdata});
  } else {
    dispatch({type: FETCH_PREV_ERROR, data: []});
  }
};
