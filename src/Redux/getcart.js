import { getCartDetails } from '@api';

const FETCH_CART_REQUEST = "FETCH_CART_REQUEST";
const FETCH_CART_SUCCESS = "FETCH_CART_SUCCESS";
const FETCH_CART_ERROR = "FETCH_CART_ERROR";

const initialCartData = {
    loading: false,
    error: false,
    cartData: []
}

export const getCartReducer = (state = initialCartData, action) => {
    const {
        type,
        data
    } = action;
    switch (type) {
        case FETCH_CART_REQUEST: return {
            ...state, loading: true, error: false
        }
        case FETCH_CART_SUCCESS: return {
            ...state, loading: false, error: false, cartData: data
        }
        case FETCH_CART_ERROR: return {
            ...state, loading: false, error: true
        }
        default: return state;
    }
}


export const fetchCartDataAsyncCreator = () => async (dispatch) => {
    dispatch({ type: FETCH_CART_REQUEST, data: [] });

    const cartDataResponse = await getCartDetails();
    if (cartDataResponse.result) {
        dispatch({ type: FETCH_CART_SUCCESS, data: cartDataResponse.response });
    } else {
        dispatch({ type: FETCH_CART_ERROR, data: [] });
    }
}