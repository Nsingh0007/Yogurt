import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Vibration,
} from 'react-native';
import {GetPreviousOrderItemsByNumber, addCart, HostURL} from '@api';
import Vector2 from '../../../assets/icon/order/icons8-back-50.png';
import Add_Item from '../../../assets/icon/order/Add_Item.png';
import cart1 from '../../../assets/icon/order/cart1.png';
import cart2 from '../../../assets/icon/order/cart2.png';
import {connect} from 'react-redux';
import {fetchCartDataAsyncCreator} from '@redux/getcart.js';
import FastImage from 'react-native-fast-image';
import BackHoc from './manuBord/BackHoc';
import {withBackHandler} from '@appHoc';

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

export class ViewPrevious extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previousOrderItemsData: [],
      OrderNumber: 0,
      authToken: '',
      userDetails: {},
      cartId: 0,
      cartDataLength: 0,
      adding: false,
    };
  }

  componentDidMount = async () => {
    const {userDetails, authToken} = this.props.userstore;
    this.setState({userDetails: userDetails, authToken: authToken});
    const {getParam} = this.props.navigation;
    this.fetchPreviousOrders(getParam('OrderNumber'));
    // this._subscribe = this.props.navigation.addListener('didFocus', () => {
    //   this.getCardData()
    //   //Put your Data loading function here instead of my this.LoadData()
    // })
  };

  fetchPreviousOrders = async OrderNumber => {
    const GetPreviousOrderItemsRespone = await GetPreviousOrderItemsByNumber(
      OrderNumber,
    );
    if (GetPreviousOrderItemsRespone.result === true) {
      var previousOrderItemsData = GetPreviousOrderItemsRespone.response;
      let cartId = 0;
      previousOrderItemsData.map((cartData, index) => {
        cartId = cartData.CartIdId;
      });
      this.setState({previousOrderItemsData, cartId});
    }
  };

  addToCart = async CartId => {
    const {userDetails, authToken} = this.state;
    const sendBody = [];
    let body = {};
    body.CustomerId = userDetails.CustomerId;
    body.Email = userDetails.Email;
    this.state.previousOrderItemsData.map(singlePreviousItem => {
      if (singlePreviousItem.CartIdId === CartId) {
        body = {...singlePreviousItem};
        sendBody.push(body);
      }
    });
    if (sendBody.length > 0) {
      const addCartResponse = await addCart(sendBody, authToken);
      if (addCartResponse.result) {
        this.setState({
          adding: true,
        });
        this.props.fetchCartData();
        Vibration.vibrate();
        setTimeout(() => {
          this.setState({
            adding: false,
          });
        }, 2000);
      }
    }
  };

  render() {
    const {previousOrderItemsData, adding} = this.state;
    const {cartData} = this.props.getCartStore;
    let image = '';
    let CategoryName = '';
    return (
      <View style={styles.continer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <FastImage
              source={Vector2}
              style={{height: 22, width: 22, margin: 1}}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Previous Order Details</Text>
          <Text style={styles.headerText}> </Text>
        </View>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            height: 55,
            margin: 10,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#DDDDDD',
          }}>
          <Text
            style={{
              color: '#414040',
              fontSize: 15,
              fontFamily: 'OpenSans-Bold',
            }}>
            {' '}
            Order Number: {this.props.navigation.getParam('OrderNumber')}
          </Text>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Text
              style={{
                color: '#505755',
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 13,
              }}>
              {this.props.navigation.getParam('OrderDate')} -{' '}
            </Text>
            <Text
              style={{
                color: '#505755',
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 13,
              }}>
              {this.props.navigation.getParam('OrderTime')}
            </Text>
          </View>
        </View>
        <ScrollView>
          {previousOrderItemsData.map(singlePreviousItem => {
            let sixpackFlavor = [];
            let sixpackTopping = [];
            let IsTopping = true;
            image = singlePreviousItem.CategoryImage;
            CategoryName = singlePreviousItem.CategoryName;
            if (singlePreviousItem.IsSixPack === true) {
              sixpackFlavor = JSON.parse(singlePreviousItem.FlavorName);
              if (singlePreviousItem.ToppingName != '') {
                sixpackTopping = JSON.parse(singlePreviousItem.ToppingName);
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
                  borderColor: 'red',
                  borderWidth: 0,
                  margin: 3,
                  backgroundColor: '#FFFFFF',
                  borderBottomColor: '#E5E5E5',
                  borderBottomWidth: 1,
                }}>
                <View style={{flexDirection: 'row', margin: 7}}>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderColor: '#DDDDDD',
                      borderWidth: 0.5,
                      borderRadius: 30,
                      justifyContent: 'center',
                      marginTop: 10,
                    }}>
                    <FastImage
                      source={{
                        uri: `${HostURL}${singlePreviousItem.CategoryImage}`,
                      }}
                      style={{height: 40, width: 40, alignSelf: 'center'}}
                      resizeMode="contain"
                    />
                  </View>
                  <View
                    style={{
                      borderColor: 'red',
                      borderWidth: 0,
                      alignSelf: 'flex-start',
                      marginStart: 4,
                      marginTop: 10,
                      width: '70%',
                    }}>
                    {/* <Text style={{ alignSelf: 'flex-start', fontSize: 14, fontFamily: 'OpenSans-ExtraBold', color: '#505755', paddingStart: 10 }}>{singlePreviousItem.CategoryName}</Text> */}
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: 14,
                          fontFamily: 'OpenSans-ExtraBold',
                          color: '#505755',
                          paddingStart: 10,
                        }}>
                        {singlePreviousItem.CategoryName + ' '}
                      </Text>
                      {singlePreviousItem?.SubCategoryName &&
                        singlePreviousItem.CategoryName !=
                          singlePreviousItem?.SubCategoryName && (
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'OpenSans-Bold',
                              color: '#414040',
                            }}>
                            ({singlePreviousItem?.SubCategoryName})
                          </Text>
                        )}
                    </View>

                    {singlePreviousItem.SizeName != '' &&
                    singlePreviousItem.SizeName != null ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={2} style={styles.subHeader}>
                          Size:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.SizeName}
                          </Text>
                        </Text>
                      </View>
                    ) : null}
                    {singlePreviousItem.Comment != '' &&
                    singlePreviousItem.Comment != null ? (
                      <Text numberOfLines={2} style={styles.subHeader}>
                        Special Instruction:
                        <Text style={styles.subHeaderText}>
                          {' ' + singlePreviousItem.Comment}
                        </Text>
                      </Text>
                    ) : null}
                    {singlePreviousItem.FlavorName != '' &&
                    singlePreviousItem.FlavorName != null ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          numberOfLines={singlePreviousItem.IsSixPack ? 25 : 2}
                          style={styles.subHeader}>
                          Flavors:
                          {singlePreviousItem.IsSixPack === true ? (
                            sixpackFlavor.map((flavorName, index) => {
                              return (
                                <Text style={styles.subHeaderText}>
                                  {`\n${flavorName.type}: ${flavorName.products}`}
                                </Text>
                              );
                            })
                          ) : (
                            <Text style={styles.subHeaderText}>
                              {' ' + singlePreviousItem.FlavorName}
                            </Text>
                          )}
                        </Text>
                      </View>
                    ) : null}
                    {singlePreviousItem.TopFlavorName != '' &&
                    singlePreviousItem.TopFlavorName != null ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={2} style={styles.subHeader}>
                          Top Flavors:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.TopFlavorName}
                          </Text>
                        </Text>
                      </View>
                    ) : null}
                    {singlePreviousItem.MiddleFlavorName != '' &&
                    singlePreviousItem.MiddleFlavorName != null ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={2} style={styles.subHeader}>
                          Middle Flavors:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.MiddleFlavorName}
                          </Text>
                        </Text>
                      </View>
                    ) : null}
                    {singlePreviousItem.BottomFlavorName != '' &&
                    singlePreviousItem.BottomFlavorName != null ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={2} style={styles.subHeader}>
                          Bottom Flavors:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.BottomFlavorName}
                          </Text>
                        </Text>
                      </View>
                    ) : null}
                    {singlePreviousItem.ToppingName != '' &&
                    singlePreviousItem.ToppingName != null &&
                    singlePreviousItem.IsSixPack == false ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={2} style={styles.subHeader}>
                          Toppings:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.ToppingName}
                          </Text>
                        </Text>
                      </View>
                    ) : null}
                    {singlePreviousItem.ToppingName != '' &&
                    singlePreviousItem.ToppingName != null &&
                    singlePreviousItem.IsSixPack == true &&
                    IsTopping == true ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={25} style={styles.subHeader}>
                          Toppings:
                          <Text style={styles.subHeaderText}>
                            {sixpackTopping.map((toppingName, index) => {
                              return (
                                <Text style={styles.subHeadingText}>
                                  {`\n${toppingName.type}: ${toppingName.products}`}
                                </Text>
                              );
                            })}
                          </Text>
                        </Text>
                      </View>
                    ) : null}
                    {singlePreviousItem.TopToppingName != '' &&
                    singlePreviousItem.TopToppingName != null ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={2} style={styles.subHeader}>
                          Top Toppings:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.TopToppingName}
                          </Text>
                        </Text>
                      </View>
                    ) : null}

                    {singlePreviousItem.BottomToppingName != '' &&
                    singlePreviousItem.BottomToppingName != null ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={2} style={styles.subHeader}>
                          Bottom Topping:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.BottomToppingName}
                          </Text>
                        </Text>
                      </View>
                    ) : null}

                    {singlePreviousItem.MiddleToppingName != '' &&
                    singlePreviousItem.MiddleToppingName != null ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.subHeader}>
                          Middle Topping:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.MiddleToppingName}
                          </Text>
                        </Text>
                      </View>
                    ) : null}

                    {singlePreviousItem.IsSideTopping === true ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.subHeader}>
                          Side Topping:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.SideToppingName}
                          </Text>
                        </Text>
                      </View>
                    ) : null}

                    {singlePreviousItem.CustomDate != '' &&
                    singlePreviousItem.CustomDate != null ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.subHeader}>
                          Pickup Date:
                          <Text style={styles.subHeaderText}>
                            {' ' + singlePreviousItem.CustomDate}
                          </Text>
                        </Text>
                      </View>
                    ) : null}

                    {singlePreviousItem.IsLayered == true ? (
                      <Text numberOfLines={2} style={styles.subHeader}>
                        Layered
                      </Text>
                    ) : null}
                    {singlePreviousItem.IsCandle == true ? (
                      <Text numberOfLines={2} style={styles.subHeader}>
                        With candle
                      </Text>
                    ) : null}
                    {singlePreviousItem.IsWippedCream == true ? (
                      <Text numberOfLines={2} style={styles.subHeader}>
                        Whipped Cream
                      </Text>
                    ) : null}
                    <Text numberOfLines={1} style={styles.subHeader}>
                      Quantity:
                      <Text style={styles.subHeaderText}>
                        {' ' + singlePreviousItem.Quantity}
                      </Text>
                    </Text>

                    <Text
                      style={{
                        alignSelf: 'flex-start',
                        fontSize: 16,
                        fontFamily: 'OpenSans-ExtraBold',
                        color: '#505755',
                        paddingStart: 10,
                        marginTop: 10,
                      }}>
                      $ {singlePreviousItem.OrderPrice}
                    </Text>
                  </View>
                  {singlePreviousItem.IsRedeem != true ? (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          image = singlePreviousItem.CategoryImage;
                          CategoryName = singlePreviousItem.CategoryName;
                          this.addToCart(singlePreviousItem.CartIdId);
                        }}
                        style={{
                          margin: 20,
                          marginLeft: -5,
                          justifyContent: 'center',
                        }}>
                        <FastImage
                          source={Add_Item}
                          style={{height: 30, width: 30}}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </ScrollView>
        {adding ? (
          <View
            style={{
              backgroundColor: 'grey',
              height: 50,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#FFF',
                fontSize: 14,
                fontFamily: 'OpenSans-SemiBold',
                paddingLeft: 10,
              }}>
              {CategoryName} added in your cart
            </Text>
          </View>
        ) : null}
        <View
          style={{
            height: 65,
            backgroundColor: '#262A29',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <View style={{width: '80%'}}>
            <Text
              style={[styles.subContent2, {color: '#bfbfbf', marginStart: 0}]}>
              Pickup Store
            </Text>
            <View
              style={{borderBottomWidth: 0.3, borderBottomColor: '#666666'}}>
              <Text
                style={[
                  styles.subContent2,
                  {color: '#FFF', margin: 0, marginStart: 0},
                ]}>
                Greenvale, NY 11548
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('revieworder')}>
            <View style={{marginTop: -18}}>
              <View
                style={{
                  zIndex: 10,
                  height: 28,
                  width: 27,
                  top: 40,
                  right: -9,
                }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 18,
                    fontFamily: 'OpenSans-SemiBold',
                    textAlign: 'center',
                  }}>
                  {cartData.TotalQuantity}
                </Text>
              </View>
              {cartData.TotalQuantity > 0 ? (
                <FastImage
                  source={cart2}
                  style={{width: 45, height: 45}}
                  resizeMode="contain"
                />
              ) : (
                <FastImage
                  source={cart1}
                  style={{width: 45, height: 45}}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        {adding ? (
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              width: 45,
              height: 45,
              bottom: 65,
              right: 12,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              borderBottomLeftRadius: 25,
              backgroundColor: '#FFF',
              transform: [{rotateZ: '45deg'}],
            }}>
            <FastImage
              source={{
                uri: `${HostURL}${image}`,
              }}
              style={{
                height: 37,
                width: 37,
                borderRadius: 20,
                transform: [{rotateZ: '-45deg'}],
              }}
            />
          </View>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  continer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#2D2926',
    width: '100%',
    height: 60,
    padding: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subheaderView: {
    backgroundColor: '#DBDDDE',
    height: 50,
    width: '100%',
  },
  borderLine: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    width: '90%',
    alignSelf: 'center',
    margin: 0,
  },
  subContent: {
    fontSize: 17,
    margin: 0,
    marginStart: 20,
  },
  subTextContent: {
    fontSize: 14,
    color: '#793422',
    marginStart: 20,
    marginEnd: 20,
  },
  addRemoveButton: {
    fontSize: 16,
    color: '#793422',
    fontWeight: '700',
    marginTop: 5,
    marginEnd: 10,
  },
  txt: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    alignSelf: 'center',
    marginTop: 100,
  },
  subHeader: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontFamily: 'OpenSans-Bold',
    color: '#414040',
    paddingStart: 10,
    marginTop: 5,
  },
  subHeaderText: {
    color: '#505755',
    fontSize: 11,
    fontFamily: 'OpenSans-Bold',
    fontWeight: 'normal',
  },
  subContent2: {
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    fontWeight: 'bold',
    margin: 5,
    marginStart: 20,
    color: '#414040',
  },
});
const mapStateToProps = state => {
  return {
    userstore: state.userstore,
    getCartStore: state.getCartStore,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCartData: () => {
      dispatch(fetchCartDataAsyncCreator());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BackHoc(ViewPrevious))
//export default connect(mapStateToProps, mapDispatchToProps)(ViewPrevious);
