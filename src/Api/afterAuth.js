import Axios from 'axios';
import { commonHeader, endPoints, APIENDPOINT } from '@constants';
import AsyncStorage from '@react-native-community/async-storage';
import Store from '../Redux/store';

export const HostURL=APIENDPOINT.endPoint


export async function GetSliderByUser() {
  try {
    const GetSlideByUserResponse = await Axios.get(
      endPoints.getSlideByUserAPI,
      {},
      {
        headers: { ...commonHeader },
      },
    );
    if (GetSlideByUserResponse.status === 200) {
      return { result: true, response: GetSlideByUserResponse.data };
    } else {
      return { result: false, error: GetSlideByUserResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function FeaturePageByUser() {
  try {
    const GetFeaturePageResponse = await Axios.get(
      endPoints.featurePageAPI,
      {},
      {
        headers: { ...commonHeader },
      },
    );
    if (GetFeaturePageResponse.status === 200) {
      return { result: true, response: GetFeaturePageResponse.data };
    } else {
      return { result: false, error: GetFeaturePageResponse.data };
    }
  } catch (error) {
    console.log('feature data error----- ', error)
    return { result: false, error };
  }
}

export async function GetCategory() {
  try {
    const GetCategoryRespose = await Axios.get(
      endPoints.getCategoryAPI,
      {},
      {
        headers: { ...commonHeader },
      },
    );
    if (GetCategoryRespose.status === 200) {
      return { result: true, response: GetCategoryRespose.data };
    } else {
      return { result: false, error: GetCategoryRespose.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function GetCategorySize(selectedSubCategoryId) {
  try {
    const GetCategorySizeRespose = await Axios.get(
      endPoints.getCategorySizeAPI(selectedSubCategoryId),
      {},
      {
        headers: { ...commonHeader },
      },
    );
    if (GetCategorySizeRespose.status === 200) {
      return { result: true, response: GetCategorySizeRespose.data };
    } else {
      return { result: false, error: GetCategorySizeRespose.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function GetFlavors() {

  try {
    const GetFlavorsRespose = await Axios.get(
      endPoints.getFlavorAPI,
      {},
      {
        headers: { ...commonHeader },
      },
    );
    if (GetFlavorsRespose.status === 200) {
      return { result: true, response: GetFlavorsRespose.data };
    } else {
      return Promise.reject({ result: false, error: GetFlavorsRespose.data });
    }
  } catch (error) {
    return Promise.reject({ result: false, error });
  }
}

export async function GetToppings() {
  try {
    const GetToppingsRespose = await Axios.get(
      endPoints.getToppingAPI,
      {},
      {
        headers: { ...commonHeader },
      },
    );
    if (GetToppingsRespose.status === 200) {
      return { result: true, response: GetToppingsRespose.data };
    } else {
      return { result: false, error: GetToppingsRespose.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function GetMessage() {
  const currentUserId = Store.getState().userstore.userDetails.CustomerId;
  try {
    const GetMessageReponse = await Axios.get(
      endPoints.getMessageAPI(currentUserId),
      {
        headers: { ...commonHeader },
      },
    );
    if (GetMessageReponse.status === 200) {
      return { result: true, response: GetMessageReponse.data };
    } else {
      return { result: false, error: GetMessageReponse.data };
    }
  } catch (error) {
    console.log('Api error - get Messages ', error);
    return { result: false, error };
  }
}

export async function RemoveAllMessage(body = {}) {
  const currentUserId = Store.getState().userstore.userDetails.CustomerId;
  try {
    const messageDataResetResponse = await Axios.put(
      endPoints.removeAllMessageAPI(currentUserId),
      body,
      {
        headers: { ...commonHeader },
      },
    );
    if (messageDataResetResponse.status === 200) {
      return { result: true, response: messageDataResetResponse.data };
    } else {
      return { result: false, error: messageDataResetResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function UpdateAllMessageStatus(body = {}) {
  const currentUserId = Store.getState().userstore.userDetails.CustomerId;
  try {
    const updateAllMessageStatusResponse = await Axios.put(
      endPoints.updateReadStatusAPI(currentUserId),
      body,
      {
        headers: { ...commonHeader },
      },
    );
    if (updateAllMessageStatusResponse.status === 200) {
      return { result: true, response: updateAllMessageStatusResponse.data };
    } else {
      return { result: false, error: updateAllMessageStatusResponse.data };
    }
  } catch (error) {
    console.log('error in API', error)
    return { result: false, error };
  }
}

export async function RemoveSingleMessage(inboxNumber) {
  try {
    const currentUserId = Store.getState().userstore.userDetails.CustomerId;
    const removeSingleMessageResponse = await Axios.put(
      endPoints.removeMessageAPI(currentUserId,inboxNumber),
      {},
      {
        headers: { ...commonHeader },
      },
    );

    if (removeSingleMessageResponse.status === 200) {
      return { result: true, response: removeSingleMessageResponse.data };
    } else {
      return { result: false, error: removeSingleMessageResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function GetItemPrice() {
  try {
    const getItemPriceResponse = await Axios.get(
      endPoints.getItemPriceAPI,
      {},
      {
        headers: { ...commonHeader },
      },
    );
    if (getItemPriceResponse.status === 200) {
      return { result: true, response: getItemPriceResponse.data };
    } else {
      return { result: false, error: getItemPriceResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function addCart(body, token) {

  try {
    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    const addCartResponse = await Axios.post(
      endPoints.addCartAPI,
      body,
      {
        headers: { ...commonHeader, Authorization: `Bearer ${Authorization}` },
      },
    );
    if (addCartResponse.status === 200) {
      return { result: true, response: addCartResponse.data };
    } else {
      return { result: false, error: addCartResponse.data };
    }
  } catch (error) {
    console.log("add cart API error-------", error)
    return { result: false, error };

  }
}

export async function editCart(body) {
  try {
    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    const editCartResponse = await Axios.put(
      endPoints.editCartAPI,
      body,
      {
        headers: { ...commonHeader, Authorization: `Bearer ${Authorization}` },
      },
    );
    if (editCartResponse.status === 200) {
      return { result: true, response: editCartResponse.data };
    } else {
      return { result: false, error: editCartResponse.data };
    }
  } catch (error) {
    return { result: false, error };

  }
}

export async function getCartDetails() {
  try {
    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    GetCartDetailsResponse = await Axios.get(
      endPoints.getCartAPI,
      {
        headers: { ...commonHeader, Authorization: `Bearer ${Authorization}` },
      },
    );
    if (GetCartDetailsResponse.status === 200) {
      return { result: true, response: GetCartDetailsResponse.data };
    } else {
      return { result: false, error: GetCartDetailsResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function addToken(body = {}) {
  try {
    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    const addTokenResponse = await Axios.put(
      endPoints.addTokenAPI,
      body,
      {
        headers: {...commonHeader, Authorization: `Bearer ${Authorization}`},
      },
    );
    if (addTokenResponse.status === 200) {
      return {result: true, response: addTokenResponse.data};
    } else {
      return {result: false, error: addTokenResponse.data};
    }
  } catch (error) {
    return {result: false, error};
  }
}

export async function postOrder(body, token) {
  try {
    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    const postOrderResponse = await Axios.post(
      endPoints.postOrderAPI,
      body,
      {
        headers: { ...commonHeader, Authorization: `Bearer ${token}` },
      },
    );
    if (postOrderResponse.status === 200) {
      return { result: true, response: postOrderResponse.data };
    } else {
      return { result: false, error: postOrderResponse.data };
    }
  } catch (error) {
    return { result: false, error };

  }
}

export async function deleteCart(cartId) {
  try {
    const deleteCartResponseResponse = await Axios.delete(
      endPoints.deleteCartItemAPI(cartId),
      {
        headers: { ...commonHeader },
      },
    );
    if (deleteCartResponseResponse.status === 200) {
      return { result: true, response: deleteCartResponseResponse.data };
    } else {
      return { result: false, error: deleteCartResponseResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function updateCart(body, token) {
  try {
    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    const updateCartResponse = await Axios.put(
      endPoints.updateCartAPI,
      body,
      {
        headers: { ...commonHeader, Authorization: `Bearer ${token}` },
      },
    );
    if (updateCartResponse.status === 200) {
      return { result: true, response: updateCartResponse.data };
    } else {
      return { result: false, error: updateCartResponse.data };
    }
  } catch (error) {
    return { result: false, error };

  }
}

export async function postGiftCart(body) {
  try {
    const postGiftCartResponse = await Axios.post(
      endPoints.PurchaseGiftCardAPI,
      body,
      {
        headers: { ...commonHeader, },
      },
    );
    if (postGiftCartResponse.status === 200) {
      return { result: true, response: postGiftCartResponse.data };
    } else {
      return { result: false, error: postGiftCartResponse.data };
    }
  } catch (error) {
    return { result: false, error };

  }
}

export async function getFavoritesItemsDetails() {
  try {

    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    GetFavoritesItemsResponse = await Axios.get(
      endPoints.favoriteListAPI,
      {
        headers: { ...commonHeader, Authorization: `Bearer ${Authorization}` },
      },
    );
    if (GetFavoritesItemsResponse.status === 200) {
      return { result: true, response: GetFavoritesItemsResponse.data };
    } else {
      return { result: false, error: GetFavoritesItemsResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function GetCustomerPreviousOrder() {
  try {

    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    GetCustomerPreviousOrderResponse = await Axios.get(
      endPoints.previousListAPI,
      {
        headers: { ...commonHeader, Authorization: `Bearer ${Authorization}` },
      },
    );
    if (GetCustomerPreviousOrderResponse.status === 200) {
      return { result: true, response: GetCustomerPreviousOrderResponse.data };
    } else {
      return { result: false, error: GetCustomerPreviousOrderResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function GetPreviousOrderItemsByNumber(OrderNumber) {
  try {
    GetPreviousOrderItemsByNumberResponse = await Axios.get(
      endPoints.orderListDetailAPI(OrderNumber),
      {
        headers: { ...commonHeader, },
      },
    );
    if (GetPreviousOrderItemsByNumberResponse.status === 200) {
      return { result: true, response: GetPreviousOrderItemsByNumberResponse.data };
    } else {
      return { result: false, error: GetPreviousOrderItemsByNumberResponse.data };
    }
  } catch (error) {
    console.log("Error on previous Order Items Data API ---- ", error)
    return { result: false, error };
  }
}

export async function updateFavoriteItemStatus(cartId) {
  try {
    updateFavoriteItemStatusResponse = await Axios.put(
      endPoints.updateFavoriteStatusAPI(cartId),
      {
        headers: { ...commonHeader, },
      },
    );
    if (updateFavoriteItemStatusResponse.status === 200) {
      return { result: true, response: updateFavoriteItemStatusResponse.data };
    } else {
      return { result: false, error: updateFavoriteItemStatusResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function GetOrderStatus() {
  try {

    const Authorization = await AsyncStorage.getItem('userLoggedInToken');
    GetOrderStatusResponse = await Axios.get(
      endPoints.orderListAPI,
      {
        headers: { ...commonHeader, Authorization: `Bearer ${Authorization}` },
      },
    );
    if (GetOrderStatusResponse.status === 200) {
      return { result: true, response: GetOrderStatusResponse.data };
    } else {
      return { result: false, error: GetOrderStatusResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function GetOrderStatusDetails(OrderNumber) {
  try {
    GetOrderStatusDetailsResponse = await Axios.get(
      endPoints.orderListDetailAPI(OrderNumber),
      {
        headers: { ...commonHeader, },
      },
    );
    if (GetOrderStatusDetailsResponse.status === 200) {
      return { result: true, response: GetOrderStatusDetailsResponse.data };
    } else {
      return { result: false, error: GetOrderStatusDetailsResponse.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}