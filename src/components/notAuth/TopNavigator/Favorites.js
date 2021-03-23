import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Vibration
} from 'react-native';
import BottomNavigator from '../../../router/BottomNavigator';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import { getFavoritesItemsDetails, updateFavoriteItemStatus, addCart, HostURL } from '@api';
import FavoriteIcon from '../../../assets/icon/PreviousIcon.png'
import Add_Item from '../../../assets/icon/order/Add_Item.png';
import uncheckedIcon from '../../../assets/icon/order/Heart_Like.png'
import heart from '../../../assets/icon/order/heart.png'
import cart1 from '../../../assets/icon/order/cart1.png';
import cart2 from '../../../assets/icon/order/cart2.png';
import { topLevelNavigate } from '@navigation/topLevelRef.js';
import { fetchCartDataAsyncCreator } from '@redux/getcart.js';
import FastImage from 'react-native-fast-image';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

SimpleLineIcon.loadFont();
Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: '',
      userDetails: {},
      favoritesItemData: [],
      cartId: 0,
      spinner: true,
      cartDataLength: 0
    };
  }

  fetchupdateFavoriteItemStatus = async (cartId) => {
    const updateFavoriteItemStatusResponse = await updateFavoriteItemStatus(cartId)
    if (updateFavoriteItemStatusResponse.result === true) {
      this.fetchFavoritesItems()
    }
    else {
      console.log("getting Error on the Update favorite item status api-------------")
    }
  }

  fetchFavoritesItems = () => {
    this.setState({ spinner: false }, async () => {
      const GetfavoritesItemRespone = await getFavoritesItemsDetails()
      if (GetfavoritesItemRespone.result === true) {
        var favoritesItemData = GetfavoritesItemRespone.response
        let cartId = 0
        favoritesItemData.map((cartData, index) => {
          cartId = cartData.CartIdId
        })
        this.setState({ favoritesItemData, cartId, spinner: false });
      }
      else {
        this.setState({ spinner: false }, () => {
          this.fetchFavoritesItems();
          // setTimeout(() => {
          //   Alert.alert("Message", "Something went wrong!", [
          //     {
          //       text: 'Okay',
          //       onPress: () => {
          //         this.props.navigation.goBack();
          //       }
          //     }
          //   ])
          // }, 200)
        })
      }
    });
  }

  componentDidMount = async () => {
    const { userDetails, authToken } = this.props.userstore;
    this.setState({ userDetails: userDetails, authToken: authToken })
    this.fetchFavoritesItems()
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.fetchFavoritesItems()
    })
  }

  addToCart = async (CartId) => {
    const { userDetails, authToken, } = this.state;
    const sendBody = [];
    let body = {};
    body.CustomerId = userDetails.CustomerId;
    body.Email = userDetails.Email;
    this.state.favoritesItemData.map((singleFavoritesItem) => {
      if (CartId === singleFavoritesItem.CartIdId) {
        body = singleFavoritesItem
        sendBody.push(body)
      }
    })
    if (sendBody.length > 0) {
      const addCartResponse = await addCart(sendBody, authToken);
      if (addCartResponse.result) {
        this.props.fetchCartData();
        Vibration.vibrate()
      }
    }
  }

  render() {
    const { favoritesItemData } = this.state;
    const { cartData } = this.props.getCartStore;
    const newArray = [];
    favoritesItemData.forEach(obj => {
      if (!newArray.some(o => o.CategoryName === obj.CategoryName)) {
        newArray.push({ ...obj })
      }
    });

    return (
      <View style={styles.continer}>
        <Spinner visible={this.state.spinner} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            favoritesItemData.length > 0 ?
              favoritesItemData.map((singleFavoriteItem) => {
                let sixpackFlavor = []
                let sixpackTopping = []
                let IsTopping = true
                if (singleFavoriteItem.IsSixPack === true) {
                  sixpackFlavor = JSON.parse(singleFavoriteItem.FlavorName)
                  if (singleFavoriteItem.ToppingName != "") {
                    sixpackTopping = JSON.parse(singleFavoriteItem.ToppingName)
                  }
                  let count = 0
                  sixpackTopping.map((toppingName, index) => {
                    if (toppingName.products === '') {
                      count += 1
                    }
                  })
                  if (count == sixpackTopping.length) {
                    IsTopping = false
                  }
                }
                return (
                  <View style={{ borderColor: 'red', borderWidth: 0, margin: 3, backgroundColor: '#FFFFFF', borderBottomColor: '#E5E5E5', borderBottomWidth: 1 }}>

                    <View style={{ flexDirection: 'row', margin: 7 }}>
                      <View style={{ width: 60, height: 60, borderColor: '#DDDDDD', borderWidth: 0.5, borderRadius: 30, justifyContent: 'center', marginTop: 10 }}>
                        <FastImage source={{
                          uri: `${HostURL}${singleFavoriteItem.CategoryImage}`,
                        }}
                          style={{ height: 40, width: 40, alignSelf: 'center', }} resizeMode="contain" />
                      </View>
                      <View style={{ borderColor: 'red', borderWidth: 0, alignSelf: 'flex-start', marginStart: 4, marginTop: 10, width: '75%', }} >
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ alignSelf: 'flex-start', fontSize: 14, fontFamily: 'OpenSans-ExtraBold', color: '#505755', paddingStart: 10 }}>{singleFavoriteItem.CategoryName + " "}</Text>
                          {
                            singleFavoriteItem?.SubCategoryName &&
                            singleFavoriteItem.CategoryName != singleFavoriteItem?.SubCategoryName && (
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontFamily: "OpenSans-Bold",
                                  color: "#414040",
                                }}
                              >
                                ({singleFavoriteItem?.SubCategoryName})
                              </Text>
                            )
                          }
                        </View>
                        {
                          singleFavoriteItem.SizeName != "" && singleFavoriteItem.SizeName != null ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text numberOfLines={2} style={styles.subHeader}>Size:
                                <Text style={styles.subHeaderText}>{" " + singleFavoriteItem.SizeName}</Text>
                              </Text>
                            </View>
                            : null
                        }
                        {
                          singleFavoriteItem.Comment != "" && singleFavoriteItem.Comment != null ?
                            <Text
                              numberOfLines={2}
                              style={styles.subHeader}
                            >
                              Special Instruction:
                          <Text style={styles.subHeaderText}>
                                {" " + singleFavoriteItem.Comment}
                              </Text>
                            </Text> : null
                        }
                        {
                          singleFavoriteItem.FlavorName != "" ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text numberOfLines={singleFavoriteItem.IsSixPack ? 25 : 2} style={styles.subHeader}>Flavors:
                              {
                                  singleFavoriteItem.IsSixPack === true ?
                                    sixpackFlavor.map((flavorName, index) => {
                                      return <Text style={styles.subHeaderText}>
                                        {`\n${flavorName.type}: ${flavorName.products}`}
                                      </Text>
                                    })
                                    :
                                    <Text style={styles.subHeaderText}>
                                      {" " + singleFavoriteItem.FlavorName}
                                    </Text>
                                }
                              </Text>
                            </View>
                            : null
                        }
                        {
                          singleFavoriteItem.TopFlavorName != "" ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text numberOfLines={2} style={styles.subHeader}>Top Flavors:
                                <Text style={styles.subHeaderText}>{" " + singleFavoriteItem.TopFlavorName}</Text>
                              </Text>
                            </View>
                            : null
                        }
                        {
                          singleFavoriteItem.MiddleFlavorName != "" ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text numberOfLines={2} style={styles.subHeader}>Middle Flavors:
                                <Text style={styles.subHeaderText}>{" " + singleFavoriteItem.MiddleFlavorName}</Text>
                              </Text>
                            </View>
                            : null
                        }
                        {
                          singleFavoriteItem.BottomFlavorName != "" ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text numberOfLines={2} style={styles.subHeader}>Bottom Flavors:
                                <Text style={styles.subHeaderText}>{" " + singleFavoriteItem.BottomFlavorName}</Text>
                              </Text>
                            </View>
                            : null
                        }

                        {
                          singleFavoriteItem.ToppingName != "" && singleFavoriteItem.IsSixPack == false ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text numberOfLines={2} style={styles.subHeader}>Toppings:
                                <Text style={styles.subHeaderText}>{" " + singleFavoriteItem.ToppingName}</Text>
                              </Text>
                            </View>
                            : null
                        }

                        {
                          singleFavoriteItem.ToppingName != "" && singleFavoriteItem.IsSixPack == true && IsTopping == true ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text numberOfLines={25} style={styles.subHeader}>Toppings:
                                <Text style={styles.subHeaderText}>{
                                  sixpackTopping.map((toppingName, index) => {
                                    return <Text style={styles.subHeadingText}>
                                      {`\n${toppingName.type}: ${toppingName.products}`}
                                    </Text>
                                  })
                                }</Text>
                              </Text>
                            </View>
                            : null
                        }

                        {
                          singleFavoriteItem.TopToppingName != "" ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text numberOfLines={2} style={styles.subHeader}>Top Toppings:
                                <Text style={styles.subHeaderText}>{" " + singleFavoriteItem.TopToppingName}</Text>
                              </Text>
                            </View>
                            : null
                        }

                        {
                          singleFavoriteItem.BottomToppingName != "" ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text numberOfLines={2} style={styles.subHeader}>Bottom Topping:
                                <Text style={styles.subHeaderText}>{" " + singleFavoriteItem.BottomToppingName}</Text>
                              </Text>
                            </View>
                            : null

                        }

                        {
                          singleFavoriteItem.MiddleToppingName != "" ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text style={styles.subHeader}>Middle Topping:
                                <Text style={styles.subHeaderText}>{" " + singleFavoriteItem.MiddleToppingName}</Text>
                              </Text>
                            </View>
                            : null

                        }

                        {
                          singleFavoriteItem.IsSideTopping === true ?
                            <View style={{ flexDirection: 'row', }}>
                              <Text style={styles.subHeader}>Side Topping:
                                <Text style={styles.subHeaderText}>{" " + singleFavoriteItem.SideToppingName}</Text>
                              </Text>
                            </View>
                            : null
                        }

                        {
                          singleFavoriteItem.IsLayered == true ?
                            <Text
                              numberOfLines={2}
                              style={styles.subHeader}
                            >
                              Layered
                            </Text> : null
                        }
                        {
                          singleFavoriteItem.IsCandle == true ?
                            <Text
                              numberOfLines={2}
                              style={styles.subHeader}
                            >
                              With candle
                            </Text> : null
                        }
                        {
                          singleFavoriteItem.IsWippedCream == true ?
                            <Text
                              numberOfLines={2}
                              style={styles.subHeader}
                            >
                              Whipped Cream
                            </Text> : null
                        }
                        <Text
                          numberOfLines={1}
                          style={styles.subHeader}
                        >
                          Quantity:
                          <Text style={styles.subHeaderText}>
                            {" " + singleFavoriteItem.Quantity}
                          </Text>
                        </Text>

                        <TouchableOpacity
                          onPress={() => this.addToCart(singleFavoriteItem.CartIdId)}
                          style={{ justifyContent: 'center', margin: 4, borderRadius: 30, width: 30, height: 27, marginLeft: 10 }}>
                          <FastImage
                            source={Add_Item}
                            style={{ height: 30, width: 30, alignSelf: 'center' }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <TouchableOpacity style={{ margin: -15, marginEnd: -36 }}>
                          <CheckBox
                            checkedIcon={
                              <FastImage source={heart} style={styles.heartImg} resizeMode="contain" />
                            }
                            uncheckedIcon={
                              <FastImage source={uncheckedIcon} style={styles.heartImg} resizeMode="contain" />
                            }
                            checked={singleFavoriteItem.IsFavourite}
                            onPress={() =>
                              this.fetchupdateFavoriteItemStatus(singleFavoriteItem.CartIdId)
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              })
              :
              <View style={{ justifyContent: 'center' }}>
                <FastImage resizeMode="contain" source={FavoriteIcon} style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height*0.4, marginTop: 15, }} />
                <Text style={{ fontSize: 20, fontFamily: 'OpenSans-SemiBold', color: '#262A29', paddingLeft: 15 }}>Favorite Item</Text>
                <Text style={{ fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#696969', paddingLeft: 15 }}>Use the heart to save customizations. Your favorites will appear here to order again.</Text>
              </View>
          }

        </ScrollView>
        <View
          style={{
            height: 65,
            backgroundColor: '#262A29',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <View style={{width: '80%'}}>
            <Text
              style={[styles.subContent, {color: '#bfbfbf', marginStart: 0}]}>
              Pickup Store
            </Text>
            <View
              style={{borderBottomWidth: 0.3, borderBottomColor: '#666666'}}>
              <Text
                style={[
                  styles.subContent,
                  {color: '#FFF', margin: 0, marginStart: 0},
                ]}>
                Greenvale, NY 11548
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => topLevelNavigate('revieworder')}>
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
                  {cartData.length}
                </Text>
              </View>
              {cartData.length > 0 ? (
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
        <BottomNavigator
          currentRoute={'Order'}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    width: '100%',
  },
  img: {
    width: 30,
    height: 30,
    margin: 20,
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
    marginTop: 5
  },
  subHeaderText: {
    color: '#505755',
    fontSize: 11,
    fontFamily: 'OpenSans-Bold',
    fontWeight: 'normal',
  },
  heartImg: {
    width: 22,
    height: 22,
  },
  subContent: {
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    fontWeight: 'bold',
    margin: 5,
    marginStart: 20,
    color: '#414040',
  },
});


const mapStateToProps = (state) => {
  return {
    userstore: state.userstore,
    getCartStore: state.getCartStore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCartData: () => {
      dispatch(fetchCartDataAsyncCreator());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);