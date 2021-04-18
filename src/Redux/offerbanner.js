import Store from './store';
import { GetSliderByUser } from '../Api';

export class BANNER_ACTIONS {
    static FETCH_BANNER_REQEUST = 'FETCH_BANNER_REQEUST';
    static FETCH_BANNER_SUCCESS = 'FETCH_BANNER_SUCCESS';
    static FETCH_BANNER_ERROR = 'FETCH_BANNER_ERROR';
}
class BannerActionCreators {
    actionFetchBannerRequest = () => {
        return {
            type: BANNER_ACTIONS.FETCH_BANNER_REQEUST,
        }
    }
    actionFetchBannerSuccess = (payload) => {
        return {
            type: BANNER_ACTIONS.FETCH_BANNER_SUCCESS,
            payload
        }
    }

    actionFetchBannerError = (error) => {
        return {
            type: BANNER_ACTIONS.FETCH_BANNER_ERROR,
        }
    }
}
class BannerStore extends BannerActionCreators {
    store;
    initialState;
    constructor() {
        super();
        this.store = Store;
        this.initialState = {
            banners: [],
            success: false,
            loading: true,
            error: false
        }
    }
    bannerReducer = (state = this.initialState, action) => {
        const { type, payload } = action;
        switch (type) {
            case BANNER_ACTIONS.FETCH_BANNER_REQEUST:
                return {
                    ...state,
                    success: false,
                    loading: true,
                    error: false
                };
            case BANNER_ACTIONS.FETCH_BANNER_SUCCESS:
                return {
                    ...state,
                    success: true,
                    loading: false,
                    banners: payload
                };
            case BANNER_ACTIONS.FETCH_BANNER_ERROR:
                return {
                    ...state,
                    loading: false,
                    error: true
                };
            default:
                return state;
        }
    }
    fetchBannerRequest = async () => {
        try {
            Store.dispatch(this.actionFetchBannerRequest());
            let BannerResponse = await GetSliderByUser();
            if (BannerResponse.result === true) {
                Store.dispatch(this.actionFetchBannerSuccess(BannerResponse.response));
                return Promise.resolve(BannerResponse.response);
            } else {
                throw new Error('ERROR_GETSLIDEBYUSER');
            }
        }
        catch (error) {
            Store.dispatch(this.actionFetchBannerError());
            return Promise.reject(error);
        }
    }
}

export default new BannerStore();