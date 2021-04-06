import Axios from 'axios';
import { commonHeader, endPoints, APIENDPOINT } from '@constants';
import AsyncStorage from '@react-native-community/async-storage';

export const HostURL=APIENDPOINT.endPoint


export async function createUser(body = {}) {
  try {
    const createUserRegister = await Axios.post(
      endPoints.createUserAPI,
      body,
      {
        headers: { ...commonHeader },
      },
    );
    if (createUserRegister.status === 200) {
      if (createUserRegister.data.flag === true) {
        return { result: true, response: createUserRegister.data };
      }
      else {
        return { result: false, error: createUserRegister.data.Message };
      }
    } else {
      return { result: false, error: createUserRegister.data.Message };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function loginUser(email, password) {
  try {
    const body = `grant_type=password&username=${email}&password=${password}&Role=Consumer&Version=1`;
    const loginUserResponse = await Axios.post(
      endPoints.loginAPI,
      body,
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'text/plain',
        },
      },
    );
    if (loginUserResponse.data.flag) {
      return { result: true, response: loginUserResponse.data };
    } else {
      return { result: false, response: loginUserResponse.data };
    }
  } catch (err) {
    let error = new Error();
    const { data, status } = err.response;
    error.response = err.response;
    if (status == 400 && data.error === 'invalid_grant') {
      error.message = 'Invalid Credentials';
    } else {
      error.message = 'Request Failed';
    }
    throw error;
  }
}

export async function UserForgotPassword(body = {}) {
  try {
    const forgotPasswordResponse = await Axios.post(
      endPoints.forgotPasswordAPI,
      body,
      {
        headers: { ...commonHeader },
      },
    );
    if (forgotPasswordResponse.status === 200) {
      return { result: true, response: forgotPasswordResponse.data };
    } else {
      return { result: false, error: forgotPasswordResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function GetCustomer() {
  try {
    const Authorization = await AsyncStorage.getItem('userLoggedInToken');

    const GetCustomerResponse = await Axios.get(
      endPoints.getCustomerAPI,
      {
        headers: { ...commonHeader, Authorization: `Bearer ${Authorization}` },
      },
    );
    if (GetCustomerResponse.status === 200) {
      return { result: true, response: GetCustomerResponse.data, Authorization };
    } else {
      return { result: false, error: GetCustomerResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function UpdateNotificationData(body) {
  try {
    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    const GetCustomerResponse = await Axios.put(
      endPoints.updateNotificationAPI,
      body,
      {
        headers: { Authorization: `Bearer ${Authorization}` },
      },
    );
    if (GetCustomerResponse.status === 200) {
      return { result: true, response: GetCustomerResponse.data, };
    } else {
      return { result: false, error: GetCustomerResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function UserUpdate(body = {}) {
  try {
    const UserprofileUpdateResponse = await Axios.put(
      endPoints.updateCustomerAPI,
      body,
      {
        headers: { ...commonHeader },
      },
    );
    if (UserprofileUpdateResponse.status === 200) {
      return { result: true, response: UserprofileUpdateResponse.data };
    } else {
      return { result: false, error: UserprofileUpdateResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function createNewPassword(body = {}) {
  try {
    const createNewPasswordResponse = await Axios.put(
      endPoints.updatePasswordAPI,
      body,
      {
        headers: { ...commonHeader },
      },
    );
    if (createNewPasswordResponse.status === 200) {
      if (createNewPasswordResponse.data.flag === true) {
        return { result: true, response: createNewPasswordResponse.data };
      } else {
        return { result: false, error: createNewPasswordResponse.data }
      }
    } else {
      return { result: false, error: createNewPasswordResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function createPaymentRequest(body) {
  try {
    const createPayment = await Axios.post(
      endPoints.paymentRequestAPI,
      body,
      {
        headers: {...commonHeader, Authorization: `Bearer EAAAEOJnJzWuHPusXJBvZC-V0DqjqKjRVdETumcgxaiUhSzUic9Sr7DzznlJhxPL`}
      },
    );
    if (createPayment.data.payment.status != 'FAILED') {
      return { result: true, response: createPayment.data };
    } else {
      return { result: false, error: createPayment.data };
    }
  } catch (error) {
    console.log('create Payment response API error - ', error)
    return { result: false, error };
  }
}
