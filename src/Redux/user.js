import AsyncStorage from '@react-native-community/async-storage';
import {GetCustomer} from '@api';
import {getMessageData,resetInboxOnLogout} from './inbox';

const USER_ALREADY_LOGIN_PROCESS = 'USER_ALREADY_LOGIN_PROCESS';
const USER_ALREADY_LOGIN_SUCCESS = 'USER_ALREADY_LOGIN_SUCCESS';
const USER_ALREADY_LOGIN_FAIL = 'USER_ALREADY_LOGIN_FAIL';
const UPDATE_USER_ON_SIGNUP = 'UPDATE_USER_ON_SIGNUP';

const USER_lOGOUT_SUCCESS = 'USER_lOGOUT_SUCCESS';

const UPDATE_USER_ON_EDIT = 'UPDATE_USER_ON_EDIT';

const userInitialState = {
  isUserLoggedIn: null,
  authToken: null,
  userDetails: {},
  loading: true,
};

const userAlreadyLoginProcess = () => {
  return {
    type: USER_ALREADY_LOGIN_PROCESS,
  };
};
const userAlreadyLoginFail = () => {
  return {
    type: USER_ALREADY_LOGIN_FAIL,
  };
};

const updateuserOnSignup = (payload) => {
  return {
    type: UPDATE_USER_ON_SIGNUP,
    payload,
  };
};
const updateUserOnEditAction = (payload) => {
  return {
    type: UPDATE_USER_ON_EDIT,
    payload,
  };
};
const userAlreadyLoginSuccess = (access_token, payload) => {
  return {
    type: USER_ALREADY_LOGIN_SUCCESS,
    access_token,
    payload,
  };
};

export const userLogoutSucess = () => {
  //resetInboxOnLogout();
  return {
    type: USER_lOGOUT_SUCCESS,
  };
};
const userReducer = (initialState = userInitialState, action) => {
  const {type} = action;

  switch (type) {
    case USER_ALREADY_LOGIN_PROCESS:
      return {
        isUserLoggedIn: null,
        authToken: null,
        userDetails: {},
        loading: true,
      };

    case USER_ALREADY_LOGIN_FAIL:
      return {
        isUserLoggedIn: false,
        authToken: null,
        userDetails: {},
        loading: false,
      };
    case USER_ALREADY_LOGIN_SUCCESS:
      return {
        isUserLoggedIn: true,
        authToken: action.access_token,
        userDetails: action.payload,
        loading: false,
      };
    case UPDATE_USER_ON_SIGNUP:
      return {
        isUserLoggedIn: true,
        authToken: action.payload.access_token,
        userDetails: action.payload,
        loading: false,
      };

    case UPDATE_USER_ON_EDIT:
      //console.log('update user on edit reducer - ', action.payload);
      return {
        ...initialState,
        userDetails: action.payload,
      };
    case USER_lOGOUT_SUCCESS:
      return {
        isUserLoggedIn: false,
        authToken: null,
        userDetails: {},
        loading: false,
      };
    default:
      return initialState;
  }
};

export const validateIsUserLoggedIn = () => async (dispatch) => {
  dispatch(userAlreadyLoginProcess());

  const validateUserLoggedIn = await AsyncStorage.getItem('userLoggedIn');
  if (
    validateUserLoggedIn != undefined &&
    validateUserLoggedIn != null &&
    validateUserLoggedIn === 'true'
  ) {
    const userLogginData = await GetCustomer();
    if (userLogginData.result) {
      dispatch(
        userAlreadyLoginSuccess(
          userLogginData.Authorization,
          userLogginData.response,
        ),
      );

      setTimeout(() => {
        dispatch(getMessageData());
      }, 2000);
    } else {
      //console.log('user logged in but token expire');
      dispatch(userAlreadyLoginFail());
    }
  } else {
    //console.log('User is not logged in');
    dispatch(userAlreadyLoginFail());
  }
};

export const updateUserTree = (payload) => async (dispatch) => {
  await AsyncStorage.setItem('userLoggedIn', 'true');
  await AsyncStorage.setItem('userLoggedInToken', payload.access_token);

  dispatch(updateuserOnSignup(payload));

  setTimeout(() => {
    dispatch(getMessageData());
  }, 2000);
};

export const updateUserOnEdit = () => async (dispatch) => {
  const userLogginData = await GetCustomer();
  if (userLogginData.result) {
    dispatch(updateUserOnEditAction(userLogginData.response));
  }
};

export default userReducer;
