import Store from './store';
import {FeaturePageByUser} from '../Api';

export class FEATURE_ACTIONS {
    static FETCH_FEATURE_REQEUST = 'FETCH_FEATURE_REQEUST';
    static FETCH_FEATURE_SUCCESS = 'FETCH_FEATURE_SUCCESS';
    static FETCH_FEATURE_ERROR = 'FETCH_FEATURE_ERROR';
}
class FeatureActionCreators {
    actionFetchFeatureRequest = () => {
        return {
            type: FEATURE_ACTIONS.FETCH_FEATURE_REQEUST,
        }
    }
    actionFetchFeatureSuccess = (payload) => {
        return {
            type: FEATURE_ACTIONS.FETCH_FEATURE_SUCCESS,
            payload
        }
    }

    actionFetchFeatureError = (error) => {
        return {
            type: FEATURE_ACTIONS.FETCH_FEATURE_ERROR,
        }
    }
}
class FeatureStore extends FeatureActionCreators {
    store;
    initialState;
    constructor() {
        super();
        this.store = Store;
        this.initialState = {
            features: [],
            success: false,
            loading: true,
            error: false
        }
    }
    featureReducer = (state = this.initialState, action) => {
        const { type, payload } = action;
        switch (type) {
            case FEATURE_ACTIONS.FETCH_FEATURE_REQEUST:
                return {
                    ...state,
                    features: [],
                    success: false,
                    loading: true,
                    error: false
                };
            case FEATURE_ACTIONS.FETCH_FEATURE_SUCCESS:
                return {
                    ...state,
                    success: true,
                    loading: false,
                    features: payload
                };
            case FEATURE_ACTIONS.FETCH_FEATURE_ERROR:
                return {
                    ...state,
                    loading: false,
                    error: true
                };
            default:
                return state;
        }
    }
    fetchFeaturesRequest = () => async (dispatch) => {
        dispatch(this.actionFetchFeatureRequest());
        let FeatureResponse = await FeaturePageByUser();
        if (FeatureResponse.result === true) {
            return dispatch(this.actionFetchFeatureSuccess(FeatureResponse.response));
        } else {
            dispatch(this.actionFetchFeatureError());
        }
    }
}

export default new FeatureStore();