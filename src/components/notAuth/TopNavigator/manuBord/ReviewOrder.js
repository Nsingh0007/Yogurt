import React, { Component } from 'react';
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
  BackHandler
} from 'react-native';
import leftArrow from '../../../../assets/icon/order/leftArrow.png';
import snow from '../../../../assets/icon/order/snow.png';
import Spinner from 'react-native-loading-spinner-overlay';
import Heart_Like from '../../../../assets/icon/order/Heart_Like.png';
import Heart_Like1 from '../../../../assets/icon/order/heart.png';
import Add_Item from '../../../../assets/icon/order/Add_Item.png';
import Minus_Item from '../../../../assets/icon/order/Minus_Item.png';
import EmptyCart from '../../../../assets/icon/order/EmptyCart.png';
import { connect } from 'react-redux';
import { deleteCart, updateCart, HostURL } from '@api';
import { fetchCartDataAsyncCreator } from '@redux/getcart.js';
import { setCurrentSelectedCategory } from '@redux';
import { topLevelNavigate } from '@navigation/topLevelRef.js';
import FastImage from 'react-native-fast-image';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { rootLevelBackFunction } from '@appHoc';
import { navigateRootBottomTab } from '../../../../router/rootBottomTabRef';
import { navigateTopTabRef } from '../../../../router/topTabRef';

MaterialIcons.loadFont();

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
    this.setState({ Model_Visibility: visible });
  }

  Hide_Custom_AlertForTime() {
    this.setState({ Model_Visibility: false });
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
    this.setState({ Alert_Visibility: false });
  }

  toggleExpanded = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed });
  };

  componentDidMount = async () => {
    let navigateOnBackParam = this.props.navigation.getParam('toRoute');
    const { userDetails, authToken } = this.props.userstore;
    const isFocused = this.props.navigation.isFocused();
    //BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this.setState({
      userDetails: userDetails,
      authToken: authToken,
      pickupName: userDetails?.FirstName,
      pickupNumber: userDetails?.mobile,
    });
    this.time = setInterval(() => {
      if (!isFocused) {
        clearInterval(this.time);
        //BackHandler.removeEventListener('hardwareBackPress', this.backAction);
      }
      this.showTimeSlot();
    }, 2000);

    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      rootLevelBackFunction.func = () => {
        //topLevelNavigate(navigateOnBackParam);
        this.props.navigation.goBack();
      }
      this.getCardData();
    });
  };

  componentWillUnmount() {
    console.log('UNMOUNT_RE_ORDER');
    clearInterval(this.time);
    //BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  assignmentData = (rootObject, cartData) => {
    let extractKeysFromCartData = [
      {
        cartDataKey: 'Flavor',
        rootObjectKey: 'flavours',
        containerKey: 'flavorData',
        mapKey: 'FlavorId',
      },
      {
        cartDataKey: 'TopFlavor',
        rootObjectKey: 'topflavours',
        containerKey: 'flavorData',
        mapKey: 'FlavorId',
      },
      {
        cartDataKey: 'MiddleFlavor',
        rootObjectKey: 'middleflavours',
        containerKey: 'flavorData',
        mapKey: 'FlavorId',
      },
      {
        cartDataKey: 'BottomFlavor',
        rootObjectKey: 'bottomflavours',
        containerKey: 'flavorData',
        mapKey: 'FlavorId',
      },
      {
        cartDataKey: 'Topping',
        rootObjectKey: 'toppings',
        containerKey: 'toppingsData',
        mapKey: 'ToppingId',
      },
      {
        cartDataKey: 'BottomTopping',
        rootObjectKey: 'bottomTopping',
        containerKey: 'toppingsData',
        mapKey: 'ToppingId',
      },
      {
        cartDataKey: 'TopTopping',
        rootObjectKey: 'topTopping',
        containerKey: 'toppingsData',
        mapKey: 'ToppingId',
      },
      {
        cartDataKey: 'MiddleTopping',
        rootObjectKey: 'middleTopping',
        containerKey: 'toppingsData',
        mapKey: 'ToppingId',
      },
      {
        cartDataKey: 'SideTopping',
        rootObjectKey: 'sideTopping',
        containerKey: 'toppingsData',
        mapKey: 'ToppingId',
      },
    ];

    extractKeysFromCartData.map((singleOperation, index) => {

      rootObject[singleOperation.rootObjectKey] = [];
      let extractIdsFromCartString = cartData[
        singleOperation.cartDataKey
      ].split(',');
      extractIdsFromCartString.map((ids, index) => {
        let id = parseInt(ids);
        let dataFetchFromProductStore = this.props.productstore[
          singleOperation.containerKey
        ].find(data => {
          if (data[singleOperation.mapKey] == id) {
            return true;
          }
        });
        if (
          dataFetchFromProductStore &&
          Object.keys(dataFetchFromProductStore).length > 0
        ) {
          rootObject[singleOperation.rootObjectKey].push({
            ...dataFetchFromProductStore,
          });
        }
      });
    });
    rootObject.isEditMode = true;
    return rootObject;
  };

  getFlavorsOrToppingFromStore = (outerKey, innerKey, id) => {
    let productStore = this.props.reduxState.productstore;
    let returnData = {};
    productStore[outerKey].map(i => {
      if (i[innerKey] == id) {
        returnData = { ...i };
      }
    });
    return returnData;
  };

  handleSixPackEdit = (singleCartData, cartIndex) => {
    const { categoryStore, getCartStore } = this.props;
    const { categoryData, loader } = categoryStore;
    let newSixPackStore = { ...this.props.reduxState.sixPackStore };
    let executeSixPackIndex = -1;
    let executeSixPackRootObject = {};
    newSixPackStore.sixPackData.map((rootSixPack, index) => {
      if (
        rootSixPack.Category.CategoryId == singleCartData.CategoryId &&
        rootSixPack.SubCategory.SubCategoryId == singleCartData.SubCategoryId
      ) {
        executeSixPackIndex = index;
        executeSixPackRootObject = { ...rootSixPack };
      }
    });
    if (
      executeSixPackIndex == -1 ||
      Object.keys(executeSixPackRootObject).length == 0
    ) {
      return Alert.alert('Message', "You Can't Edit this Item in Cart");
    }
    executeSixPackRootObject.isEditMode = true;
    const assignSixPackDataToStore = Products => {
      let rootProducts = { ...Products };
      let bindObj = [
        {
          inCartKey: 'Flavor',
          inSixPackProductKey: 'flavours',
          dataProductStoreFetch: 'flavorData',
          dataProductStoreFetchKey: 'FlavorId',
        },
        {
          inCartKey: 'Topping',
          inSixPackProductKey: 'toppings',
          dataProductStoreFetch: 'toppingsData',
          dataProductStoreFetchKey: 'ToppingId',
        },
      ];
      bindObj.map(bind => {
        try {
          let inCartSelectProduct = JSON.parse(singleCartData[bind.inCartKey]);

          rootProducts[bind.inSixPackProductKey] = rootProducts[
            bind.inSixPackProductKey
          ].map(productTypesData => {
            let findProductsFromCart = inCartSelectProduct.find(
              i => i.type == productTypesData.type,
            );
            if (!findProductsFromCart) {
              productTypesData.products = [];
              return { ...productTypesData };
            }
            let products = [];
            let mapProducts = findProductsFromCart.products.split(',');
            if (mapProducts.length == 0) {
              productTypesData.products = [];
              return { ...productTypesData };
            }
            mapProducts.map(productInCart => {
              let returnObj = {
                ...this.getFlavorsOrToppingFromStore(
                  bind.dataProductStoreFetch,
                  bind.dataProductStoreFetchKey,
                  parseInt(productInCart),
                ),
              };
              if (Object.keys(returnObj).length > 0) {
                products.push(returnObj);
              }
            });
            let newProductReturnData = { ...productTypesData };
            newProductReturnData.products = products;
            return newProductReturnData;
          });
        } catch (e) {
          return;
        }
      });
      return rootProducts;
    };
    executeSixPackRootObject.Products = assignSixPackDataToStore(
      executeSixPackRootObject.Products,
    );
    newSixPackStore.sixPackData[executeSixPackIndex] = {
      ...executeSixPackRootObject,
    };
    this.props.dispatch({ type: 'MUTATE', data: newSixPackStore });
    categoryData?.map((singleMenu, categoryIndex) => {
      if (
        singleCartData.CategoryId == singleMenu.CategoryId &&
        singleMenu.IsSubCategory
      ) {
        singleMenu.SubCategoryInfolst.map(
          (singleSubCategory, subCategoryIndex) => {
            if (
              singleCartData.SubCategoryId == singleSubCategory.SubCategoryId
            ) {
              this.props.setCurrentSelectedCategoryDispatch({
                category: singleMenu,
                subCategory: singleSubCategory,
                categoryIndex,
                subCategoryIndex,
                isSubCategory: true,
                priceDetails: singleMenu.priceDetails,
                isSixPack: true,
              });
              topLevelNavigate('menuIndex', {
                category: singleMenu,
                subCategory: singleSubCategory,
                isSubCategory: true,
                priceDetails: singleMenu.priceDetails,
                isSixPack: true,
                cartId: singleCartData.CartIdId,
              });
            }
          },
        );
      }
    });
  };

  handleCartEdit = (singleCartData, cartIndex) => {
    const { categoryStore, getCartStore } = this.props;
    const { categoryData, loader } = categoryStore;

    if (singleCartData.IsSixPack) {
      return this.handleSixPackEdit(singleCartData, cartIndex);
    }

    let newProductStore = { ...this.props.productstore };
    let selectedProductData = [];
    newProductStore.selectedProductData.map((productData, index) => {
      if (productData.CategoryId == singleCartData.CategoryId) {
        let newProductData = { ...productData };
        if (productData.isSubCategory) {
          let newSubCategoryData = [];
          productData.subCategoryData.map((subCategoryDataL, subCatIndex) => {
            if (
              subCategoryDataL.SubCategoryId == singleCartData.SubCategoryId
            ) {
              let newSubCategoryDataL = this.assignmentData(
                { ...subCategoryDataL },
                singleCartData,
              );
              newSubCategoryData.push({ ...newSubCategoryDataL });
            } else {
              newSubCategoryData.push({ ...subCategoryDataL });
            }
          });
          newProductData.subCategoryData = [...newSubCategoryData];
        } else {
          let newProductAssignmentData = this.assignmentData(
            { ...productData },
            singleCartData,
          );
          newProductData = {
            ...newProductData,
            ...newProductAssignmentData,
          };
        }
        selectedProductData.push({ ...newProductData });
      } else {
        selectedProductData.push({ ...productData });
      }
    });
    newProductStore.selectedProductData = [...selectedProductData];
    this.props.dispatch({
      type: 'MUTATE_PRODUCTSTORE_ROOT',
      payload: newProductStore,
    });
    categoryData?.map((singleMenu, categoryIndex) => {
      let showSubCategory =
        singleMenu.SubCategoryInfolst != null &&
        singleMenu.SubCategoryInfolst.length > 1 &&
        singleMenu.IsSubCategory === true;
      if (
        singleCartData.CategoryId == singleMenu.CategoryId &&
        !singleMenu.IsSubCategory
      ) {
        this.props.setCurrentSelectedCategoryDispatch({
          category: singleMenu,
          subCategory: singleMenu.SubCategoryInfolst[0],
          isSubCategory: false,
          priceDetails: singleMenu.priceDetails,
          categoryIndex,
        });
        topLevelNavigate('menuIndex', {
          category: singleMenu,
          subCategory: singleMenu.SubCategoryInfolst[0],
          isSubCategory: false,
          categoryIndex,
          IsRedeem: singleCartData.IsRedeem,
          cartId: singleCartData.CartIdId,
          size: singleCartData.SizeName,
        });
      } else if (
        singleCartData.CategoryId == singleMenu.CategoryId &&
        singleMenu.IsSubCategory
      ) {
        singleMenu.SubCategoryInfolst.map(
          (singleSubCategory, subCategoryIndex) => {
            if (
              singleCartData.SubCategoryId == singleSubCategory.SubCategoryId
            ) {
              this.props.setCurrentSelectedCategoryDispatch({
                category: singleMenu,
                subCategory: singleSubCategory,
                categoryIndex,
                subCategoryIndex,
                isSubCategory: true,
                priceDetails: singleMenu.priceDetails,
                isSixPack: false,
              });
              topLevelNavigate('menuIndex', {
                category: singleMenu,
                subCategory: singleSubCategory,
                isSubCategory: true,
                priceDetails: singleMenu.priceDetails,
                isSixPack: false,
                cartId: singleCartData.CartIdId,
                size: singleCartData.SizeName,
              });
            }
          },
        );
      }
    });
  };

  getCardData = () => {
    const { userDetails } = this.props.userstore;
    this.props.fetchCartData(GetCartDataResponse => {
      this.setState({ spinner: true }, async () => {
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
            (SubTotalprice += cartData.OrderPrice),
              (cartId = cartData.CartIdId);
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
          let Taxprice = (
            parseFloat(SubTotalprice - Discount) * 0.08625
          ).toFixed(2);
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
          this.setState({ spinner: false });
        }
      });
    });
  };

  deleteCartById = async cartId => {
    this.Is5hourOrder = false;
    this.setState({ pickupTime: 'Pickup Time' });
    const deleteCartResponse = await deleteCart(cartId);
    if (deleteCartResponse.result === true) {
      this.getCardData();
      this.showTimeSlot();
      Vibration.vibrate();
    } else {
      console.log('getting error on the cart value-------');
    }
  };

  updateCartForFavoriteItems = async cartId => {
    const { userDetails, authToken } = this.props.userstore;
    this.setState({ userDetails: userDetails, authToken: authToken });
    let body = {};

    this.state.userCartData.map(singleCartData => {
      if (cartId == singleCartData.CartIdId) {
        body.CartId = singleCartData.CartIdId;
        body.IsFavourite = !singleCartData.IsFavourite;
        body.Quantity = singleCartData.Quantity;
        body.OrderPrice = singleCartData.OrderPrice;
        this.setState({ IsFavourite: !this.state.IsFavourite });
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

  updateCartForIncreaseQuantity = async cartId => {
    const { userDetails, authToken } = this.props.userstore;
    this.setState({ userDetails: userDetails, authToken: authToken });

    let body = {};

    this.state.userCartData.map(singleCartData => {
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

  updateCartForDecreaseQuantity = async cartId => {
    const { userDetails, authToken } = this.props.userstore;
    this.setState({ userDetails: userDetails, authToken: authToken });

    let body = {};
    let currentQuantity = 0;
    this.state.userCartData.map(singleCartData => {
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

  pickName = name => {
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
      let extracted = `${singleDate.getHours() > 12
        ? singleDate.getHours() - 12
        : singleDate.getHours() == 0
          ? 12
          : singleDate.getHours()
        } : ${singleDate.getMinutes() < 10
          ? '0' + singleDate.getMinutes()
          : singleDate.getMinutes()
        } ${singleDate.getHours() >= 12 ? 'PM' : 'AM'}`;
      ShowDate.push({
        label: extracted,
        value: extracted,
      });
    });
    this.setState({ dateArray: [...ShowDate] });
  };

  phoneNoWithDash = phoneNo => {
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
    const { userDetails, isUserLoggedIn } = this.props.userstore;
    const { dateArray, spinner } = this.state;
    return (
      <View style={styles.container}>
        <Spinner visible={spinner} size="large" color="#793422" />
        <View style={Platform.OS == 'android' ? styles.DropDownView_A : styles.DropDownView_I}>
          <DropDownPicker
            items={dateArray}
            scrollViewProps={{
              style: { zIndex: 5000 },
              showsVerticalScrollIndicator: false,
            }}
            placeholder="Pickup Time"
            arrowColor={'#ADA7A5'}
            placeholderStyle={styles.DropDownText}
            itemStyle={styles.DropDownText}
            labelStyle={styles.DropDownText}
            containerStyle={{ height: Platform.OS === 'ios' ? 38 : 38 }}
            dropDownMaxHeight={250}
            style={styles.DropDownStyle}
            dropDownStyle={styles.DropDownStyle}
            onChangeItem={item => this.setState({ pickupTime: item.value })}
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{
                width: 30,
                margin: 10,
              }}
              onPress={() => this.props.navigation.navigate('RootHome')}>
              <FastImage source={leftArrow} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ justifyContent: 'center', marginEnd: 10 }}>
                <Text style={styles.RewardText}>
                  {userDetails.LeftRewardPoints == null
                    ? 0
                    : userDetails.LeftRewardPoints}
                </Text>
              </View>
              <FastImage source={snow} style={styles.snowPic} />
            </View>
          </View>
          <View>
            <Text style={styles.HeadingText}>
              {`Review Order (${this.props.getCartStore.cartData.TotalQuantity})`}
            </Text>
          </View>
          <View style={styles.HeaderSeperator} />
          <View style={styles.TextView}>
            <View style={{ marginStart: 10, width: '50%' }}>
              <TextInput
                style={styles.TextInputStyle}
                placeholder={'Pickup name'}
                placeholderTextColor={'#ADA7A5'}
                underlineColorAndroid={'#ADA7A5'}
                allowFontScaling={false}
                fontScale={1}
                value={this.state.pickupName}
                onChangeText={name => {
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
          <View style={{ marginStart: 20, width: '50%' }}>
            <TextInput
              style={styles.TextInputStyle}
              placeholder={'Pickup number'}
              placeholderTextColor={'#ADA7A5'}
              underlineColorAndroid={'#ADA7A5'}
              value={this.phoneNoWithDash(this.state.pickupNumber)}
              onChangeText={number => {
                this.setState({ pickupNumber: this.phoneNoWithDash(number) });
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
                this.state.userCartData.map((singleCartData, cartIndex) => {
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
                    <View key={cartIndex} style={styles.cardView}>
                      <View style={styles.cardSubView}>
                        <View>
                          <FastImage
                            style={{ height: 40, width: 40, marginTop: 5 }}
                            source={{
                              uri: `${HostURL}${singleCartData.LogoUrl}`,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: '67%',
                            paddingStart: 10,
                          }}>
                          <Text style={styles.categoryText}>
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
                                      <Text key={index} style={styles.subHeadingText}>
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
                                    <Text key={index} style={styles.subHeadingText}>
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
                            <Text style={styles.RewardPointText}>
                              {singleCartData.RewardPoints}
                            </Text>
                            <FastImage source={snow} style={styles.RewardImg} />
                            <Text style={styles.RewardPointText}>item</Text>
                          </View>
                          {
                            <View
                              style={{
                                flexDirection: 'row',
                                height: 30,
                                marginVertical: 10,
                              }}>
                              {singleCartData.IsRedeem != true ? (
                                <>
                                  <TouchableOpacity
                                    style={{
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
                                      marginStart: 20,
                                    }}
                                    onPress={() =>
                                      this.updateCartForIncreaseQuantity(
                                        singleCartData.CartIdId,
                                      )
                                    }>
                                    <FastImage
                                      source={Add_Item}
                                      style={{ height: 30, width: 30 }}
                                    />
                                  </TouchableOpacity>
                                </>
                              ) : null}
                              <TouchableOpacity
                                style={{
                                  width: 30,
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

                              <TouchableOpacity
                                style={{
                                  height: 30,
                                  marginStart: 15,
                                  justifyContent: 'center',
                                }}
                                onPress={() =>
                                  this.handleCartEdit(singleCartData, cartIndex)
                                }>
                                <Text style={styles.changeItem}>Edit Item</Text>
                              </TouchableOpacity>
                            </View>
                          }
                        </View>
                        <View style={{ width: 65 }}>
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
                  <Text style={styles.EmptyCartText}>
                    Start your next order
                  </Text>
                  <Text style={styles.EmptyCartSubText}>
                    {`As you add menu items, they'll appear here.\nYou'll have a chance to review before placing your order.`}
                  </Text>
                  <TouchableOpacity
                    style={styles.EmptyCartBtnTouch}

                    onPress={() => {
                      this.props.navigation.goBack();
                      setTimeout(() => {
                        navigateTopTabRef('Menu');
                      }, 150);
                    }}>

                    <View style={styles.EmptyCartBtnView}>
                      <Text style={styles.EmptyCartBtnText}>Add Item</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </>
        ) : null}

        {this.state.userCartData.length > 0 ? (
          <View style={styles.checkoutButtonView}>
            <TouchableOpacity
              onPress={() => this.Show_Custom_Alert()}
              disabled={this.state.userCartData.length < 1}
              style={styles.checkoutButtonTouch}>
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
  checkoutButtonView: {
    position: 'absolute',
    right: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
  checkoutButtonTouch: {
    backgroundColor: '#793422',
    justifyContent: 'center',
    borderRadius: 50,
    height: 46,
    width: '30%',
    alignSelf: 'flex-end',
    marginLeft: 30,
  },
  changeItem: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
    color: '#793422',
  },
  DropDownText: {
    color: '#ADA7A5',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
  },
  DropDownStyle: {
    backgroundColor: '#2D2926',
    borderColor: '#2D2926',
  },
  DropDownView_A: {
    width: '40%',
    height: 270,
    position: 'absolute',
    zIndex: 5000,
    right: 15,
    top: 88,
  },
  DropDownView_I: {
    width: '40%',
    position: 'absolute',
    zIndex: 5000,
    right: 15,
    top: 88,
  },
  RewardText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    textAlign: 'center',
  },
  snowPic: {
    height: 15,
    width: 15,
    marginTop: 16,
    marginEnd: 20,
    marginLeft: -5,
  },
  HeadingText: {
    fontSize: 27,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginStart: 20,
  },
  HeaderSeperator: {
    borderColor: '#666461',
    borderWidth: 0.5,
    width: '90%',
    alignSelf: 'center',
    marginTop: 5,
  },
  TextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '94%',
    marginStart: 10,
  },
  TextInputStyle: {
    color: '#ADA7A5',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    marginTop: Platform.OS === 'ios' ? 10 : -5,
    borderColor: '#ADA7A5',
  },
  cardView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  cardSubView: {
    flexDirection: 'row',
    width: '97%',
    margin: 10,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
    justifyContent: 'space-around',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold',
    color: '#414040',
  },
  RewardPointText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
    color: '#505755',
  },
  RewardImg: {
    height: 10,
    width: 10,
    alignSelf: 'center',
    marginLeft: 3,
    marginRight: 5,
    marginTop: 2,
  },
  EmptyCartText: {
    color: '#793422',
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    fontWeight: 'bold',
    marginLeft: 15,
  },
  EmptyCartSubText: {
    color: '#262A29',
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    marginLeft: 15,
    marginTop: 10,
  },
  EmptyCartBtnTouch: {
    height: 50,
    width: 150,
    backgroundColor: '#793422',
    borderRadius: 25,
    marginLeft: 15,
    marginTop: 15,
    justifyContent: 'center',
  },
  EmptyCartBtnView: {
    height: 50,
    width: 150,
    backgroundColor: '#793422',
    borderRadius: 25,
    justifyContent: 'center',
  },
  EmptyCartBtnText: {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'OpenSans-SemiBold',
    color: '#FFF',
  },
});

const mapStateToProps = state => {
  return {
    reduxState: state,
    productstore: state.productstore,
    categoryStore: state.categoryStore,
    userstore: state.userstore,
    getCartStore: state.getCartStore,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    fetchCartData: cb => {
      dispatch(fetchCartDataAsyncCreator(cb));
    },
    setCurrentSelectedCategoryDispatch: categoryData => {
      dispatch(setCurrentSelectedCategory(categoryData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewOrder);
