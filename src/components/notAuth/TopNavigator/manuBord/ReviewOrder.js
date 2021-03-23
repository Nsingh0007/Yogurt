import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Platform,
  Vibration,
  Image,
} from 'react-native';
import leftArrow from '../../../../assets/icon/order/leftArrow.png';
import snow from '../../../../assets/icon/order/snow.png';
import Spinner from 'react-native-loading-spinner-overlay';
import Heart_Like from '../../../../assets/icon/order/Heart_Like.png';
import Heart_Like1 from '../../../../assets/icon/order/heart.png';
import Add_Item from '../../../../assets/icon/order/Add_Item.png';
import Minus_Item from '../../../../assets/icon/order/Minus_Item.png';
import EmptyCart from '../../../../assets/icon/order/EmptyCart.png';
import {connect} from 'react-redux';
import {getCartDetails, deleteCart, updateCart, HostURL} from '@api';
import {fetchCartDataAsyncCreator} from '@redux/getcart.js';
import {navigateTabRef} from '@navigation/refs';
import FastImage from 'react-native-fast-image';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dimensions} from 'react-native';

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

const FloatBorderWidth = Platform.select({
  ios: 0.5,
  android: 0,
});

TextInput.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

class ReviewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Model_Visibility: false,
      Alert_Visibility: false,
      userCartData: [],
      userDetails: {},
      dateArray: [],
      spinner: true,
      authToken: '',
      SubTotalprice: 0,
      Discount: 0,
      Totalprice: 0,
      Taxprice: 0,
      cartId: 0,
      Quantity: 1,
      deleteCartValue: {},
      IsPayAtPickup: false,
      IsPayNow: true,
      IsFavourite: false,
      collapsed: false,
      Is5hourOrder: false,
      country: '',
      pickupName: '',
      pickupNumber: '',
      pickupTime: 'Pickup Time',
      paymentId: '',
    };
  }

  Show_Custom_AlertForTime(visible) {
    this.showTimeSlot();
    this.setState({Model_Visibility: visible});
  }

  Hide_Custom_AlertForTime() {
    this.setState({Model_Visibility: false});
  }

  Show_Custom_Alert(visible) {
    const {
      pickupName,
      pickupNumber,
      pickupTime,
      SubTotalprice,
      Totalprice,
      Discount,
      Taxprice,
      userCartData,
      authToken,
    } = this.state;
    let date = new Date();
    let mobileNo = pickupNumber.split('-').join('');
    if (pickupTime == 'Pickup Time') {
      Alert.alert('Warning', 'Please select your pick up time');
    } else if (pickupName == '') {
      Alert.alert('Warning', 'Please enter pick up name');
    } else if (pickupNumber == '') {
      Alert.alert('Warning', 'Please enter pick up number');
    } else if (mobileNo.length < 10) {
      Alert.alert('Warning', 'Please enter correct pick up number');
    } else {
      this.props.navigation.navigate('CheckoutScreen', {
        param: {
          pickupName,
          pickupNumber,
          pickupTime,
          SubTotalprice,
          Totalprice,
          Discount,
          Taxprice,
          userCartData,
          authToken,
        },
      });
      //this.setState({Alert_Visibility: visible});
    }
  }

  Hide_Custom_Alert() {
    this.setState({Alert_Visibility: false});
  }

  toggleExpanded = () => {
    //Toggling the state of single Collapsible
    this.setState({collapsed: !this.state.collapsed});
  };

  componentDidMount = async () => {
    const {userDetails, authToken} = this.props.userstore;
    const isFocused = this.props.navigation.isFocused();
    this.setState({
      userDetails: userDetails,
      authToken: authToken,
      pickupName: userDetails?.FirstName,
      pickupNumber: userDetails?.mobile,
    });
    this.time = setInterval(() => {
      if (!isFocused) {
        clearInterval(this.time);
      }
      this.showTimeSlot();
    }, 2000);

    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getCardData();
    });
  };

  componentWillUnmount() {
    clearInterval(this.time);
  }

  getCardData = () => {
    const {userDetails} = this.props.userstore;
    this.props.fetchCartData();
    this.setState({spinner: true}, async () => {
      const GetCartDataResponse = await getCartDetails();
      if (GetCartDataResponse.result === true) {
        let SubTotalprice = 0;
        let cartId = 0;
        var userCartData = GetCartDataResponse.response;
        userCartData.map((cartData, index) => {
          if (cartData.SubCategoryName == 'Custom Cakes') {
            if (!this.Is5hourOrder) {
              this.Is5hourOrder = true;
            }
          }
          if (cartData.SubCategoryName == 'Custom Pies') {
            if (!this.Is1hourOrder) {
              this.Is1hourOrder = true;
            }
          }
          (SubTotalprice += cartData.OrderPrice), (cartId = cartData.CartIdId);
        });
        SubTotalprice = parseFloat(SubTotalprice).toFixed(2);
        let userEmail = userDetails.Email.toLowerCase();
        let Amount = 0;

        if (
          userEmail === 'employee1@gmail.com' ||
          userEmail === 'employee2@gmail.com' ||
          userEmail === 'employee3@gmail.com' ||
          userEmail === 'employee4@gmail.com' ||
          userEmail === 'employee5@gmail.com'
        ) {
          Amount = 0;
        } else {
          Amount = 0;
        }

        let Discount = parseFloat(Amount * 0.1).toFixed(2);
        let Taxprice = (parseFloat(SubTotalprice - Discount) * 0.08625).toFixed(
          2,
        );
        let Totalprice = (
          parseFloat(SubTotalprice) +
          parseFloat(Taxprice) -
          parseFloat(Discount)
        ).toFixed(2);
        this.setState({
          userCartData,
          SubTotalprice,
          Taxprice,
          Totalprice,
          cartId,
          Discount,
          spinner: false,
        });
      } else {
        this.setState({spinner: false});
      }
    });
  };

  deleteCartById = async (cartId) => {
    this.Is5hourOrder = false;
    this.setState({pickupTime: 'Pickup Time'});
    const deleteCartResponse = await deleteCart(cartId);
    if (deleteCartResponse.result === true) {
      this.getCardData();
      this.showTimeSlot();
      Vibration.vibrate();
    } else {
      console.log('getting error on the cart value-------');
    }
  };

  updateCartForFavoriteItems = async (cartId) => {
    const {userDetails, authToken} = this.props.userstore;
    this.setState({userDetails: userDetails, authToken: authToken});
    let body = {};

    this.state.userCartData.map((singleCartData) => {
      if (cartId == singleCartData.CartIdId) {
        body.CartId = singleCartData.CartIdId;
        body.IsFavourite = !singleCartData.IsFavourite;
        body.Quantity = singleCartData.Quantity;
        body.OrderPrice = singleCartData.OrderPrice;
        this.setState({IsFavourite: !this.state.IsFavourite});
      }
    });
    const updateCartResponse = await updateCart(body, authToken);
    if (updateCartResponse.result === true) {
      this.getCardData();
      Vibration.vibrate();
    } else {
      // Alert.alert("Message", "Something went wrong!");
    }
  };

  updateCartForIncreaseQuantity = async (cartId) => {
    const {userDetails, authToken} = this.props.userstore;
    this.setState({userDetails: userDetails, authToken: authToken});

    let body = {};

    this.state.userCartData.map((singleCartData) => {
      if (cartId == singleCartData.CartIdId) {
        body.IsFavourite = singleCartData.IsFavourite;
        body.CartId = singleCartData.CartIdId;
        body.Quantity = singleCartData.Quantity + 1;
        let price = singleCartData.OrderPrice / singleCartData.Quantity;
        price = price * body.Quantity;
        body.OrderPrice = price.toFixed(2);
      }
    });
    const updateCartResponse = await updateCart(body, authToken);
    if (updateCartResponse.result === true) {
      this.getCardData();
      Vibration.vibrate();
    } else {
      //Alert.alert("Message", "Something went wrong!");
    }
  };

  updateCartForDecreaseQuantity = async (cartId) => {
    const {userDetails, authToken} = this.props.userstore;
    this.setState({userDetails: userDetails, authToken: authToken});

    let body = {};
    let currentQuantity = 0;
    this.state.userCartData.map((singleCartData) => {
      if (cartId == singleCartData.CartIdId && singleCartData.Quantity > 1) {
        body.IsFavourite = singleCartData.IsFavourite;
        body.CartId = singleCartData.CartIdId;
        body.Quantity = singleCartData.Quantity - 1;
        currentQuantity = singleCartData.Quantity;
        let price = singleCartData.OrderPrice / singleCartData.Quantity;
        price = price * body.Quantity;
        body.OrderPrice = price.toFixed(2);
      }
    });
    if (currentQuantity > 1) {
      const updateCartResponse = await updateCart(body, authToken);
      if (updateCartResponse.result === true) {
        this.getCardData();
        Vibration.vibrate();
      } else {
        //Alert.alert("Message", "Something went wrong!");
      }
    } else {
      this.deleteCartById(cartId);
    }
  };

  pickName = (name) => {
    let re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    if (name.length <= 25 || name == '') {
      this.setState({
        pickupName: name,
      });
    }
  };

  showTimeSlot = () => {
    let date = new Date();
    let dateArray = [];
    let ShowDate = [];
    let i = 1;

    if (this.Is5hourOrder) {
      date.setHours(date.getHours() + 5);
    } else if (this.Is1hourOrder) {
      date.setHours(date.getHours() + 1);
    }

    while (i <= 8) {
      if (
        (date.getHours() >= 11 && date.getHours() < 22) ||
        (date.getHours() >= 11 &&
          date.getHours() < 23 &&
          date.getMinutes() <= 15)
      ) {
        date.setMinutes(date.getMinutes() + 15);
        dateArray.push(new Date(date));
      } else {
        break;
      }
      i++;
    }

    //For next day order
    if (date.getHours() < 11) {
      let min = 0;
      while (i <= 8) {
        date.setHours(11);
        date.setMinutes(min + 15);
        min += 15;
        dateArray.push(new Date(date));
        i++;
      }
    } else if (date.getHours() >= 23) {
      let min = 0;
      while (i <= 8) {
        date.setDate(date.getDate() + 1);
        date.setHours(11);
        date.setMinutes(min + 15);
        min += 15;
        dateArray.push(new Date(date));
        i++;
      }
    }

    dateArray.map((singleDate, index) => {
      let extracted = `${
        singleDate.getHours() > 12
          ? singleDate.getHours() - 12
          : singleDate.getHours() == 0
          ? 12
          : singleDate.getHours()
      } : ${
        singleDate.getMinutes() < 10
          ? '0' + singleDate.getMinutes()
          : singleDate.getMinutes()
      } ${singleDate.getHours() >= 12 ? 'PM' : 'AM'}`;
      ShowDate.push({
        label: extracted,
        value: extracted,
      });
    });
    this.setState({dateArray: [...ShowDate]});
  };

  phoneNoWithDash = (phoneNo) => {
    if (phoneNo != undefined) {
      let output = phoneNo;
      let str = phoneNo.split('-').join('');
      let seprator = '-';

      let strArr = str.split('');
      for (let i = 0; i < strArr.length; i++) {
        if (i === 3) {
          output = [str.slice(0, 3), seprator, str.slice(3)].join('');
        } else if (i === 6) {
          output = [
            str.slice(0, 3),
            seprator,
            str.slice(3, 6),
            seprator,
            str.slice(6),
          ].join('');
        }
      }
      return output;
    } else {
      return (output = '');
    }
  };

  render() {
    const {userDetails, isUserLoggedIn} = this.props.userstore;
    const {dateArray, spinner} = this.state;
    return (
      <View style={styles.container}>
        <Spinner visible={spinner} />
        <View
          style={{
            width: '40%',
            position: 'absolute',
            zIndex: 5000,
            flex: 1,
            height: 310,
            right: 15,
            top: 88,
          }}>
          <DropDownPicker
            items={dateArray}
            scrollViewProps={{
              style: {zIndex: 5000},
              showsVerticalScrollIndicator: false,
            }}
            placeholder="Pickup Time"
            arrowColor={'#ADA7A5'}
            placeholderStyle={{
              color: '#ADA7A5',
              fontSize: 16,
              fontFamily: 'OpenSans-SemiBold',
            }}
            itemStyle={{
              color: '#ADA7A5',
              fontSize: 16,
              fontFamily: 'OpenSans-SemiBold',
            }}
            labelStyle={{
              color: '#ADA7A5',
              fontSize: 16,
              fontFamily: 'OpenSans-SemiBold',
            }}
            containerStyle={{height: Platform.OS === 'ios' ? 38 : 35}}
            dropDownMaxHeight={270}
            style={{backgroundColor: '#2D2926', borderColor: '#2D2926'}}
            dropDownStyle={{backgroundColor: '#2D2926', borderColor: '#2D2926'}}
            onChangeItem={(item) => this.setState({pickupTime: item.value})}
          />
          <View
            style={{
              borderColor: '#666461',
              borderWidth: 0.5,
              width: '100%',
            }}
          />
        </View>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={{
                borderColor: 'red',
                borderWidth: 0,
                width: 30,
                margin: 10,
              }}
              onPress={() => this.props.navigation.navigate('topNav')}>
              <FastImage source={leftArrow} style={{width: 25, height: 25}} />
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <View style={{justifyContent: 'center', marginEnd: 10}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 22,
                    fontFamily: 'OpenSans-Bold',
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                  {userDetails.LeftRewardPoints == null
                    ? 0
                    : userDetails.LeftRewardPoints}
                </Text>
              </View>
              <FastImage
                source={snow}
                style={{
                  height: 15,
                  width: 15,
                  marginTop: 16,
                  marginEnd: 20,
                  marginLeft: -5,
                }}
              />
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 27,
                fontFamily: 'OpenSans-Bold',
                fontWeight: '700',
                color: '#FFFFFF',
                alignSelf: 'flex-start',
                marginStart: 20,
              }}>
              {`Review Order (${this.state.userCartData.length})`}
            </Text>
          </View>
          <View
            style={{
              borderColor: '#666461',
              borderWidth: 0.5,
              width: '90%',
              alignSelf: 'center',
              marginTop: 5,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '94%',
              marginStart: 10,
            }}>
            <View style={{marginStart: 10, width: '50%'}}>
              <TextInput
                style={{
                  color: '#ADA7A5',
                  fontSize: 16,
                  fontFamily: 'OpenSans-SemiBold',
                  marginTop: Platform.OS === 'ios' ? 10 : -5,
                  borderColor: '#ADA7A5',
                }}
                underlineColorAndroid={'#ADA7A5'}
                placeholder={'Pickup name'}
                placeholderTextColor={'#ADA7A5'}
                allowFontScaling={false}
                fontScale={1}
                value={this.state.pickupName}
                onChangeText={(name) => {
                  this.pickName(name);
                }}
              />
              <View
                style={{
                  borderColor: '#666461',
                  borderWidth: FloatBorderWidth,
                  width: '100%',
                  marginTop: 4,
                }}
              />
            </View>
          </View>
          <View style={{marginStart: 20, width: '50%'}}>
            <TextInput
              style={{
                color: '#ADA7A5',
                fontSize: 16,
                fontFamily: 'OpenSans-SemiBold',
                marginTop: Platform.OS === 'ios' ? 10 : -5,
              }}
              placeholder={'Pickup number'}
              placeholderTextColor={'#ADA7A5'}
              underlineColorAndroid={'#ADA7A5'}
              value={this.phoneNoWithDash(this.state.pickupNumber)}
              onChangeText={(number) => {
                this.setState({pickupNumber: this.phoneNoWithDash(number)});
              }}
              maxLength={12}
              keyboardType={'numeric'}
              returnKeyType={'done'}
            />
            <View
              style={{
                borderColor: '#666461',
                borderWidth: FloatBorderWidth,
                width: '94%',
                marginTop: 4,
              }}
            />
          </View>
        </View>
        {!spinner ? (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                flex: 1,
                marginBottom: this.state.userCartData.length > 0 ? 50 : 0,
                zIndex: Platform.OS === 'ios' ? -10 : -1,
              }}>
              {this.state.userCartData.length >= 1 ? (
                this.state.userCartData.map((singleCartData) => {
                  let sixpackFlavor = [];
                  let sixpackTopping = [];
                  let IsTopping = true;
                  if (singleCartData.IsSixPack === true) {
                    sixpackFlavor = JSON.parse(singleCartData.FlavorName);
                    if (singleCartData.ToppingName != '') {
                      sixpackTopping = JSON.parse(singleCartData?.ToppingName);
                    }
                    let count = 0;
                    sixpackTopping.map((toppingName, index) => {
                      if (toppingName.products === '') {
                        count += 1;
                      }
                    });
                    if (count == sixpackTopping.length) {
                      IsTopping = false;
                    }
                  }
                  return (
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        width: '100%',
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '97%',
                          margin: 10,
                          borderBottomColor: '#DDDDDD',
                          borderBottomWidth: 1,
                          justifyContent: 'space-around',
                        }}>
                        <View>
                          <FastImage
                            style={{height: 40, width: 40, marginTop: 5}}
                            source={{
                              uri: `${HostURL}${singleCartData.LogoUrl}`,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: '67%',
                            paddingStart: 10,
                            borderWidth: 0,
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              fontFamily: 'OpenSans-Bold',
                              color: '#414040',
                            }}>
                            {singleCartData.CategoryName ==
                            singleCartData.SubCategoryName
                              ? `${singleCartData.CategoryName}`
                              : `${singleCartData.CategoryName} (${singleCartData.SubCategoryName})`}
                          </Text>
                          {singleCartData.SizeName != '' &&
                          singleCartData.SizeName != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Size:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.SizeName}
                              </Text>
                            </Text>
                          ) : null}
                          {singleCartData.Comment != '' &&
                          singleCartData.Comment != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Special Instruction:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.Comment}
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.FlavorName != '' &&
                          singleCartData.FlavorName != null ? (
                            <Text
                              numberOfLines={singleCartData.IsSixPack ? 25 : 2}
                              style={styles.subHeading}>
                              Flavors:
                              <Text style={styles.subHeadingText}>
                                {singleCartData.IsSixPack === true ? (
                                  sixpackFlavor.map((flavorName, index) => {
                                    return (
                                      <Text style={styles.subHeadingText}>
                                        {`\n${flavorName.type}: ${flavorName.products}`}
                                      </Text>
                                    );
                                  })
                                ) : (
                                  <Text style={styles.subHeadingText}>
                                    {' ' + singleCartData.FlavorName}
                                  </Text>
                                )}
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.TopFlavorName != '' &&
                          singleCartData.TopFlavorName != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Top Flavors:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.TopFlavorName}
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.MiddleFlavorName != '' &&
                          singleCartData.MiddleFlavorName != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Middle Flavors:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.MiddleFlavorName}
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.BottomFlavorName != '' &&
                          singleCartData.BottomFlavorName != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Bottom Flavors:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.BottomFlavorName}
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.ToppingName != '' &&
                          singleCartData.ToppingName != null &&
                          singleCartData.IsSixPack == false ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Toppings:
                              <Text style={styles.subHeadingText}>
                                {
                                  <Text style={styles.subHeadingText}>
                                    {' ' + singleCartData.ToppingName}
                                  </Text>
                                }
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.ToppingName != '' &&
                          singleCartData.ToppingName != null &&
                          singleCartData.IsSixPack == true &&
                          IsTopping == true ? (
                            <Text numberOfLines={25} style={styles.subHeading}>
                              Toppings:
                              <Text style={styles.subHeadingText}>
                                {sixpackTopping.map((toppingName, index) => {
                                  return (
                                    <Text style={styles.subHeadingText}>
                                      {`\n${toppingName.type}: ${toppingName.products}`}
                                    </Text>
                                  );
                                })}
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.TopToppingName != '' &&
                          singleCartData.TopToppingName != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Top Toppings:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.TopToppingName}
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.MiddleToppingName != '' &&
                          singleCartData.MiddleToppingName != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Middle Toppings:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.MiddleToppingName}
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.BottomToppingName != '' &&
                          singleCartData.BottomToppingName != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Bottom Toppings:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.BottomToppingName}
                              </Text>
                            </Text>
                          ) : null}

                          {singleCartData.SideToppingName != '' &&
                          singleCartData.SideToppingName != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Side Toppings:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.SideToppingName}
                              </Text>
                            </Text>
                          ) : null}
                          {singleCartData.CustomDate != '' &&
                          singleCartData.CustomDate != null ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Pickup Date:
                              <Text style={styles.subHeadingText}>
                                {' ' + singleCartData.CustomDate}
                              </Text>
                            </Text>
                          ) : null}
                          {singleCartData.IsLayered == true ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Layered
                            </Text>
                          ) : null}
                          {singleCartData.IsCandle == true ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              With candle
                            </Text>
                          ) : null}
                          {singleCartData.IsWippedCream == true ? (
                            <Text numberOfLines={2} style={styles.subHeading}>
                              Whipped Cream
                            </Text>
                          ) : null}
                          <Text numberOfLines={2} style={styles.subHeading}>
                            Quantity:
                            <Text style={styles.subHeadingText}>
                              {' ' + singleCartData.Quantity}
                            </Text>
                          </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: 3,
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: 'OpenSans-Bold',
                                color: '#505755',
                              }}>
                              {singleCartData.RewardPoints}
                            </Text>
                            <FastImage
                              source={snow}
                              style={{
                                height: 10,
                                width: 10,
                                alignSelf: 'center',
                                marginLeft: 3,
                                marginRight: 5,
                                marginTop: 2,
                              }}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: 'OpenSans-Bold',
                                color: '#505755',
                              }}>
                              item
                            </Text>
                          </View>
                          {
                            <View
                              style={{
                                flexDirection: 'row',
                                borderColor: 'red',
                                borderWidth: 0,
                                height: 30,
                                marginVertical: 10,
                              }}>
                              {singleCartData.IsRedeem != true ? (
                                <>
                                  <TouchableOpacity
                                    style={{
                                      borderColor: 'blue',
                                      borderWidth: 0,
                                      width: 30,
                                    }}
                                    onPress={() =>
                                      this.updateCartForFavoriteItems(
                                        singleCartData.CartIdId,
                                      )
                                    }>
                                    {singleCartData.IsFavourite == true ? (
                                      <FastImage
                                        source={Heart_Like1}
                                        style={{
                                          width: 30,
                                          height: 30,
                                          alignSelf: 'center',
                                        }}
                                        resizeMode="contain"
                                      />
                                    ) : (
                                      <FastImage
                                        source={Heart_Like}
                                        style={{
                                          width: 24,
                                          height: 24,
                                          alignSelf: 'center',
                                          marginTop: 3,
                                        }}
                                        resizeMode="contain"
                                      />
                                    )}
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                    style={{
                                      width: 30,
                                      borderColor: 'blue',
                                      borderWidth: 0,
                                      marginStart: 20,
                                    }}
                                    onPress={() =>
                                      this.updateCartForIncreaseQuantity(
                                        singleCartData.CartIdId,
                                      )
                                    }>
                                    <FastImage
                                      source={Add_Item}
                                      style={{height: 30, width: 30}}
                                    />
                                  </TouchableOpacity>
                                </>
                              ) : null}
                              <TouchableOpacity
                                style={{
                                  width: 30,
                                  borderColor: 'blue',
                                  borderWidth: 0,
                                  marginStart: 20,
                                }}
                                onPress={() =>
                                  this.updateCartForDecreaseQuantity(
                                    singleCartData.CartIdId,
                                  )
                                }>
                                <FastImage
                                  source={Minus_Item}
                                  style={{
                                    height: 30,
                                    width: 30,
                                    marginLeft:
                                      singleCartData.IsRedeem != true ? 0 : -22,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          }
                        </View>
                        <View style={{width: 65}}>
                          <Text
                            style={{
                              color: '#793422',
                              fontSize: 16,
                              fontFamily: 'OpenSans-Bold',
                              fontWeight: 'bold',
                            }}>
                            ${singleCartData.OrderPrice.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View>
                  <FastImage
                    source={EmptyCart}
                    style={{
                      height: Dimensions.get('window').height * 0.35,
                      width: Dimensions.get('window').width,
                      marginTop: 15,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: '#793422',
                      fontSize: 24,
                      fontFamily: 'OpenSans-Bold',
                      fontWeight: 'bold',
                      marginLeft: 15,
                    }}>
                    Start your next order
                  </Text>
                  <Text
                    style={{
                      color: '#262A29',
                      fontSize: 14,
                      fontFamily: 'OpenSans-SemiBold',
                      marginLeft: 15,
                      marginTop: 10,
                    }}>
                    {`As you add menu items, they'll appear here.\nYou'll have a chance to review before placing your order.`}
                  </Text>
                  <TouchableOpacity
                    style={{
                      height: 50,
                      width: 150,
                      backgroundColor: '#793422',
                      borderRadius: 25,
                      marginLeft: 15,
                      marginTop: 15,
                      justifyContent: 'center',
                    }}
                    onPress={() => this.props.navigation.navigate('topNav')}>
                    <View
                      style={{
                        height: 50,
                        width: 150,
                        backgroundColor: '#793422',
                        borderRadius: 25,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 22,
                          fontFamily: 'OpenSans-SemiBold',
                          color: '#FFF',
                        }}>
                        Add Item
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </>
        ) : null}

        {this.state.userCartData.length > 0 ? (
          <View
            style={{
              position: 'absolute',
              right: 10,
              left: 10,
              right: 10,
              bottom: 10,
            }}>
            <TouchableOpacity
              onPress={() => this.Show_Custom_Alert()}
              disabled={this.state.userCartData.length < 1}
              style={{
                backgroundColor: '#793422',
                justifyContent: 'center',
                borderRadius: 50,
                height: 46,
                width: '30%',
                alignSelf: 'flex-end',
                marginLeft: 30,
              }}>
              <Text style={styles.checkoutButton}>Checkout</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#2D2926',
    height: 190,
    zIndex: -5000,
  },
  subHeading: {
    flexDirection: 'row',
    fontSize: 10,
    fontFamily: 'OpenSans-ExtraBold',
    fontWeight: '800',
    margin: 1,
    marginEnd: 10,
    marginTop: 4,
    color: '#414040',
    width: '85%',
  },
  subHeadingText: {
    fontSize: 10,
    fontFamily: 'OpenSans-SemiBold',
    color: '#505755',
    fontWeight: '600',
  },
  checkoutButton: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    userstore: state.userstore,
    getCartStore: state.getCartStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCartData: () => {
      dispatch(fetchCartDataAsyncCreator());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewOrder);
