//import liraries
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
  Platform,
  Vibration,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect, useDispatch, useSelector} from 'react-redux';
import cross from '../../../../assets/icon/Wrong.png';
import checked from '../../../../assets/icon/checked.png';
import uncheck from '../../../../assets/icon/uncehck.png';
import {getCartDetails, postOrder, deleteCart, updateCart, HostURL} from '@api';
import {createPaymentRequest} from '@api';
import {fetchCartDataAsyncCreator} from '@redux/getcart.js';
import FastImage from 'react-native-fast-image';
import {SQIPCore, SQIPCardEntry} from 'react-native-square-in-app-payments';

// create a component
const Checkout = (props) => {
  const dispatch = useDispatch();
  const [IsPayNow, SetIsPayNow] = useState(true);
  const [paymentId, SetPaymentId] = useState('');
  const [IsPayAtPickup, SetIsPayAtPickup] = useState(false);
  const {userDetails} = useSelector((state)=> state.userstore) 
  const [RouteData, SetRouteData] = useState(
    props.navigation.getParam('param'),
  );


  const onStartCardEntry = async () => {
    await SQIPCore.setSquareApplicationId('sq0idp-FOIi2iZHSgSn12_cbm_8yQ');
    //await SQIPCore.setSquareApplicationId('sandbox-sq0idb-hN_lTR4gIo5VNDdUHo1lEQ');
    if (Platform.OS === 'ios') {
      SQIPCardEntry.setIOSCardEntryTheme({
        saveButtonFont: {
          size: 25,
        },
        saveButtonTitle: 'Pay 💳',
        keyboardAppearance: 'Dark',
        saveButtonTextColor: {
          r: 255,
          g: 0,
          b: 125,
          a: 0.5,
        },
      });
    }
    const cardEntryConfig = {
      collectPostalCode: false,
    };
    try {
      await SQIPCardEntry.startCardEntryFlow(
        cardEntryConfig,
        onCardNonceRequestSuccess,
        onCardEntryCancel,
      );
    } catch (e) {
      console.log('error on Start card entry - ', e);
    }
    console.log('Finish Card Entry');
  };

  const onCardEntryCancel = () => {
    console.log('Card entry Cancel');
    // Handle the cancel callback
  };

  const onCardEntryComplete = async (cardDetails) => {
    console.log('Card entry complete');
    // Update UI to notify user that the payment flow is completed
  };

  const onCardNonceRequestSuccess = async (cardDetails) => {
    try {
      // take payment with the card details
      //await chargeCard(cardDetails);
      let body = {
        amount_money: {
          amount: RouteData.Totalprice * 100,
          currency: 'USD',
        },
        customerid: userDetails.CustomerId,
        source_id: cardDetails.nonce,
      };
      const PaymentResponce = await createPaymentRequest(body);
      //console.log('Payment response ----- ', PaymentResponce.response)
      if (PaymentResponce.result == true) {
        SetPaymentId(PaymentResponce.response.payment.id)
        setTimeout(() => {
          this.postOrderByUser();
        }, 500);
      } else {
        setTimeout(() => {
          Alert.alert('Oops..', `Payment Failed`);
        }, 2000);
      }
      await SQIPCardEntry.completeCardEntry(
        await onCardEntryComplete(cardDetails),
      );
      // payment finished successfully
      // you must call this method to close card entry
    } catch (ex) {
      // payment failed to complete due to error
      // notify card entry to show processing error
      await SQIPCardEntry.showCardNonceProcessingError(ex.message);
      console.log('Card nonce Request fail - ', ex.message);
    }
  };

  const payOption = () => {
    IsPayNow == true
      ? RouteData.Totalprice != 0
        ? payNow()
        : postOrderByUser()
      : IsPayAtPickup == true
      ? postOrderByUser()
      : Alert.alert('Alert', 'please select payment mode');
  };

  const payNow = () => {
    onStartCardEntry();
  };

  const postOrderByUser = async () => {
    let sendBody = [];
    RouteData.userCartData.map((singleCartData) => {
      let body = {};
      let mobileNo = RouteData.pickupNumber.split('-').join('');
      body.CartId = singleCartData.CartIdId;
      body.OrderPrice = RouteData.Totalprice;
      body.IsPayAtPickup = IsPayAtPickup;
      body.PaymentNumber = paymentId;
      body.PickUpName = RouteData.pickupName;
      body.PickUpTime = RouteData.pickupTime;
      body.Mobile = mobileNo;
      //body.Deliverydate = new Date().toISOString()
      body.IsRedeem = singleCartData.IsRedeem;
      sendBody.push(body);
    });

    const postUserOrderRespose = await postOrder(sendBody, RouteData.authToken);
    if (postUserOrderRespose.result === true) {
      setTimeout(() => {
        props.navigation.navigate('OrderPlacedScreen')
      }, 500);
      dispatch(fetchCartDataAsyncCreator());
    } else {
      console.log(
        'getting error on the post order api ------',
        postUserOrderRespose.error,
      );
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', margin: 10}}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <FastImage
              source={cross}
              style={{width: 30, height: 30, margin: 10}}
            />
          </TouchableOpacity>
          <Text style={styles.HeadingText}>Checkout</Text>
        </View>

        <View style={styles.PaymentNowView}>
          <CheckBox
            checked={IsPayNow}
            onPress={() => {
              SetIsPayNow(true);
              SetIsPayAtPickup(false);
            }}
            checkedIcon={
              <FastImage source={checked} style={styles.checkBoxImage} />
            }
            uncheckedIcon={
              <FastImage source={uncheck} style={styles.checkBoxImage} />
            }
          />
          <Text style={styles.PaymentModeText}>Pay Now</Text>
        </View>
        <View style={styles.PaymentPickupView}>
          <CheckBox
            checked={IsPayAtPickup}
            onPress={() => {
              SetIsPayAtPickup(true);
              SetIsPayNow(false);
            }}
            checkedIcon={
              <FastImage source={checked} style={styles.checkBoxImage} />
            }
            uncheckedIcon={
              <FastImage source={uncheck} style={styles.checkBoxImage} />
            }
          />
          <Text style={styles.PaymentModeText}>Pay at pickup</Text>
        </View>

        <View style={styles.amountMainView}>
          <View style={{margin: 10}}>
            <View style={styles.amountView}>
              <Text style={styles.amountHeading}>Subtotal</Text>
              <Text style={styles.amountPrice}>${RouteData.SubTotalprice}</Text>
            </View>
            <View style={styles.BorderLine} />
          </View>

          <View style={{margin: 10}}>
            <View style={styles.amountView}>
              <Text style={styles.amountHeading}>Discount</Text>
              <Text style={styles.amountPrice}>${RouteData.Discount}</Text>
            </View>
            <View style={styles.BorderLine} />
          </View>

          <View style={{margin: 10}}>
            <View style={styles.amountView}>
              <Text style={styles.amountHeading}>Tax Applied</Text>
              <Text style={styles.amountPrice}>{`$${RouteData.Taxprice}`}</Text>
            </View>
            <View style={styles.BorderLine} />
          </View>

          <View style={{margin: 10}}>
            <View style={styles.amountView}>
              <Text style={styles.TotalAmount}>Total</Text>
              <Text style={{fontSize: 22, fontFamily: 'OpenSans-Bold'}}>
                ${RouteData.Totalprice}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.placeOrderView}>
        <TouchableOpacity onPress={() => payOption()} style={styles.placeOrderTouch}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F9F9F9',
    alignSelf: 'center',
  },
  HeadingText: {
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'OpenSans-Bold',
    margin: 10,
  },
  PaymentNowView: {
    marginTop: 20,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginStart: 10,
    width: '90%',
    alignSelf: 'center',
  },
  PaymentPickupView: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginStart: 10,
    width: '90%',
    alignSelf: 'center',
  },
  PaymentModeText: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    marginTop: 12,
  },
  checkBoxImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  amountHeading: {
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    color: '#505755',
  },
  amountPrice: {
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    fontWeight: 'bold',
  },
  TotalAmount: {
    fontSize: 22,
    fontFamily: 'OpenSans-Bold',
  },
  BorderLine: {
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    width: '99%',
  },
  amountView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 0.5,
  },
  amountMainView: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  placeOrderView: {
    position: 'absolute',
    right: 10,
    left: 10,
    right: 20,
    bottom: 30,
  },
  placeOrderTouch: {
    backgroundColor: '#793422',
    borderRadius: 50,
    height: 46,
    width: '43%',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 0,
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'OpenSans-ExtraBold',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});


//make this component available to the app
export default connect()(Checkout);