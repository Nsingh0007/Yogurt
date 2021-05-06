import Store from './store';
import {GetSliderByUser} from '../Api';

const FETCH_BANNER_REQEUST = 'FETCH_BANNER_REQEUST';
const FETCH_BANNER_SUCCESS = 'FETCH_BANNER_SUCCESS';
const FETCH_BANNER_ERROR = 'FETCH_BANNER_ERROR';

const actionFetchBannerRequest = () => {
  return {
    type: FETCH_BANNER_REQEUST,
  };
};

const actionFetchBannerSuccess = payload => {
  return {
    type: FETCH_BANNER_SUCCESS,
    payload,
  };
};

const actionFetchBannerError = error => {
  return {
    type: FETCH_BANNER_ERROR,
  };
};

const initialState = {
  banners: [],
  success: false,
  loading: true,
  error: false,
};

const bannerReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_BANNER_REQEUST:
      return {
        ...state,
        success: false,
        loading: true,
        error: false,
      };
    case FETCH_BANNER_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        banners: payload,
      };
    case FETCH_BANNER_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export const fetchBannerRequest = async () => {
  try {
    Store.dispatch(actionFetchBannerRequest());
    let BannerResponse = await GetSliderByUser();
    if (BannerResponse.result === true) {
      Store.dispatch(actionFetchBannerSuccess(BannerResponse.response));
      return Promise.resolve(BannerResponse.response);
    } else {
      throw new Error('ERROR_GETSLIDEBYUSER');
    }
  } catch (error) {
    Store.dispatch(actionFetchBannerError());
    return Promise.reject(error);
  }
};

export default bannerReducer;
