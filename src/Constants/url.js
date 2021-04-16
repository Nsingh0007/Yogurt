
const NETWORKINSTANCE = {
    local: 'https://yogurtapp.moreyeahs.in/',
    server: 'http://ec2-54-145-253-240.compute-1.amazonaws.com/', 
    socket: `https://yogurtapp.moreyeahs.in`
}

export const APIENDPOINT = {
    endPoint: NETWORKINSTANCE.local
    //endPoint: NETWORKINSTANCE.server
}
export const SOCKETURL = {
    endPoint: NETWORKINSTANCE.socket
}
export const commonHeader = {
    'Accept': '*/*',
    'Content-Type': 'application/json',
}

export const endPoints = {
    
    createUserAPI: APIENDPOINT.endPoint + 'api/Account/PutRegistrationConsumer',

    loginAPI: APIENDPOINT.endPoint + 'Token',

    forgotPasswordAPI: APIENDPOINT.endPoint + 'api/Account/ForgotPassword',

    getCustomerAPI: APIENDPOINT.endPoint + 'api/Customer/GetCustomerById',

    updateNotificationAPI: APIENDPOINT.endPoint + 'api/Customer/UpdateNotification',

    updateCustomerAPI: APIENDPOINT.endPoint + 'api/Customer/UpdateCustomer',

    addTokenAPI: APIENDPOINT.endPoint + 'api/Customer/AddToken',

    updatePasswordAPI: APIENDPOINT.endPoint + 'api/Account/UpdatePassword',

    paymentRequestAPI: APIENDPOINT.endPoint + 'api/Customer/CreatePaymentRequest',

    getSlideByUserAPI: APIENDPOINT.endPoint + 'api/Slider/GetSliderByUser',

    featurePageAPI: APIENDPOINT.endPoint + 'api/FeaturePage/GetFeaturePageByUser',

    getCategoryAPI: APIENDPOINT.endPoint + 'api/Category/GetCategoryByUser',

    getFlavorAPI: APIENDPOINT.endPoint + 'api/Flavor/GetFlavorByUser',

    getToppingAPI: APIENDPOINT.endPoint + 'api/Topping/GetToppingByUser',

    getItemPriceAPI: APIENDPOINT.endPoint + 'api/ItemPrice/GetItemPriceByType',

    addCartAPI: APIENDPOINT.endPoint + 'api/Cart/AddCart',

    editCartAPI: APIENDPOINT.endPoint + 'api/Cart/UpdateCarts',

    getCartAPI: APIENDPOINT.endPoint + 'api/Cart/GetCart',

    postOrderAPI: APIENDPOINT.endPoint + 'api/OrderMaster/AddCustomerOrder',

    updateCartAPI: APIENDPOINT.endPoint + 'api/Cart/UpdateCart',

    PurchaseGiftCardAPI: APIENDPOINT.endPoint + 'api/GiftCard/PurchaseGiftCard',

    favoriteListAPI: APIENDPOINT.endPoint + 'api/OrderMaster/GetCustomerFavoriteItemList',

    previousListAPI: APIENDPOINT.endPoint + 'api/OrderMaster/GetCustomerPreviousOrderList',

    orderListAPI: APIENDPOINT.endPoint + 'api/OrderMaster/GetCustomerOrderList',

    getCategorySizeAPI: (selectedSubCategoryId) => APIENDPOINT.endPoint + 'api/Size/GetActiveSize?id=' + selectedSubCategoryId,

    getMessageAPI: (currentUserId) => APIENDPOINT.endPoint + 'api/Inbox/GetMessagesByCustId?Id=' + currentUserId,

    removeMessageAPI: (currentUserId, inboxNumber) => APIENDPOINT.endPoint + 'api/Inbox/RemoveMessage?CustId=' + currentUserId + '&InboxNum=' + inboxNumber,

    removeAllMessageAPI: (currentUserId) => APIENDPOINT.endPoint + 'api/Inbox/RemoveMessageByCustomer?CustId=' + currentUserId,

    updateReadStatusAPI: (currentUserId) => APIENDPOINT.endPoint + 'api/Inbox/UpdateReadStatus?CustId=' + currentUserId,

    deleteCartItemAPI: (cartId) => APIENDPOINT.endPoint + 'api/Cart/DeleteCart?id=' + cartId,

    orderListDetailAPI: (OrderNumber) => APIENDPOINT.endPoint + 'api/OrderMaster/GetCustomerOrderListDetail?OrderNum=' + OrderNumber,

    updateFavoriteStatusAPI: (cartId) => APIENDPOINT.endPoint + 'api/OrderMaster/UpdateStatusofFavoriteItem?Id=' + cartId,

}