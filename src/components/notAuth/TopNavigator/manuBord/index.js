import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
  Dimensions,
  Vibration,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Collapsible from 'react-native-collapsible';
import SwitchToggle from 'react-native-switch-toggle';
import cross from '../../../../assets/icon/cross1.png';
import { resetProductReciepe } from '@redux';
import { connect } from 'react-redux';
import nextArrow from '../../../../assets/icon/order/icons8-forward-26.png';
import cart1 from '../../../../assets/icon/order/cart1.png';
import cart2 from '../../../../assets/icon/order/cart2.png';
import { fetchCartDataAsyncCreator } from '@redux/getcart.js';
import { GetCategorySize, addCart, HostURL, editCart } from '@api';
import index from '../../giftCard';
import FastImage from 'react-native-fast-image';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Calender from '../../../../assets/icon/order/calender.png';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

SimpleLineIcon.loadFont();
MaterialIcon.loadFont();

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

TextInput.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

const AdditionalInsCupData = [
  {
    instruction: 'In bigger cup',
  },
  {
    instruction: 'Nut Allergy',
  },
  {
    instruction: 'Side by side',
  },
];

const AdditionalInsPerfaitData = [
  {
    instruction: 'In bigger cup',
  },
  {
    instruction: 'Nut Allergy',
  },
  {
    instruction: 'Side by side',
  },
];

const AdditionalInsConesData = [
  {
    instruction: 'Flip Over',
  },
  {
    instruction: 'Nut Allergy',
  },
];

const AdditionalInsNippersData = [
  {
    instruction: 'Nut Allergy',
  },
  {
    instruction: 'Side by side',
  },
];

const AdditionalInsPQData = [
  {
    instruction: 'Nut Allergy',
  },
  {
    instruction: 'Side by side',
  },
];

const AdditionalInsOtherData = [
  {
    instruction: 'Nut Allergy',
  },
];

class SelectProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      IsCandle: false,
      IsWippedCream: false,
      categorySize: [],
      selectedSize: {},
      categoryItemPriceData: [],
      selectedPrice: [],
      userDetails: {},
      composeSelectedProduct: [],
      authToken: '',
      userCartData: [],
      comment: '',
      customDate: '',
      IsRedeem: this.props.navigation?.getParam('IsRedeem')? this.props.navigation?.getParam('IsRedeem') : false,
      IsLayered: false,
      IsCalender: false,
      adding: false,
      additionalInstruction: [],
      cartId: this.props.navigation?.getParam('cartId'),
    };
  }

  hideDatePicker = () => {
    if (this.state.IsCalender) {
      this.setState({
        IsCalender: false,
      });
    }
  };

  handleConfirm = (selectedDate) => {
    this.hideDatePicker();
    const currentDate = selectedDate;
    let value = '';
    value = moment(currentDate).format('MM/DD/YYYY hh:mm a');
    this.setState({
      customDate: value,
    });
  };

  HandleCandles = () => {
    const { IsCandle } = this.state;
    if (IsCandle === true) {
      this.setState({
        IsCandle: false,
      });
    } else {
      this.setState({
        IsCandle: true,
      });
    }
  };

  HandleWhippedCream = () => {
    const { IsWippedCream } = this.state;
    if (IsWippedCream === true) {
      this.setState({
        IsWippedCream: false,
      });
    } else {
      this.setState({
        IsWippedCream: true,
      });
    }
  };

  toggleExpanded = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed });
  };

  componentDidMount = async () => {
    const { userDetails, authToken } = this.props.userstore;
    this.setState({ userDetails: userDetails, authToken: authToken });
    const selectedSubCategoryId = this.props?.categorystore.selectedCategory
      .subCategory.SubCategoryId;
    this.GetCategorySizeData(selectedSubCategoryId);
    this.setState({
      IsRedeem: this.props.navigation?.getParam('IsRedeem'),
    });
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.GetCategorySizeData(selectedSubCategoryId);
    });
  };

  GetCategorySizeData = async (selectedSubCategoryId) => {
    const GetCategorySizeDetailsResponse = await GetCategorySize(
      selectedSubCategoryId,
    );
    if (GetCategorySizeDetailsResponse.result === true) {
      var categorySize = GetCategorySizeDetailsResponse.response;
    }
    this.setState({ categorySize });
    GetCategorySizeDetailsResponse.response.map((singleCategorySize) => {
      if (
        singleCategorySize.SizeName === 'Mini' &&
        this.state.IsRedeem == true
      ) {
        this.setState({
          selectedSize: singleCategorySize,
          collapsed: true,
        });
      }
      if(this.props.navigation.getParam('size') && singleCategorySize.SizeName == this.props.navigation.getParam('size')){
        this.setState({
          selectedSize: singleCategorySize,
          collapsed: true,
        });
      }
    });
  };

  getSelectedPriceDetailsWithPrice = () => {
    const { selectedSize } = this.state;
    const { selectedCategory } = this.props?.categorystore;
    return selectedCategory.priceDetails.find((singlePriceDetails, index) => {
      if (selectedCategory.subCategory.IsSize) {
        if (singlePriceDetails.SizeId === selectedSize.SizeId) {
          return singlePriceDetails;
        }
      } else {
        if (
          selectedCategory.subCategory.SubCategoryId ===
          singlePriceDetails.SubCategoryId
        ) {
          return singlePriceDetails;
        }
      }
    });
  };

  handleResetReciepe = () => {
    const { selectedSize, userDetails } = this.state;
    const { selectedCategory } = this.props?.categorystore;
    const { selectedProductData } = this.props?.productstore;

    let { sixPackData } = this.props.sixPackStore;
    let sixPackMutateIndex = 0;
    if (selectedCategory.isSixPack) {
      let sixPackLogicContainer = sixPackData.find((single, index) => {
        sixPackMutateIndex = index;
        return (
          single.Category.CategoryId === selectedCategory.category.CategoryId &&
          single.SubCategory.SubCategoryId ==
          selectedCategory.subCategory.SubCategoryId
        );
      });
      let { Products } = sixPackLogicContainer;

      for (let productTopLevelKeys in Products) {
        for (
          let productMiddleLevelKeys = 0;
          productMiddleLevelKeys < Products[productTopLevelKeys].length;
          productMiddleLevelKeys++
        ) {
          Products[productTopLevelKeys][productMiddleLevelKeys].products = [];
        }
      }

      sixPackLogicContainer.Products = Products;
      sixPackLogicContainer.isEditMode = false;
      sixPackData[sixPackMutateIndex] = { ...sixPackLogicContainer };
      this.setState({
        selectedSize: {},
        comment: '',
        IsCandle: false,
        IsWippedCream: false,
        IsLayered: false,
        IsRedeem: false,
      });
      return this.props.mutateSixPackStore('MUTATE', {
        ready: true,
        sixPackData,
      });
    }
    const updatedSelectedProductData = selectedProductData.map(
      (singleProduct) => {
        if (selectedCategory.category.CategoryId === singleProduct.CategoryId) {
          if (selectedCategory.isSubCategory) {
            const updatedSubCategoryData = singleProduct.subCategoryData.map(
              (singleSubCategory) => {
                if (
                  singleSubCategory.SubCategoryId ===
                  selectedCategory.subCategory.SubCategoryId
                ) {
                  return {
                    ...singleSubCategory,
                    isEditMode: false,
                    flavours: [],
                    bottomflavours: [],
                    middleflavours: [],
                    topflavours: [],
                    toppings: [],
                    bottomTopping: [],
                    middleTopping: [],
                    topTopping: [],
                    sideTopping: [],
                  };
                } else {
                  return singleSubCategory;
                }
              },
            );
            return {
              ...singleProduct,
              subCategoryData: updatedSubCategoryData,
            };
          } else {
            return Object.assign(singleProduct, {
              isEditMode: false,
              flavours: [],
              bottomflavours: [],
              middleflavours: [],
              topflavours: [],
              toppings: [],
              bottomTopping: [],
              middleTopping: [],
              topTopping: [],
              sideTopping: [],
            });
          }
        } else {
          return singleProduct;
        }
      },
    );
    this.props.resetProductReciepeDispatch(updatedSelectedProductData);
    this.setState({
      selectedSize: {},
      comment: '',
      IsCandle: false,
      IsWippedCream: false,
      IsLayered: false,
      IsRedeem: false,
      additionalInstruction: [],
      customDate: '',
    });
    setTimeout(() => {
      this.forceUpdate();
    }, 300);
  };

  addToCartPhase1 = () => {
    let { selectedCategory } = this.props?.categorystore;
    let { selectedProductData } = this.props?.productstore;
    if (selectedCategory?.subCategory.SubCategoryName == 'Cups') {
      let replicateContent = [
        { toppings: selectedCategory?.subCategory?.IsTopping },
        { bottomTopping: selectedCategory?.subCategory?.IsBottomTopping },
        { middleTopping: selectedCategory?.subCategory?.IsMiddleTopping },
        { topTopping: selectedCategory?.subCategory?.IsTopTopping },
        { sideTopping: selectedCategory?.subCategory?.IsSideTopping },
      ];
      let { categoryIndex } = selectedCategory;
      let isLayerItIndexNumber = 0;
      let currentSelectedProduct = selectedProductData[categoryIndex];
      for (index in currentSelectedProduct) {
        let lowerCaseIndex = index.toLowerCase();
        if (lowerCaseIndex.indexOf('topping') > -1) {
          isLayerItIndexNumber +=
            currentSelectedProduct[index].length > 0 ? 1 : 0;
        }
      }
      if (isLayerItIndexNumber == 1) {
        Alert.alert('Message', 'Would you like to layer it? ', [
          {
            text: 'No',
            onPress: () => {
              this.addToCart();
            },
          },
          {
            text: 'Yes',
            onPress: () => {
              this.setState({
                IsLayered: true,
              });
              setTimeout(() => {
                this.addToCart();
              }, 500);
            },
          },
        ]);
      } else if (isLayerItIndexNumber == 0) {
        Alert.alert(
          'Message',
          'Would you like to add any topping? ',
          [
            {
              text: 'No',
              onPress: () => {
                this.addToCart();
              },
            },
            {
              text: 'Yes',
              onPress: () => { },
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      } else {
        this.addToCart();
      }
    } else if (selectedCategory?.category.CategoryName == 'Cones') {
      let { categoryIndex } = selectedCategory;
      let isLayerItIndexNumber = 0;
      let subCategoryIndex =
        selectedCategory?.subCategory?.SubCategoryName == 'Wafer' ? 0 : 1;
      let currentSelectedProduct =
        selectedProductData[categoryIndex].subCategoryData[subCategoryIndex];
      for (index in currentSelectedProduct) {
        let lowerCaseIndex = index.toLowerCase();
        if (lowerCaseIndex.indexOf('toppings') > -1) {
          isLayerItIndexNumber +=
            currentSelectedProduct[index].length > 0 ? 1 : 0;
        }
      }
      if (isLayerItIndexNumber == 0) {
        Alert.alert(
          'Message',
          'Would you like to add any topping? ',
          [
            {
              text: 'No',
              onPress: () => {
                this.addToCart();
              },
            },
            {
              text: 'Yes',
              onPress: () => { },
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      } else {
        this.addToCart();
      }
    } else if (
      (selectedCategory?.subCategory.SubCategoryName === 'Custom Cakes' ||
        selectedCategory?.subCategory.SubCategoryName === 'Custom Pies') &&
      this.state.customDate == ''
    ) {
      Alert.alert('Message', 'Please select a pickup date');
      return false;
    } else if (
      (selectedCategory?.category.CategoryName === 'Cakes' ||
        selectedCategory?.category.CategoryName === 'Pies') &&
      !this.state.IsCandle
    ) {
      Alert.alert('Message', 'Would you like candles? ', [
        {
          text: 'No',
          onPress: () => {
            this.addToCart();
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            this.setState({
              IsCandle: true,
            });
            setTimeout(() => {
              this.addToCart();
            }, 500);
          },
        },
      ]);
    } else {
      return this.addToCart();
    }
  };

  addToCart = async () => {
    const { selectedSize, userDetails, additionalInstruction } = this.state;
    const { selectedCategory } = this.props?.categorystore;
    const { selectedProductData } = this.props?.productstore;

    const { sixPackData } = this.props.sixPackStore;
    const sendBody = [];
    const body = {};
    let insData = '';
    additionalInstruction.map((ins, insIndex) => {
      insData += `${ins?.insData.instruction}, `;
    });
    let EditMode = false
    body.Email = userDetails.Email || '';
    body.CategoryId = selectedCategory.category.CategoryId || '';
    body.CategoryName = selectedCategory.category.CategoryName || '';
    body.SubCategoryId = selectedCategory.subCategory.SubCategoryId || '';
    body.SubCategoryName = selectedCategory.subCategory.SubCategoryName || '';
    body.TopFlavor = '';
    body.TopFlavorName = '';
    body.MiddleFlavor = '';
    body.MiddleFlavorName = '';
    body.BottomFlavor = '';
    body.BottomFlavorName = '';
    body.Flavor = '';
    body.FlavorName = '';
    body.Topping = '';
    body.ToppingName = '';
    body.MiddleTopping = '';
    body.MiddleToppingName = '';
    body.SideTopping = '';
    body.SideToppingName = '';
    body.TopTopping = '';
    body.TopToppingName = '';
    body.BottomTopping = '';
    body.BottomToppingName = '';
    body.IsCandle = this.state.IsCandle;
    body.IsWippedCream = this.state.IsWippedCream;
    body.IsRedeem = this.state.IsRedeem;
    body.Quantity = 1;
    body.SizeId = '';
    body.CustomDate = this.state.customDate;
    body.Comment = `${this.state.comment} ${insData}`;
    body.OrderPrice = 0;
    body.IsLayered = this.state.IsLayered;

    if (selectedCategory.isSixPack) {
      const onTheFlyFields = {
        flavours: {
          bodyField: 'Flavor',
          bodyFieldName: 'FlavorName',
          isExec: 'IsFlavor',
        },
        bottomFlavor: {
          bodyField: 'BottomFlavor',
          bodyFieldName: 'BottomFlavorName',
          isExec: 'IsBottomFlavor',
        },
        middleFlavor: {
          isExec: 'IsMiddleFlavor',
          bodyField: 'MiddleFlavor',
          bodyFieldName: 'MiddleFlavorName',
        },
        topFlavor: {
          isExec: 'IsTopFlavor',
          bodyField: 'TopFlavor',
          bodyFieldName: 'TopFlavorName',
        },
        toppings: {
          isExec: 'IsTopping',
          bodyField: 'Topping',
          bodyFieldName: 'ToppingName',
        },
        bottomTopping: {
          isExec: 'IsBottomTopping',
          bodyField: 'BottomTopping',
          bodyFieldName: 'BottomToppingName',
        },
        middleTopping: {
          isExec: 'IsMiddleTopping',
          bodyField: 'MiddleTopping',
          bodyFieldName: 'MiddleToppingName',
        },
        topTopping: {
          isExec: 'IsTopTopping',
          bodyField: 'TopTopping',
          bodyFieldName: 'TopToppingName',
        },
        sideTopping: {
          isExec: 'IsSideTopping',
          bodyField: 'SideTopping',
          bodyFieldName: 'SideToppingName',
        },
      };
      let sixPackLogicContainer = sixPackData.find((single, index) => {
        return (
          single.Category.CategoryId === selectedCategory.category.CategoryId &&
          single.SubCategory.SubCategoryId ==
          selectedCategory.subCategory.SubCategoryId
        );
      });
      //Six Pack Body Compose Starts here
      const selectedPriceData = this.getSelectedPriceDetailsWithPrice();
      let bodyToBeAppend = {};
      const { Products: sixPackSelectedProduct } = sixPackLogicContainer;
      let isAllFlavorSelected = 1;
      for (let sixPackReduxIndex in sixPackSelectedProduct) {
        let isProductType = sixPackReduxIndex.toLowerCase().indexOf('topping');
        let currentSixPackProduct = sixPackSelectedProduct[sixPackReduxIndex];
        let onTheFlyData = onTheFlyFields[sixPackReduxIndex];
        if (selectedCategory.subCategory[onTheFlyData.isExec]) {
          let computeBodyFields = currentSixPackProduct.map(
            (singleCurrent, index) => {
              let bodyField = {};
              bodyField.type = singleCurrent.type;
              bodyField.products = singleCurrent.products.map(
                (singleProduct, indexProduct) => {
                  return isProductType > -1
                    ? singleProduct.ToppingId
                    : singleProduct.FlavorId;
                },
              );
              bodyField.products = bodyField.products.join(',');
              if (isAllFlavorSelected == 1) {
                if (sixPackReduxIndex === 'flavours') {
                  if (bodyField.products === '') {
                    isAllFlavorSelected = 0;
                  }
                }
              }
              return bodyField;
            },
          );

          let computeBodyFieldName = currentSixPackProduct.map(
            (singleCurrent, index) => {
              let bodyField = {};
              bodyField.type = singleCurrent.type;
              bodyField.products = singleCurrent.products.map(
                (singleProduct, indexProduct) => {
                  return isProductType > -1
                    ? singleProduct.ToppingName
                    : singleProduct.FlavorName;
                },
              );
              bodyField.products = bodyField.products.join(',');

              return bodyField;
            },
          );

          bodyToBeAppend[onTheFlyData.bodyField] = JSON.stringify(
            computeBodyFields,
          );
          bodyToBeAppend[onTheFlyData.bodyFieldName] = JSON.stringify(
            computeBodyFieldName,
          );
        }
      }
      let updatedBodyAfterAppendData = { ...body, ...bodyToBeAppend };
      updatedBodyAfterAppendData.isSixPack = true;
      updatedBodyAfterAppendData.IsCandle = this.state.IsCandle;
      updatedBodyAfterAppendData.IsWippedCream = this.state.IsWippedCream;
      updatedBodyAfterAppendData.OrderPrice = selectedPriceData.SizePrice;

      if (isAllFlavorSelected == 0) {
        Alert.alert('Message', 'Please select all flavors');
        return;
      }

      const sixPackAddCartResponse = await addCart(
        [updatedBodyAfterAppendData],
        this.state.authToken,
      );
      if (sixPackAddCartResponse.result) {
        this.setState({
          adding: true,
        });
        Vibration.vibrate();
        this.props.fetchCartData();
        setTimeout(() => {
          this.setState({
            adding: false,
          });
        }, 800);
      }
      this.handleResetReciepe();
      return;
    }
    selectedProductData.map((singleProductData, index) => {
      if (
        singleProductData.CategoryId === selectedCategory.category.CategoryId
      ) {
        //For without sub category data
        if (!singleProductData.isSubCategory) {
          if (selectedCategory.subCategory.IsSize) {
            if (Object.keys(selectedSize).length === 0) {
              Alert.alert('Message', 'Select Size');
            } else if (
              selectedCategory.subCategory.IsFlavor &&
              singleProductData.flavours.length === 0
            ) {
              Alert.alert('Message', 'Select Flavor');
            } else if (
              selectedCategory.subCategory.SubCategoryName === 'Sides' &&
              singleProductData.toppings.length === 0
            ) {
              Alert.alert('Message', 'Select Toppings');
            } else {
              const selectedPriceData = this.getSelectedPriceDetailsWithPrice();
              body.CategoryId = selectedCategory.category.CategoryId;
              body.CategoryName = selectedCategory.category.CategoryName;
              body.SubCategoryId = selectedCategory.subCategory.SubCategoryId;
              body.SubCategoryName =
                selectedCategory.subCategory.SubCategoryName;
              body.SizeId = selectedPriceData.SizeId;

              var Price =
                this.state.IsRedeem === true
                  ? 0.0
                  : selectedPriceData.SizePrice;

              if (singleProductData.flavours.length > 0) {
                singleProductData.flavours.map((singleFlavour, index) => {
                  if (singleProductData.flavours.length == 1) {
                    body.Flavor += `${singleFlavour.FlavorId}`;
                    body.FlavorName += `${singleFlavour.FlavorName}`;
                  } else {
                    if (singleProductData.flavours.length - 1 == index) {
                      body.Flavor += `${singleFlavour.FlavorId}`;
                      body.FlavorName += `${singleFlavour.FlavorName}`;
                    } else {
                      body.Flavor += `${singleFlavour.FlavorId}, `;
                      body.FlavorName += `${singleFlavour.FlavorName}, `;
                    }
                  }
                });
              }

              if (singleProductData.bottomflavours.length > 0) {
                singleProductData.bottomflavours.map(
                  (singleBottomFlavour, index) => {
                    if (singleProductData.bottomflavours.length == 1) {
                      body.BottomFlavor += `${singleBottomFlavour.FlavorId}`;
                      body.BottomFlavorName += `${singleBottomFlavour.FlavorName}`;
                    } else {
                      if (
                        singleProductData.bottomflavours.length - 1 ==
                        index
                      ) {
                        body.BottomFlavor += `${singleBottomFlavour.FlavorId}`;
                        body.BottomFlavorName += `${singleBottomFlavour.FlavorName}`;
                      } else {
                        body.BottomFlavor += `${singleBottomFlavour.FlavorId}, `;
                        body.BottomFlavorName += `${singleBottomFlavour.FlavorName}, `;
                      }
                    }
                  },
                );
              }

              if (singleProductData.middleflavours.length > 0) {
                singleProductData.middleflavours.map(
                  (singleMiddleFlavour, index) => {
                    if (singleProductData.middleflavours.length == 1) {
                      body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}`;
                      body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}`;
                    } else {
                      if (
                        singleProductData.middleflavours.length - 1 ==
                        index
                      ) {
                        body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}`;
                        body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}`;
                      } else {
                        body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}, `;
                        body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}, `;
                      }
                    }
                  },
                );
              }

              if (singleProductData.topflavours.length > 0) {
                singleProductData.topflavours.map((singleFlavour, index) => {
                  if (singleProductData.topflavours.length == 1) {
                    body.TopFlavor += `${singleFlavour.FlavorId}`;
                    body.TopFlavorName += `${singleFlavour.FlavorName}`;
                  } else {
                    if (singleProductData.topflavours.length - 1 == index) {
                      body.TopFlavor += `${singleFlavour.FlavorId}`;
                      body.TopFlavorName += `${singleFlavour.FlavorName}`;
                    } else {
                      body.TopFlavor += `${singleFlavour.FlavorId}, `;
                      body.TopFlavorName += `${singleFlavour.FlavorName}, `;
                    }
                  }
                });
              }

              if (singleProductData.toppings.length > 0) {
                singleProductData.toppings.map((singleTopping, index) => {
                  if (singleProductData.toppings.length == 1) {
                    body.Topping += `${singleTopping.ToppingId}`;
                    body.ToppingName += `${singleTopping.ToppingName}`;
                  } else {
                    if (singleProductData.toppings.length - 1 == index) {
                      body.Topping += `${singleTopping.ToppingId}`;
                      body.ToppingName += `${singleTopping.ToppingName}`;
                    } else {
                      body.Topping += `${singleTopping.ToppingId}, `;
                      body.ToppingName += `${singleTopping.ToppingName}, `;
                    }
                  }
                });
                if (selectedCategory.category.CategoryName != 'Cups') {
                  Price += selectedPriceData.ToppingPrice;
                }
              }

              if (singleProductData.middleTopping.length > 0) {
                singleProductData.middleTopping.map(
                  (singlemiddleTopping, index) => {
                    if (singleProductData.middleTopping.length == 1) {
                      body.MiddleTopping += `${singlemiddleTopping.ToppingId}`;
                      body.MiddleToppingName += `${singlemiddleTopping.ToppingName}`;
                    } else {
                      if (singleProductData.middleTopping.length - 1 == index) {
                        body.MiddleTopping += `${singlemiddleTopping.ToppingId}`;
                        body.MiddleToppingName += `${singlemiddleTopping.ToppingName}`;
                      } else {
                        body.MiddleTopping += `${singlemiddleTopping.ToppingId}, `;
                        body.MiddleToppingName += `${singlemiddleTopping.ToppingName}, `;
                      }
                    }
                  },
                );
                if (selectedCategory.category.CategoryName != 'Cups') {
                  Price += selectedPriceData.MiddleToppingPrice;
                }
              }

              if (singleProductData.sideTopping.length > 0) {
                singleProductData.sideTopping.map(
                  (singlesideTopping, index) => {
                    if (singleProductData.sideTopping.length == 1) {
                      body.SideTopping += `${singlesideTopping.ToppingId}`;
                      body.SideToppingName += `${singlesideTopping.ToppingName}`;
                    } else {
                      if (singleProductData.sideTopping.length - 1 == index) {
                        body.SideTopping += `${singlesideTopping.ToppingId}`;
                        body.SideToppingName += `${singlesideTopping.ToppingName}`;
                      } else {
                        body.SideTopping += `${singlesideTopping.ToppingId}, `;
                        body.SideToppingName += `${singlesideTopping.ToppingName}, `;
                      }
                    }
                  },
                );
                if (selectedCategory.category.CategoryName != 'Cups') {
                  Price += selectedPriceData.SideToppingPrice;
                }
              }

              if (singleProductData.topTopping.length > 0) {
                singleProductData.topTopping.map((singletopTopping, index) => {
                  if (singleProductData.topTopping.length == 1) {
                    body.TopTopping += `${singletopTopping.ToppingId}`;
                    body.TopToppingName += `${singletopTopping.ToppingName}`;
                  } else {
                    if (singleProductData.topTopping.length - 1 == index) {
                      body.TopTopping += `${singletopTopping.ToppingId}`;
                      body.TopToppingName += `${singletopTopping.ToppingName}`;
                    } else {
                      body.TopTopping += `${singletopTopping.ToppingId}, `;
                      body.TopToppingName += `${singletopTopping.ToppingName}, `;
                    }
                  }
                });
                if (selectedCategory.category.CategoryName != 'Cups') {
                  Price += selectedPriceData.TopToppingPrice;
                }
              }

              if (singleProductData.bottomTopping.length > 0) {
                singleProductData.bottomTopping.map(
                  (singlebottomTopping, index) => {
                    if (singleProductData.bottomTopping.length == 1) {
                      body.BottomTopping += `${singlebottomTopping.ToppingId}`;
                      body.BottomToppingName += `${singlebottomTopping.ToppingName}`;
                    } else {
                      if (singleProductData.bottomTopping.length - 1 == index) {
                        body.BottomTopping += `${singlebottomTopping.ToppingId}`;
                        body.BottomToppingName += `${singlebottomTopping.ToppingName}`;
                      } else {
                        body.BottomTopping += `${singlebottomTopping.ToppingId}, `;
                        body.BottomToppingName += `${singlebottomTopping.ToppingName}, `;
                      }
                    }
                  },
                );
                if (selectedCategory.category.CategoryName != 'Cups') {
                  Price += selectedPriceData.BottomToppingPrice;
                }
              }

              if (selectedCategory.category.CategoryName === 'Cups') {
                let topLength = singleProductData.topTopping.length;
                let midLength = singleProductData.middleTopping.length;
                let bottomLength = singleProductData.bottomTopping.length;
                if (topLength > 0 && midLength == 0 && bottomLength == 0) {
                  //1

                  Price += selectedPriceData.TopToppingPrice;
                } else if (
                  topLength == 0 &&
                  midLength > 0 &&
                  bottomLength == 0
                ) {
                  //2

                  Price += selectedPriceData.TopToppingPrice;
                } else if (
                  topLength == 0 &&
                  midLength == 0 &&
                  bottomLength > 0
                ) {
                  //3

                  Price += selectedPriceData.TopToppingPrice;
                } else if (
                  topLength > 0 &&
                  midLength > 0 &&
                  bottomLength == 0
                ) {
                  //4

                  Price += selectedPriceData.TopToppingPrice * 2;
                } else if (
                  topLength > 0 &&
                  midLength == 0 &&
                  bottomLength > 0
                ) {
                  //5

                  Price += selectedPriceData.TopToppingPrice * 2;
                } else if (
                  topLength == 0 &&
                  midLength > 0 &&
                  bottomLength > 0
                ) {
                  //6

                  Price += selectedPriceData.TopToppingPrice * 2;
                } else if (
                  topLength > 0 &&
                  midLength == 1 &&
                  bottomLength == 1
                ) {
                  //7

                  Price += selectedPriceData.TopToppingPrice * 2;
                } else if (
                  topLength > 0 &&
                  midLength == 2 &&
                  bottomLength == 1
                ) {
                  //8

                  Price += selectedPriceData.TopToppingPrice * 3;
                } else if (
                  topLength > 0 &&
                  midLength == 1 &&
                  bottomLength == 2
                ) {
                  //9

                  Price += selectedPriceData.TopToppingPrice * 3;
                } else if (
                  topLength > 0 &&
                  midLength == 2 &&
                  bottomLength == 2
                ) {
                  //10

                  Price += selectedPriceData.TopToppingPrice * 3;
                }
                if (this.state.IsLayered === true) {
                  Price += selectedPriceData.TopToppingPrice;
                }
              }
              EditMode = singleProductData?.isEditMode
              body.OrderPrice = Price.toFixed(2);
              sendBody.push(body);
            }
          } else {
            if (
              selectedCategory.subCategory.IsFlavor &&
              singleProductData.flavours.length === 0
            ) {
              Alert.alert('Message', 'Select Flavor');
            } else if (
              selectedCategory.subCategory.SubCategoryName == 'Parfait' &&
              ((selectedCategory.subCategory.IsBottomFlavor == true &&
                singleProductData.bottomflavours.length == 0) ||
                (selectedCategory.subCategory.IsMiddleFlavor == true &&
                  singleProductData.middleflavours.length == 0) ||
                (selectedCategory.subCategory.IsTopFlavor == true &&
                  singleProductData.topflavours.length == 0))
            ) {
              Alert.alert('Message', 'Select all flavors');
            } else {
              const selectedPriceData = this.getSelectedPriceDetailsWithPrice();
              body.CategoryId = selectedCategory.category.CategoryId;
              body.CategoryName = selectedCategory.category.CategoryName;
              body.SubCategoryId = selectedCategory.subCategory.SubCategoryId;
              body.SubCategoryName =
                selectedCategory.subCategory.SubCategoryName;
              body.IsCandle = this.state.IsCandle;
              body.IsWippedCream = this.state.IsWippedCream;

              let Price = selectedPriceData.SizePrice;

              if (singleProductData.flavours.length > 0) {
                singleProductData.flavours.map((singleFlavour, index) => {
                  if (singleProductData.flavours.length == 1) {
                    body.Flavor += `${singleFlavour.FlavorId}`;
                    body.FlavorName += `${singleFlavour.FlavorName}`;
                  } else {
                    if (singleProductData.flavours.length - 1 == index) {
                      body.Flavor += `${singleFlavour.FlavorId}`;
                      body.FlavorName += `${singleFlavour.FlavorName}`;
                    } else {
                      body.Flavor += `${singleFlavour.FlavorId}, `;
                      body.FlavorName += `${singleFlavour.FlavorName}, `;
                    }
                  }
                });
              }

              if (singleProductData.bottomflavours.length > 0) {
                singleProductData.bottomflavours.map(
                  (singleBottomFlavour, index) => {
                    if (singleProductData.bottomflavours.length == 1) {
                      body.BottomFlavor += `${singleBottomFlavour.FlavorId}`;
                      body.BottomFlavorName += `${singleBottomFlavour.FlavorName}`;
                    } else {
                      if (
                        singleProductData.bottomflavours.length - 1 ==
                        index
                      ) {
                        body.BottomFlavor += `${singleBottomFlavour.FlavorId}`;
                        body.BottomFlavorName += `${singleBottomFlavour.FlavorName}`;
                      } else {
                        body.BottomFlavor += `${singleBottomFlavour.FlavorId}, `;
                        body.BottomFlavorName += `${singleBottomFlavour.FlavorName}, `;
                      }
                    }
                  },
                );
              }

              if (singleProductData.middleflavours.length > 0) {
                singleProductData.middleflavours.map(
                  (singleMiddleFlavour, index) => {
                    if (singleProductData.middleflavours.length == 1) {
                      body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}`;
                      body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}`;
                    } else {
                      if (
                        singleProductData.middleflavours.length - 1 ==
                        index
                      ) {
                        body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}`;
                        body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}`;
                      } else {
                        body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}, `;
                        body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}, `;
                      }
                    }
                  },
                );
              }

              if (singleProductData.topflavours.length > 0) {
                singleProductData.topflavours.map((singleFlavour, index) => {
                  if (singleProductData.topflavours.length == 1) {
                    body.TopFlavor += `${singleFlavour.FlavorId}`;
                    body.TopFlavorName += `${singleFlavour.FlavorName}`;
                  } else {
                    if (singleProductData.topflavours.length - 1 == index) {
                      body.TopFlavor += `${singleFlavour.FlavorId}`;
                      body.TopFlavorName += `${singleFlavour.FlavorName}`;
                    } else {
                      body.TopFlavor += `${singleFlavour.FlavorId}, `;
                      body.TopFlavorName += `${singleFlavour.FlavorName}, `;
                    }
                  }
                });
              }

              if (singleProductData.toppings.length > 0) {
                singleProductData.toppings.map((singleTopping, index) => {
                  if (singleProductData.toppings.length == 1) {
                    body.Topping += `${singleTopping.ToppingId}`;
                    body.ToppingName += `${singleTopping.ToppingName}`;
                  } else {
                    if (singleProductData.toppings.length - 1 == index) {
                      body.Topping += `${singleTopping.ToppingId}`;
                      body.ToppingName += `${singleTopping.ToppingName}`;
                    } else {
                      body.Topping += `${singleTopping.ToppingId}, `;
                      body.ToppingName += `${singleTopping.ToppingName}, `;
                    }
                  }
                });
                Price += selectedPriceData.ToppingPrice;
              }

              if (singleProductData.middleTopping.length > 0) {
                singleProductData.middleTopping.map(
                  (singlemiddleTopping, index) => {
                    if (singleProductData.middleTopping.length == 1) {
                      body.MiddleTopping += `${singlemiddleTopping.ToppingId}`;
                      body.MiddleToppingName += `${singlemiddleTopping.ToppingName}`;
                    } else {
                      if (singleProductData.middleTopping.length - 1 == index) {
                        body.MiddleTopping += `${singlemiddleTopping.ToppingId}`;
                        body.MiddleToppingName += `${singlemiddleTopping.ToppingName}`;
                      } else {
                        body.MiddleTopping += `${singlemiddleTopping.ToppingId}, `;
                        body.MiddleToppingName += `${singlemiddleTopping.ToppingName}, `;
                      }
                    }
                  },
                );
                Price += selectedPriceData.MiddleToppingPrice;
              }

              if (singleProductData.sideTopping.length > 0) {
                singleProductData.sideTopping.map(
                  (singlesideTopping, index) => {
                    if (singleProductData.sideTopping.length == 1) {
                      body.SideTopping += `${singlesideTopping.ToppingId}`;
                      body.SideToppingName += `${singlesideTopping.ToppingName}`;
                    } else {
                      if (singleProductData.sideTopping.length - 1 == index) {
                        body.SideTopping += `${singlesideTopping.ToppingId}`;
                        body.SideToppingName += `${singlesideTopping.ToppingName}`;
                      } else {
                        body.SideTopping += `${singlesideTopping.ToppingId}, `;
                        body.SideToppingName += `${singlesideTopping.ToppingName}, `;
                      }
                    }
                  },
                );
                Price += selectedPriceData.SideToppingPrice;
              }

              if (singleProductData.topTopping.length > 0) {
                singleProductData.topTopping.map((singletopTopping, index) => {
                  if (singleProductData.topTopping.length == 1) {
                    body.TopTopping += `${singletopTopping.ToppingId}`;
                    body.TopToppingName += `${singletopTopping.ToppingName}`;
                  } else {
                    if (singleProductData.topTopping.length - 1 == index) {
                      body.TopTopping += `${singletopTopping.ToppingId}`;
                      body.TopToppingName += `${singletopTopping.ToppingName}`;
                    } else {
                      body.TopTopping += `${singletopTopping.ToppingId}, `;
                      body.TopToppingName += `${singletopTopping.ToppingName}, `;
                    }
                  }
                });
                Price += selectedPriceData.TopToppingPrice;
              }

              if (singleProductData.bottomTopping.length > 0) {
                singleProductData.bottomTopping.map(
                  (singlebottomTopping, index) => {
                    if (singleProductData.bottomTopping.length == 1) {
                      body.BottomTopping += `${singlebottomTopping.ToppingId}`;
                      body.BottomToppingName += `${singlebottomTopping.ToppingName}`;
                    } else {
                      if (singleProductData.bottomTopping.length - 1 == index) {
                        body.BottomTopping += `${singlebottomTopping.ToppingId}`;
                        body.BottomToppingName += `${singlebottomTopping.ToppingName}`;
                      } else {
                        body.BottomTopping += `${singlebottomTopping.ToppingId}, `;
                        body.BottomToppingName += `${singlebottomTopping.ToppingName}, `;
                      }
                    }
                  },
                );
                Price += selectedPriceData.BottomToppingPrice;
              }
              EditMode = singleProductData.isEditMode
              body.OrderPrice = Price.toFixed(2);
              sendBody.push(body);
            }
          }
        } else {
          //For Sub-category Data
          singleProductData.subCategoryData.map((singleData, index) => {
            if (
              singleData.SubCategoryId ==
              selectedCategory.subCategory.SubCategoryId
            ) {
              if (selectedCategory.subCategory.IsSize) {
                if (Object.keys(selectedSize).length === 0) {
                  Alert.alert('Message', 'Select Size');
                } else if (
                  selectedCategory.subCategory.SubCategoryName ==
                  'Custom Cakes' &&
                  ((selectedCategory.subCategory.IsBottomFlavor == true &&
                    singleData.bottomflavours.length == 0) ||
                    (selectedCategory.subCategory.IsMiddleFlavor == true &&
                      singleData.middleflavours.length == 0) ||
                    (selectedCategory.subCategory.IsTopFlavor == true &&
                      singleData.topflavours.length == 0) ||
                    (selectedCategory.subCategory.IsTopping == true &&
                      singleData.toppings.length == 0) ||
                    (selectedCategory.subCategory.IsTopTopping == true &&
                      singleData.topTopping.length == 0) ||
                    (selectedCategory.subCategory.IsMiddleTopping == true &&
                      singleData.middleTopping.length == 0) ||
                    (selectedCategory.subCategory.IsBottomTopping == true &&
                      singleData.bottomTopping.length == 0) ||
                    (selectedCategory.subCategory.IsSideTopping == true &&
                      singleData.sideTopping.length == 0))
                ) {
                  Alert.alert('Message', 'Select all flavors and toppings');
                } else if (
                  selectedCategory.subCategory.IsFlavor == true &&
                  singleData.flavours.length === 0
                ) {
                  Alert.alert('Message', 'Select Flavor');
                } else {
                  const selectedPriceData = this.getSelectedPriceDetailsWithPrice();
                  body.CategoryId = selectedCategory.category.CategoryId;
                  body.CategoryName = selectedCategory.category.CategoryName;
                  body.SubCategoryId =
                    selectedCategory.subCategory.SubCategoryId;
                  body.SubCategoryName =
                    selectedCategory.subCategory.SubCategoryName;
                  body.SizeId = selectedPriceData.SizeId;
                  body.IsCandle = this.state.IsCandle;
                  body.IsWippedCream = this.state.IsWippedCream;

                  let Price = selectedPriceData.SizePrice;

                  if (singleData.flavours.length > 0) {
                    singleData.flavours.map((singleFlavour, index) => {
                      if (singleData.flavours.length == 1) {
                        body.Flavor += `${singleFlavour.FlavorId}`;
                        body.FlavorName += `${singleFlavour.FlavorName}`;
                      } else {
                        if (singleData.flavours.length - 1 == index) {
                          body.Flavor += `${singleFlavour.FlavorId}`;
                          body.FlavorName += `${singleFlavour.FlavorName}`;
                        } else {
                          body.Flavor += `${singleFlavour.FlavorId}, `;
                          body.FlavorName += `${singleFlavour.FlavorName}, `;
                        }
                      }
                    });
                  }

                  if (singleData.bottomflavours.length > 0) {
                    singleData.bottomflavours.map(
                      (singleBottomFlavour, index) => {
                        if (singleData.bottomflavours.length == 1) {
                          body.BottomFlavor += `${singleBottomFlavour.FlavorId}`;
                          body.BottomFlavorName += `${singleBottomFlavour.FlavorName}`;
                        } else {
                          if (singleData.bottomflavours.length - 1 == index) {
                            body.BottomFlavor += `${singleBottomFlavour.FlavorId}`;
                            body.BottomFlavorName += `${singleBottomFlavour.FlavorName}`;
                          } else {
                            body.BottomFlavor += `${singleBottomFlavour.FlavorId}, `;
                            body.BottomFlavorName += `${singleBottomFlavour.FlavorName}, `;
                          }
                        }
                      },
                    );
                  }

                  if (singleData.middleflavours.length > 0) {
                    singleData.middleflavours.map(
                      (singleMiddleFlavour, index) => {
                        if (singleData.middleflavours.length == 1) {
                          body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}`;
                          body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}`;
                        } else {
                          if (singleData.middleflavours.length - 1 == index) {
                            body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}`;
                            body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}`;
                          } else {
                            body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}, `;
                            body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}, `;
                          }
                        }
                      },
                    );
                  }

                  if (singleData.topflavours.length > 0) {
                    singleData.topflavours.map((singleFlavour, index) => {
                      if (singleData.topflavours.length == 1) {
                        body.TopFlavor += `${singleFlavour.FlavorId}`;
                        body.TopFlavorName += `${singleFlavour.FlavorName}`;
                      } else {
                        if (singleData.topflavours.length - 1 == index) {
                          body.TopFlavor += `${singleFlavour.FlavorId}`;
                          body.TopFlavorName += `${singleFlavour.FlavorName}`;
                        } else {
                          body.TopFlavor += `${singleFlavour.FlavorId}, `;
                          body.TopFlavorName += `${singleFlavour.FlavorName}, `;
                        }
                      }
                    });
                  }

                  if (singleData.toppings.length > 0) {
                    singleData.toppings.map((singleTopping, index) => {
                      if (singleData.toppings.length == 1) {
                        body.Topping += `${singleTopping.ToppingId}`;
                        body.ToppingName += `${singleTopping.ToppingName}`;
                      } else {
                        if (singleData.toppings.length - 1 == index) {
                          body.Topping += `${singleTopping.ToppingId}`;
                          body.ToppingName += `${singleTopping.ToppingName}`;
                        } else {
                          body.Topping += `${singleTopping.ToppingId}, `;
                          body.ToppingName += `${singleTopping.ToppingName}, `;
                        }
                      }
                    });
                    Price += selectedPriceData.ToppingPrice;
                  }

                  if (singleData.middleTopping.length > 0) {
                    singleData.middleTopping.map(
                      (singlemiddleTopping, index) => {
                        if (singleData.middleTopping.length == 1) {
                          body.MiddleTopping += `${singlemiddleTopping.ToppingId}`;
                          body.MiddleToppingName += `${singlemiddleTopping.ToppingName}`;
                        } else {
                          if (singleData.middleTopping.length - 1 == index) {
                            body.MiddleTopping += `${singlemiddleTopping.ToppingId}`;
                            body.MiddleToppingName += `${singlemiddleTopping.ToppingName}`;
                          } else {
                            body.MiddleTopping += `${singlemiddleTopping.ToppingId}, `;
                            body.MiddleToppingName += `${singlemiddleTopping.ToppingName}, `;
                          }
                        }
                      },
                    );
                    Price += selectedPriceData.MiddleToppingPrice;
                  }
                  if (singleData.sideTopping.length > 0) {
                    singleData.sideTopping.map((singlesideTopping, index) => {
                      if (singleData.sideTopping.length == 1) {
                        body.SideTopping += `${singlesideTopping.ToppingId}`;
                        body.SideToppingName += `${singlesideTopping.ToppingName}`;
                      } else {
                        if (singleData.sideTopping.length - 1 == index) {
                          body.SideTopping += `${singlesideTopping.ToppingId}`;
                          body.SideToppingName += `${singlesideTopping.ToppingName}`;
                        } else {
                          body.SideTopping += `${singlesideTopping.ToppingId}, `;
                          body.SideToppingName += `${singlesideTopping.ToppingName}, `;
                        }
                      }
                    });
                    Price += selectedPriceData.SideToppingPrice;
                  }

                  if (singleData.topTopping.length > 0) {
                    singleData.topTopping.map((singletopTopping, index) => {
                      if (singleData.topTopping.length == 1) {
                        body.TopTopping += `${singletopTopping.ToppingId}`;
                        body.TopToppingName += `${singletopTopping.ToppingName}`;
                      } else {
                        if (singleData.topTopping.length - 1 == index) {
                          body.TopTopping += `${singletopTopping.ToppingId}`;
                          body.TopToppingName += `${singletopTopping.ToppingName}`;
                        } else {
                          body.TopTopping += `${singletopTopping.ToppingId}, `;
                          body.TopToppingName += `${singletopTopping.ToppingName}, `;
                        }
                      }
                    });
                    Price += selectedPriceData.TopToppingPrice;
                  }

                  if (singleData.bottomTopping.length > 0) {
                    singleData.bottomTopping.map(
                      (singlebottomTopping, index) => {
                        if (singleData.bottomTopping.length == 1) {
                          body.BottomTopping += `${singlebottomTopping.ToppingId}`;
                          body.BottomToppingName += `${singlebottomTopping.ToppingName}`;
                        } else {
                          if (singleData.bottomTopping.length - 1 == index) {
                            body.BottomTopping += `${singlebottomTopping.ToppingId}`;
                            body.BottomToppingName += `${singlebottomTopping.ToppingName}`;
                          } else {
                            body.BottomTopping += `${singlebottomTopping.ToppingId}, `;
                            body.BottomToppingName += `${singlebottomTopping.ToppingName}, `;
                          }
                        }
                      },
                    );
                    Price += selectedPriceData.BottomToppingPrice;
                  }
                  if (this.state.IsCandle === true) {
                    Price += 2.99;
                  }
                  EditMode = singleData.isEditMode
                  body.OrderPrice = Price.toFixed(2);
                  sendBody.push(body);
                }
              } else {
                if (
                  selectedCategory.subCategory.IsFlavor == true &&
                  singleData.flavours.length === 0
                ) {
                  Alert.alert('Message', 'Select Flavors');
                } else if (
                  selectedCategory.subCategory.SubCategoryName ==
                  'Custom Pies' &&
                  singleData.toppings.length === 0
                ) {
                  Alert.alert('Message', 'Select Toppings');
                } else {
                  const selectedPriceData = this.getSelectedPriceDetailsWithPrice();
                  body.CategoryId = selectedCategory.category.CategoryId;
                  body.CategoryName = selectedCategory.category.CategoryName;
                  body.SubCategoryId =
                    selectedCategory.subCategory.SubCategoryId;
                  body.SubCategoryName =
                    selectedCategory.subCategory.SubCategoryName;
                  body.IsCandle = this.state.IsCandle;
                  body.IsWippedCream = this.state.IsWippedCream;
                  let Price = selectedPriceData.SizePrice;

                  if (singleData.flavours.length > 0) {
                    singleData.flavours.map((singleFlavour, index) => {
                      if (singleData.flavours.length == 1) {
                        body.Flavor += `${singleFlavour.FlavorId}`;
                        body.FlavorName += `${singleFlavour.FlavorName}`;
                      } else {
                        if (singleData.flavours.length - 1 == index) {
                          body.Flavor += `${singleFlavour.FlavorId}`;
                          body.FlavorName += `${singleFlavour.FlavorName}`;
                        } else {
                          body.Flavor += `${singleFlavour.FlavorId}, `;
                          body.FlavorName += `${singleFlavour.FlavorName}, `;
                        }
                      }
                    });
                  }

                  if (singleData.bottomflavours.length > 0) {
                    singleData.bottomflavours.map(
                      (singleBottomFlavour, index) => {
                        if (singleData.bottomflavours.length == 1) {
                          body.BottomFlavor += `${singleBottomFlavour.FlavorId}`;
                          body.BottomFlavorName += `${singleBottomFlavour.FlavorName}`;
                        } else {
                          if (singleData.bottomflavours.length - 1 == index) {
                            body.BottomFlavor += `${singleBottomFlavour.FlavorId}`;
                            body.BottomFlavorName += `${singleBottomFlavour.FlavorName}`;
                          } else {
                            body.BottomFlavor += `${singleBottomFlavour.FlavorId}, `;
                            body.BottomFlavorName += `${singleBottomFlavour.FlavorName}, `;
                          }
                        }
                      },
                    );
                  }

                  if (singleData.middleflavours.length > 0) {
                    singleData.middleflavours.map(
                      (singleMiddleFlavour, index) => {
                        if (singleData.middleflavours.length == 1) {
                          body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}`;
                          body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}`;
                        } else {
                          if (singleData.middleflavours.length - 1 == index) {
                            body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}`;
                            body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}`;
                          } else {
                            body.MiddleFlavor += `${singleMiddleFlavour.FlavorId}, `;
                            body.MiddleFlavorName += `${singleMiddleFlavour.FlavorName}, `;
                          }
                        }
                      },
                    );
                  }

                  if (singleData.topflavours.length > 0) {
                    singleData.topflavours.map((singleFlavour, index) => {
                      if (singleData.topflavours.length == 1) {
                        body.TopFlavor += `${singleFlavour.FlavorId}`;
                        body.TopFlavorName += `${singleFlavour.FlavorName}`;
                      } else {
                        if (singleData.topflavours.length - 1 == index) {
                          body.TopFlavor += `${singleFlavour.FlavorId}`;
                          body.TopFlavorName += `${singleFlavour.FlavorName}`;
                        } else {
                          body.TopFlavor += `${singleFlavour.FlavorId}, `;
                          body.TopFlavorName += `${singleFlavour.FlavorName}, `;
                        }
                      }
                    });
                  }

                  if (singleData.toppings.length > 0) {
                    singleData.toppings.map((singleTopping, index) => {
                      if (singleData.toppings.length == 1) {
                        body.Topping += `${singleTopping.ToppingId}`;
                        body.ToppingName += `${singleTopping.ToppingName}`;
                      } else {
                        if (singleData.toppings.length - 1 == index) {
                          body.Topping += `${singleTopping.ToppingId}`;
                          body.ToppingName += `${singleTopping.ToppingName}`;
                        } else {
                          body.Topping += `${singleTopping.ToppingId}, `;
                          body.ToppingName += `${singleTopping.ToppingName}, `;
                        }
                      }
                    });
                    Price += selectedPriceData.ToppingPrice;
                  }

                  if (singleData.middleTopping.length > 0) {
                    singleData.middleTopping.map(
                      (singlemiddleTopping, index) => {
                        if (singleData.middleTopping.length == 1) {
                          body.MiddleTopping += `${singlemiddleTopping.ToppingId}`;
                          body.MiddleToppingName += `${singlemiddleTopping.ToppingName}`;
                        } else {
                          if (singleData.middleTopping.length - 1 == index) {
                            body.MiddleTopping += `${singlemiddleTopping.ToppingId}`;
                            body.MiddleToppingName += `${singlemiddleTopping.ToppingName}`;
                          } else {
                            body.MiddleTopping += `${singlemiddleTopping.ToppingId}, `;
                            body.MiddleToppingName += `${singlemiddleTopping.ToppingName}, `;
                          }
                        }
                      },
                    );
                    Price += selectedPriceData.MiddleToppingPrice;
                  }
                  if (singleData.sideTopping.length > 0) {
                    singleData.sideTopping.map((singlesideTopping, index) => {
                      if (singleData.sideTopping.length == 1) {
                        body.SideTopping += `${singlesideTopping.ToppingId}`;
                        body.SideToppingName += `${singlesideTopping.ToppingName}`;
                      } else {
                        if (singleData.sideTopping.length - 1 == index) {
                          body.SideTopping += `${singlesideTopping.ToppingId}`;
                          body.SideToppingName += `${singlesideTopping.ToppingName}`;
                        } else {
                          body.SideTopping += `${singlesideTopping.ToppingId}, `;
                          body.SideToppingName += `${singlesideTopping.ToppingName}, `;
                        }
                      }
                    });
                    Price += selectedPriceData.SideToppingPrice;
                  }

                  if (singleData.topTopping.length > 0) {
                    singleData.topTopping.map((singletopTopping, index) => {
                      if (singleData.topTopping.length == 1) {
                        body.TopTopping += `${singletopTopping.ToppingId}`;
                        body.TopToppingName += `${singletopTopping.ToppingName}`;
                      } else {
                        if (singleData.topTopping.length - 1 == index) {
                          body.TopTopping += `${singletopTopping.ToppingId}`;
                          body.TopToppingName += `${singletopTopping.ToppingName}`;
                        } else {
                          body.TopTopping += `${singletopTopping.ToppingId}, `;
                          body.TopToppingName += `${singletopTopping.ToppingName}, `;
                        }
                      }
                    });
                    Price += selectedPriceData.TopToppingPrice;
                  }

                  if (singleData.bottomTopping.length > 0) {
                    singleData.bottomTopping.map(
                      (singlebottomTopping, index) => {
                        if (singleData.bottomTopping.length == 1) {
                          body.BottomTopping += `${singlebottomTopping.ToppingId}`;
                          body.BottomToppingName += `${singlebottomTopping.ToppingName}`;
                        } else {
                          if (singleData.bottomTopping.length - 1 == index) {
                            body.BottomTopping += `${singlebottomTopping.ToppingId}`;
                            body.BottomToppingName += `${singlebottomTopping.ToppingName}`;
                          } else {
                            body.BottomTopping += `${singlebottomTopping.ToppingId}, `;
                            body.BottomToppingName += `${singlebottomTopping.ToppingName}, `;
                          }
                        }
                      },
                    );
                    Price += selectedPriceData.BottomToppingPrice;
                  }
                  if (this.state.IsCandle === true) {
                    Price += 2.99;
                  }
                  EditMode = singleData.isEditMode
                  body.OrderPrice = Price.toFixed(2);
                  sendBody.push(body);
                }
              }
            }
          });
        }
      }
    });
    if (sendBody.length > 0) {
      if (!EditMode) {
        const addCartResponse = await addCart(sendBody);
        if (addCartResponse.result === true) {
          this.props.fetchCartData();
          this.setState({
            adding: true,
          });
          if (this.state.IsRedeem == true) {
            this.setState({
              IsRedeem: false,
            });
            this.props.navigation.getParam('disabledReedemButton')();
          }
          setTimeout(() => {
            this.handleResetReciepe();
            Vibration.vibrate();
            setTimeout(() => {
              this.setState({
                adding: false,
              });
            }, 2000);
          }, 300);
        } else {
          // Alert.alert(
          //   "Warning",
          //   "Oops something went wrong, please try again later."
          // );
        }
      } else {
        console.log('BODY ----> ',{...sendBody[0], CartId: this.state.cartId})
        let TempBody = {...sendBody[0], CartId: this.state.cartId};
        const editCartResponse = await editCart(TempBody);
        if (editCartResponse.result === true) {
          this.setState({
            adding: true,
          });
          console.log('reponse --> ', editCartResponse.response);
          setTimeout(() => {
            this.props.fetchCartData();
            this.handleResetReciepe();
            Vibration.vibrate();
            setTimeout(() => {
              this.setState({
                adding: false,
              });
            }, 2000);
          }, 300);
        }
      }
    }
  };

  render() {
    const { getParam } = this.props.navigation;
    const {
      CategoryName,
      CategoryId,
      IsTopFlavor,
      DisplayImage,
    } = this.props.navigation.getParam('category');

    const subCategoryData = getParam('subCategory', {});
    const isSubCategory = getParam('isSubCategory', {});
    const { selectedProductData } = this.props?.productstore;

    const { selectedCategory } = this.props?.categorystore;
    
    let isEditMode = false;

    let selectFlavorsForSpecificCategory = [];
    let selectBottomFlavorsForSpecificCategory = [];
    let selectMiddleFlavorsForSpecificCategory = [];
    let selectTopFlavorsForSpecificCategory = [];

    let selectTopTopingsForSpecificCategory = [];
    let selectBottomToppingsForSpecificCategory = [];
    let selectMiddleToppingsForSpecificCategory = [];
    let selectSideToppingsForSpecificCategory = [];
    let selectToppingForSpecificCategory = [];

    if (!selectedCategory?.isSubCategory) {
      let updatedDemo = selectedProductData.find((singleCategory) => {
        if (
          selectedCategory?.category.CategoryId === singleCategory.CategoryId
        ) {
          return true;
        } else {
          return false;
        }
      });
      isEditMode = updatedDemo?.isEditMode;
      selectFlavorsForSpecificCategory = updatedDemo?.flavours;
      selectBottomFlavorsForSpecificCategory = updatedDemo?.bottomflavours;
      selectTopTopingsForSpecificCategory = updatedDemo?.topTopping;
      selectBottomToppingsForSpecificCategory = updatedDemo?.bottomTopping;
      selectMiddleToppingsForSpecificCategory = updatedDemo?.middleTopping;
      selectSideToppingsForSpecificCategory = updatedDemo?.sideTopping;
      selectToppingForSpecificCategory = updatedDemo?.toppings;
      selectMiddleFlavorsForSpecificCategory = updatedDemo?.middleflavours;
      selectTopFlavorsForSpecificCategory = updatedDemo?.topflavours;
    } else {
      let updatedDemo = [];

      selectedProductData.map((singleMap) => {
        if (singleMap.CategoryId === selectedCategory?.category.CategoryId) {
          singleMap.subCategoryData.map((singleSubCategory) => {
            if (
              singleSubCategory.SubCategoryId ===
              selectedCategory.subCategory.SubCategoryId
            ) {
              updatedDemo = singleSubCategory;
            }
          });
        }
      });
      isEditMode = updatedDemo?.isEditMode;
      selectFlavorsForSpecificCategory = updatedDemo.flavours;
      selectBottomFlavorsForSpecificCategory = updatedDemo.bottomflavours;
      selectTopTopingsForSpecificCategory = updatedDemo.topTopping;
      selectBottomToppingsForSpecificCategory = updatedDemo.bottomTopping;
      selectMiddleToppingsForSpecificCategory = updatedDemo.middleTopping;
      selectSideToppingsForSpecificCategory = updatedDemo.sideTopping;
      selectToppingForSpecificCategory = updatedDemo.toppings;
      selectMiddleFlavorsForSpecificCategory = updatedDemo.middleflavours;
      selectTopFlavorsForSpecificCategory = updatedDemo.topflavours;
    }

    const { userDetails, authToken, isUserLoggedIn } = this.props.userstore;
    const { cartData } = this.props.getCartStore;
    const {
      categorySize,
      customDate,
      IsRedeem,
      adding,
      additionalInstruction,
      IsCalender,
    } = this.state;
    return (
      <View style={styles.continer}>
        <DateTimePickerModal
          isVisible={IsCalender}
          mode="datetime"
          minimumDate={new Date()}
          onConfirm={(date) => {
            this.handleConfirm(date);
          }}
          onCancel={() => this.hideDatePicker()}
        />
        <View>
          <FastImage
            source={{uri: `${HostURL}${DisplayImage}`}}
            style={{width: '100%', height: 200}}
            resizeMode="cover">
            <TouchableOpacity
              style={{ width: 30, margin: 10 }}
              onPress={() =>
                IsRedeem == true
                  ? this.props.navigation.navigate('Home')
                  : this.props.navigation.getParam('cartId') ? 
                    (this.handleResetReciepe(),this.props.navigation.navigate('topNav'))
                  :this.props.navigation.navigate('topNav')
              }>
              <FastImage source={cross} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
          </FastImage>
          {IsRedeem === true ? (
            <View>
              <Text style={styles.congratsText}>{'Congratulations!'}</Text>
              <Text style={styles.redeemText}>
                {'Redeem Your Free Mini Now'}
              </Text>
              <Text style={styles.WarningText}>
                {'*Toppings if chosen will be charged additionally'}
              </Text>
            </View>
          ) : null}

          {IsRedeem != true ? (
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.mainContent}>{CategoryName + ' '}</Text>
              {subCategoryData?.SubCategoryName && isSubCategory && (
                <Text
                  style={{
                    margin: 10,
                    fontSize: 20,
                    fontFamily: 'OpenSans-Bold',
                    color: '#414040',
                    marginLeft: -10,
                  }}>
                  ({subCategoryData?.SubCategoryName})
                </Text>
              )}
            </View>
          ) : null}
        </View>
        <View>
          {this.state.categoryItemPriceData.map((singleItemPrice) => {
            {
              var itemPriceArray = [];
              singleItemPrice.FlavorTypeInfolst.map((singleItem) => {
                return (
                  <View>
                    <Text>{singleItem.BottomToppingPrice}</Text>
                  </View>
                );
              });
            }
          })}
        </View>

        <KeyboardAwareScrollView>
          {subCategoryData?.IsSize === true && IsRedeem != true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity onPress={this.toggleExpanded}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.subContent}>Size</Text>

                  <Text
                    style={{
                      color: '#793422',
                      marginRight: 30,
                      margin: 10,
                      fontSize: 13,
                      fontFamily: 'OpenSans-SemiBold',
                    }}>
                    {this.state.selectedSize?.SizeName}
                  </Text>
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={this.state.collapsed} align="center">
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    backgroundColor: '#262A29',
                    width: '94%',
                    alignSelf: 'center',
                    margin: 10,
                  }}>
                  {categorySize.map((singleCategorySize) => {
                    return (
                      <TouchableOpacity
                        style={{
                          margin: 15,
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          borderRadius: 50,
                          backgroundColor:
                            singleCategorySize.SizeName ===
                              this.state.selectedSize?.SizeName
                              ? '#505755'
                              : '#262A29',
                        }}
                        onPress={() => {
                          this.setState({
                            selectedSize: singleCategorySize,
                            collapsed: true,
                          });
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: 'OpenSans-SemiBold',
                            color: '#FFFFFF',
                          }}>
                          {singleCategorySize.SizeName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Collapsible>
            </Fragment>
          ) : null}

          {subCategoryData?.IsFlavor == true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity
                onPress={() => {
                  let navigateParam = selectedCategory?.isSixPack
                    ? 'menuSixPack'
                    : 'menuFlavour';

                  this.props.navigation.navigate(navigateParam, {
                    CategoryId: CategoryId,
                    SubCategoryId: subCategoryData.SubCategoryId,
                    type: 'flavours',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.subContent}>Flavors</Text>

                    {selectFlavorsForSpecificCategory?.map(
                      (singleFlavor, index) => {
                        return (
                          <Text style={styles.subTextContent}>
                            {singleFlavor.FlavorName}
                          </Text>
                        );
                      },
                    )}
                  </View>

                  <FastImage
                    source={nextArrow}
                    style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </Fragment>
          ) : null}

          {subCategoryData?.IsBottomFlavor == true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity
                onPress={() => {
                  let navigateParam = selectedCategory?.isSixPack
                    ? 'menuSixPack'
                    : 'menuBottomFlavour';

                  this.props.navigation.navigate(navigateParam, {
                    CategoryId: CategoryId,
                    SubCategoryId: subCategoryData.SubCategoryId,
                    type: 'bottomFlavor',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.subContent}>Bottom Flavor</Text>

                    {selectBottomFlavorsForSpecificCategory?.map(
                      (singleFlavor, index) => {
                        return (
                          <Text style={styles.subTextContent}>
                            {singleFlavor.FlavorName}
                          </Text>
                        );
                      },
                    )}
                  </View>

                  <FastImage
                    source={nextArrow}
                    style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </Fragment>
          ) : null}

          {subCategoryData?.IsMiddleFlavor == true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity
                onPress={() => {
                  let navigateParam = selectedCategory?.isSixPack
                    ? 'menuSixPack'
                    : 'menuMiddleFlavour';

                  this.props.navigation.navigate(navigateParam, {
                    CategoryId: CategoryId,
                    SubCategoryId: subCategoryData.SubCategoryId,
                    type: 'middleFlavor',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.subContent}>Middle Flavor</Text>

                    {selectMiddleFlavorsForSpecificCategory?.map(
                      (singleFlavor, index) => {
                        return (
                          <Text style={styles.subTextContent}>
                            {singleFlavor.FlavorName}
                          </Text>
                        );
                      },
                    )}
                  </View>

                  <FastImage
                    source={nextArrow}
                    style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </Fragment>
          ) : null}

          {subCategoryData?.IsTopFlavor == true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity
                onPress={() => {
                  let navigateParam = selectedCategory?.isSixPack
                    ? 'menuSixPack'
                    : 'menuTopFlavour';

                  this.props.navigation.navigate(navigateParam, {
                    CategoryId: CategoryId,
                    SubCategoryId: subCategoryData.SubCategoryId,
                    type: 'topFlavor',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.subContent}>Top Flavor</Text>

                    {selectTopFlavorsForSpecificCategory?.map(
                      (singleFlavor, index) => {
                        return (
                          <Text style={styles.subTextContent}>
                            {singleFlavor.FlavorName}
                          </Text>
                        );
                      },
                    )}
                  </View>

                  <FastImage
                    source={nextArrow}
                    style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </Fragment>
          ) : null}

          {subCategoryData?.IsTopping == true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity
                onPress={() => {
                  let navigateParam = selectedCategory?.isSixPack
                    ? 'menuSixPack'
                    : 'menuTopping';

                  this.props.navigation.navigate(navigateParam, {
                    CategoryId: CategoryId,
                    SubCategoryId: subCategoryData.SubCategoryId,
                    type: 'toppings',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.subContent}>Toppings</Text>
                    {selectToppingForSpecificCategory?.map(
                      (singleBottomTopping, index) => {
                        return (
                          <Text style={styles.subTextContent}>
                            {singleBottomTopping.ToppingName}
                          </Text>
                        );
                      },
                    )}
                  </View>

                  <FastImage
                    source={nextArrow}
                    style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </Fragment>
          ) : null}

          {subCategoryData?.IsBottomTopping == true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity
                onPress={() => {
                  let navigateParam = selectedCategory?.isSixPack
                    ? 'menuSixPack'
                    : 'menuBottomTopping';

                  this.props.navigation.navigate(navigateParam, {
                    CategoryId: CategoryId,
                    SubCategoryId: subCategoryData.SubCategoryId,
                    type: 'bottomTopping',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.subContent}>Bottom Toppings</Text>
                    {selectBottomToppingsForSpecificCategory?.map(
                      (singleBottomTopping, index) => {
                        return (
                          <Text style={styles.subTextContent}>
                            {singleBottomTopping.ToppingName}
                          </Text>
                        );
                      },
                    )}
                  </View>

                  <FastImage
                    source={nextArrow}
                    style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </Fragment>
          ) : null}

          {subCategoryData?.IsMiddleTopping == true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity
                onPress={() => {
                  let navigateParam = selectedCategory?.isSixPack
                    ? 'menuSixPack'
                    : 'menuMiddleTopping';

                  this.props.navigation.navigate(navigateParam, {
                    CategoryId: CategoryId,
                    SubCategoryId: subCategoryData.SubCategoryId,
                    type: 'middleTopping',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.subContent}>Middle Toppings</Text>
                    {selectMiddleToppingsForSpecificCategory?.map(
                      (singleBottomTopping, index) => {
                        return (
                          <Text style={styles.subTextContent}>
                            {singleBottomTopping.ToppingName}
                          </Text>
                        );
                      },
                    )}
                  </View>

                  <FastImage
                    source={nextArrow}
                    style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </Fragment>
          ) : null}

          {subCategoryData?.IsTopTopping == true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity
                onPress={() => {
                  let navigateParam = selectedCategory?.isSixPack
                    ? 'menuSixPack'
                    : 'menuTopTopping';

                  this.props.navigation.navigate(navigateParam, {
                    CategoryId: CategoryId,
                    SubCategoryId: subCategoryData.SubCategoryId,
                    type: 'topTopping',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.subContent}>Top Toppings</Text>
                    {selectTopTopingsForSpecificCategory?.map(
                      (singleTopTopping, index) => {
                        return (
                          <Text style={styles.subTextContent}>
                            {singleTopTopping.ToppingName}
                          </Text>
                        );
                      },
                    )}
                  </View>

                  <FastImage
                    source={nextArrow}
                    style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </Fragment>
          ) : null}

          {subCategoryData?.IsSideTopping == true ? (
            <Fragment>
              <View style={styles.borderLine} />
              <TouchableOpacity
                onPress={() => {
                  let navigateParam = selectedCategory?.isSixPack
                    ? 'menuSixPack'
                    : 'menusidetoppings';

                  this.props.navigation.navigate(navigateParam, {
                    CategoryId: CategoryId,
                    SubCategoryId: subCategoryData.SubCategoryId,
                    type: 'sideTopping',
                  });
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={styles.subContent}>Side Topping</Text>
                    {selectSideToppingsForSpecificCategory?.map(
                      (singleSideTopping, index) => {
                        return (
                          <Text style={styles.subTextContent}>
                            {singleSideTopping.ToppingName}
                          </Text>
                        );
                      },
                    )}
                  </View>

                  <FastImage
                    source={nextArrow}
                    style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
                  />
                </View>
              </TouchableOpacity>
            </Fragment>
          ) : null}

          {selectedCategory?.category.CategoryName === 'Cakes' ? (
            <Fragment>
              <View style={styles.borderLine} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.subContent}>Candles</Text>
                <SwitchToggle
                  containerStyle={styles.swithContainerStyle}
                  circleStyle={styles.swithCircleStyle}
                  switchOn={this.state.IsCandle}
                  onPress={() => {
                    this.HandleCandles();
                  }}
                  circleColorOff="white"
                  circleColorOn="#FFFFFF"
                  duration={500}
                  backgroundColorOn="#793422"
                />
              </View>
            </Fragment>
          ) : null}

          {selectedCategory?.category.CategoryName === 'Shakes' ? (
            <Fragment>
              <View style={styles.borderLine} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.subContent}>Whipped Cream</Text>
                <SwitchToggle
                  containerStyle={styles.swithContainerStyle}
                  circleStyle={styles.swithCircleStyle}
                  switchOn={this.state.IsWippedCream}
                  onPress={() => {
                    this.HandleWhippedCream();
                  }}
                  circleColorOff="white"
                  circleColorOn="#FFFFFF"
                  duration={500}
                  backgroundColorOn="#793422"
                />
              </View>
            </Fragment>
          ) : null}

          {/* Calender */}

          {selectedCategory?.category.CategoryName === 'Cakes' ||
            selectedCategory?.category.CategoryName === 'Pies' ? (

            <Fragment>
              <View style={styles.borderLine} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.subContent}>Pickup Date</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      IsCalender: true,
                    });
                  }}>
                  <View>
                    <FastImage
                      source={Calender}
                      style={{ height: 40, width: 40 }}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={styles.subTextContent}>{customDate}</Text>
                </View>
              </View>
            </Fragment>
          ) : null}

          {CategoryName == 'Cakes' || CategoryName == 'Pies' ? (
            <Fragment>
              <View style={styles.borderLine} />
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text style={styles.subContent}>
                  Special Instruction (e.g. Nut Allergy)
                </Text>
                <TextInput
                  numberOfLines={1}
                  textAlignVertical={'top'}
                  placeholder="Please Type your special instructions"
                  style={styles.textInput}
                  value={this.state.comment}
                  onChangeText={(comment) => this.setState({ comment })}
                />
              </View>
            </Fragment>
          ) : null}

          {/* Additional Instructions Cups */}
          {selectedCategory?.category.CategoryName === 'Cups' ? (
            <Fragment>
              <View style={styles.borderLine} />
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text style={styles.subContent}>
                  Special Instruction (e.g. Nut Allergy)
                </Text>
                <View style={[styles.SizeList]}>
                  {AdditionalInsCupData.map((insData, insIndex) => {
                    let isInsSelected = false;
                    additionalInstruction.map((singleData, singleIndex) => {
                      if (
                        singleData.subCategory != null &&
                        singleData.subCategory != undefined
                      ) {
                        if (
                          selectedCategory.subCategory.SubCategoryId ===
                          singleData?.subCategory.SubCategoryId &&
                          insData.instruction ===
                          singleData?.insData.instruction
                        ) {
                          isInsSelected = true;
                        }
                      }
                    });
                    return (
                      <TouchableOpacity
                        key={insIndex}
                        onPress={() => {
                          if (isInsSelected) {
                            this.setState({
                              additionalInstruction: [],
                            });
                          } else {
                            let addData = [...this.state.additionalInstruction];
                            addData.push({ ...selectedCategory, insData });
                            this.setState({
                              additionalInstruction: addData,
                            });
                          }
                        }}>
                        <View
                          style={[
                            styles.adIns,
                            {
                              backgroundColor: isInsSelected
                                ? '#793422'
                                : '#F9F9F9',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.SizeItemText,
                              { color: isInsSelected ? '#FFF' : '#2D2926' },
                            ]}>
                            {insData.instruction}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Fragment>
          ) : null}

          {/* Additional Instructions Parfait */}
          {selectedCategory?.category.CategoryName === 'Parfait' ? (
            <View style={[styles.SizeList]}>
              {AdditionalInsPerfaitData.map((insData, insIndex) => {
                let isInsSelected = false;
                additionalInstruction.map((singleData, singleIndex) => {
                  if (
                    singleData.subCategory != null &&
                    singleData.subCategory != undefined
                  ) {
                    if (
                      selectedCategory.subCategory.SubCategoryId ===
                      singleData?.subCategory.SubCategoryId &&
                      insData.instruction === singleData?.insData.instruction
                    ) {
                      isInsSelected = true;
                    }
                  }
                });
                return (
                  <TouchableOpacity
                    key={insIndex}
                    onPress={() => {
                      if (isInsSelected) {
                        this.setState({
                          additionalInstruction: [],
                        });
                      } else {
                        let addData = [...this.state.additionalInstruction];
                        addData.push({ ...selectedCategory, insData });
                        this.setState({
                          additionalInstruction: addData,
                        });
                      }
                    }}>
                    <View
                      style={[
                        styles.adIns,
                        {
                          backgroundColor: isInsSelected
                            ? '#793422'
                            : '#F9F9F9',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.SizeItemText,
                          { color: isInsSelected ? '#FFF' : '#2D2926' },
                        ]}>
                        {insData.instruction}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {/* Additional Instructions Cones */}
          {selectedCategory?.category.CategoryName === 'Cones' ? (
            <Fragment>
              <View style={styles.borderLine} />
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text style={styles.subContent}>
                  Special Instruction (e.g. Nut Allergy)
                </Text>
                <View style={[styles.SizeList]}>
                  {AdditionalInsConesData.map((insData, insIndex) => {
                    let isInsSelected = false;
                    additionalInstruction.map((singleData, singleIndex) => {
                      if (
                        singleData.subCategory != null &&
                        singleData.subCategory != undefined
                      ) {
                        if (
                          selectedCategory.subCategory.SubCategoryId ===
                          singleData?.subCategory.SubCategoryId &&
                          insData.instruction ===
                          singleData?.insData.instruction
                        ) {
                          isInsSelected = true;
                        }
                      }
                    });
                    return (
                      <TouchableOpacity
                        key={insIndex}
                        onPress={() => {
                          if (isInsSelected) {
                            this.setState({
                              additionalInstruction: [],
                            });
                          } else {
                            let addData = [...this.state.additionalInstruction];
                            addData.push({ ...selectedCategory, insData });
                            this.setState({
                              additionalInstruction: addData,
                            });
                          }
                        }}>
                        <View
                          style={[
                            styles.adIns,
                            {
                              backgroundColor: isInsSelected
                                ? '#793422'
                                : '#F9F9F9',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.SizeItemText,
                              { color: isInsSelected ? '#FFF' : '#2D2926' },
                            ]}>
                            {insData.instruction}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Fragment>
          ) : null}

          {/* Additional Instructions Nippers */}
          {selectedCategory?.category.CategoryName === 'Nippers' ? (
            <Fragment>
              <View style={styles.borderLine} />
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text style={styles.subContent}>
                  Special Instruction (e.g. Nut Allergy)
                </Text>
                <View style={[styles.SizeList]}>
                  {AdditionalInsNippersData.map((insData, insIndex) => {
                    let isInsSelected = false;
                    additionalInstruction.map((singleData, singleIndex) => {
                      if (
                        singleData.subCategory != null &&
                        singleData.subCategory != undefined
                      ) {
                        if (
                          selectedCategory.subCategory.SubCategoryId ===
                          singleData?.subCategory.SubCategoryId &&
                          insData.instruction ===
                          singleData?.insData.instruction
                        ) {
                          isInsSelected = true;
                        }
                      }
                    });
                    return (
                      <TouchableOpacity
                        key={insIndex}
                        onPress={() => {
                          if (isInsSelected) {
                            this.setState({
                              additionalInstruction: [],
                            });
                          } else {
                            let addData = [...this.state.additionalInstruction];
                            addData.push({ ...selectedCategory, insData });
                            this.setState({
                              additionalInstruction: addData,
                            });
                          }
                        }}>
                        <View
                          style={[
                            styles.adIns,
                            {
                              backgroundColor: isInsSelected
                                ? '#793422'
                                : '#F9F9F9',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.SizeItemText,
                              { color: isInsSelected ? '#FFF' : '#2D2926' },
                            ]}>
                            {insData.instruction}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Fragment>
          ) : null}

          {/* Additional Instructions Pints & Quarts */}
          {selectedCategory?.category.CategoryName === 'Pints & Quarts' ? (
            <Fragment>
              <View style={styles.borderLine} />
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text style={styles.subContent}>
                  Special Instruction (e.g. Nut Allergy)
                </Text>
                <View style={[styles.SizeList]}>
                  {AdditionalInsPQData.map((insData, insIndex) => {
                    let isInsSelected = false;
                    additionalInstruction.map((singleData, singleIndex) => {
                      if (
                        singleData.subCategory != null &&
                        singleData.subCategory != undefined
                      ) {
                        if (
                          selectedCategory.subCategory.SubCategoryId ===
                          singleData?.subCategory.SubCategoryId &&
                          insData.instruction ===
                          singleData?.insData.instruction
                        ) {
                          isInsSelected = true;
                        }
                      }
                    });
                    return (
                      <TouchableOpacity
                        key={insIndex}
                        onPress={() => {
                          if (isInsSelected) {
                            this.setState({
                              additionalInstruction: [],
                            });
                          } else {
                            let addData = [...this.state.additionalInstruction];
                            addData.push({ ...selectedCategory, insData });
                            this.setState({
                              additionalInstruction: addData,
                            });
                          }
                        }}>
                        <View
                          style={[
                            styles.adIns,
                            {
                              backgroundColor: isInsSelected
                                ? '#793422'
                                : '#F9F9F9',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.SizeItemText,
                              { color: isInsSelected ? '#FFF' : '#2D2926' },
                            ]}>
                            {insData.instruction}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Fragment>
          ) : null}

          {/* Additional Instructions Other */}
          {selectedCategory?.category.CategoryName === 'Shakes' ||
            selectedCategory?.category.CategoryName === 'Saucers' ? (

            <Fragment>
              <View style={styles.borderLine} />
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text style={styles.subContent}>
                  Special Instruction (e.g. Nut Allergy)
                </Text>
                <View style={[styles.SizeList]}>
                  {AdditionalInsOtherData.map((insData, insIndex) => {
                    let isInsSelected = false;
                    additionalInstruction.map((singleData, singleIndex) => {
                      if (
                        singleData.subCategory != null &&
                        singleData.subCategory != undefined
                      ) {
                        if (
                          selectedCategory.subCategory.SubCategoryId ===
                          singleData?.subCategory.SubCategoryId &&
                          insData.instruction ===
                          singleData?.insData.instruction
                        ) {
                          isInsSelected = true;
                        }
                      }
                    });
                    return (
                      <TouchableOpacity
                        key={insIndex}
                        onPress={() => {
                          if (isInsSelected) {
                            this.setState({
                              additionalInstruction: [],
                            });
                          } else {
                            let addData = [...this.state.additionalInstruction];
                            addData.push({ ...selectedCategory, insData });
                            this.setState({
                              additionalInstruction: addData,
                            });
                          }
                        }}>
                        <View
                          style={[
                            styles.adIns,
                            {
                              backgroundColor: isInsSelected
                                ? '#793422'
                                : '#F9F9F9',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.SizeItemText,
                              { color: isInsSelected ? '#FFF' : '#2D2926' },
                            ]}>
                            {insData.instruction}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Fragment>
          ) : null}

          <TouchableOpacity
            style={styles.rstReciepe}
            onPress={this.handleResetReciepe}>
            <Text
              style={{
                fontSize: 16,
                color: '#505755',
                textAlign: 'center',
                padding: 7,
                fontFamily: 'OpenSans-SemiBold',
              }}>
              {`R E S E T   R E C I P E`}
            </Text>
          </TouchableOpacity>
          <View style={styles.borderLine} />
          <Text style={styles.allergensHeading}>Allergens</Text>
          <Text style={styles.allergensText}>
            We cannot guarantee that any pre-packed products served in our store
            allergen-free because we use shared equipment and topping bar to
            prepare them. Customer will allergies should custom order the items
            and let us know in the special instruction of their allergy
            requirement.
          </Text>
        </KeyboardAwareScrollView>

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
          <View style={{ width: '80%' }}>
            <Text
              style={[styles.subContent, { color: '#bfbfbf', marginStart: 0 }]}>
              Pickup Store
            </Text>
            <View
              style={{ borderBottomWidth: 0.3, borderBottomColor: '#666666' }}>
              <Text
                style={[
                  styles.subContent,
                  { color: '#FFF', margin: 0, marginStart: 0 },
                ]}>
                Greenvale, NY 11548
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('revieworder')}>
            <View style={{ marginTop: -18 }}>
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
              {cartData.TotalQuantity > 0 || adding ? (
                <FastImage
                  source={cart2}
                  style={{ width: 45, height: 45 }}
                  resizeMode="contain"
                />
              ) : (
                <FastImage
                  source={cart1}
                  style={{ width: 45, height: 45 }}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: 'absolute',
            left: Dimensions.get('window').width * 0.65,
            right: 5,
            bottom: adding ? 119 : 70,
            flexDirection: 'column-reverse',
          }}>
          <TouchableOpacity
            onPress={() =>
              isUserLoggedIn != null && isUserLoggedIn == false
                ? this.props.navigation.navigate('login')
                : this.addToCartPhase1()
            }
            style={[styles.addItemButton,{width: isEditMode ? 150 : 110}]}>
            <Text style={styles.addItemText}>{isEditMode ? "Update item" : "Add item"  }</Text>
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
              bottom: 68,
              right: 9,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              borderBottomLeftRadius: 25,
              backgroundColor: '#FFF',
              transform: [{ rotateZ: '45deg' }],
            }}>
            <FastImage
              source={{uri: `${HostURL}${DisplayImage}`}}
              style={{
                height: 37,
                width: 37,
                borderRadius: 20,
                transform: [{ rotateZ: '-45deg' }],
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
    height: '100%',
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  img: {
    width: 30,
    height: 30,
    margin: 20,
  },
  txt: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold',
    alignItems: 'flex-start',
    margin: 10,
  },
  mainContent: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    margin: 0,
    margin: 10,
    marginStart: 20,
    color: '#414040',
  },
  congratsText: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#414040',
    textAlign: 'center',
    marginTop: 10,
  },
  redeemText: {
    fontSize: 15,
    fontFamily: 'OpenSans-SemiBold',
    color: '#38a4ba',
    textAlign: 'center',
    marginVertical: 5,
  },
  WarningText: {
    fontSize: 11,
    fontFamily: 'OpenSans-Regular',
    color: '#414040',
    textAlign: 'center',
  },
  borderLine: {
    borderWidth: 0.5,
    borderColor: '#E6E6E6',
    width: '90%',
    alignSelf: 'center',
    margin: 7,
  },
  subContent: {
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    fontWeight: 'bold',
    margin: 5,
    marginStart: 20,
    color: '#414040',
  },
  subTextContent: {
    fontSize: 13,
    fontFamily: 'OpenSans-SemiBold',
    color: '#793422',
    marginStart: 20,
    marginEnd: 20,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 7,
    width: '90%',
    height: 80,
    alignSelf: 'center',
    paddingLeft: 10,
    fontSize: 13,
    fontFamily: 'OpenSans-SemiBold',
  },
  rstReciepe: {
    backgroundColor: '#FFF',
    width: '100%',
    height: 45,
    margin: 10,
    marginVertical: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: '#696969',
  },
  swithContainerStyle: {
    marginRight: 10,
    width: 45,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#696969',
    padding: 5,
  },
  swithCircleStyle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white', // rgb(102,134,205)
  },
  allergensText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'center',
    margin: 10,
    marginTop: 5,
    marginStart: 18,
    marginEnd: 7,
    color: '#505755',
  },
  allergensHeading: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    marginStart: 20,
    marginTop: 30,
    color: '#414040',
  },
  addItemButton: {
    backgroundColor: '#793422',
    borderRadius: 50,
    height: 46,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginLeft: 30,
    borderColor: 'red',
    borderWidth: 0,
  },
  addItemText: {
    color: '#FFF',
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontFamily: 'OpenSans-ExtraBold',
  },
  adIns: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    marginTop: 5,
    marginHorizontal: 2,
    borderRadius: 17.5,
    borderWidth: 0.3,
    backgroundColor: '#F1F1F1',
  },
  SizeItemText: {
    fontSize: 14,
    lineHeight: 19.07,
    fontWeight: '700',
    paddingHorizontal: 15,
  },
  SizeList: {
    height: 40,
    width: '98%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginTop: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    reduxStore: state,
    productstore: state.productstore,
    categorystore: state.categoryStore,
    userstore: state.userstore,
    sixPackStore: state.sixPackStore,
    getCartStore: state.getCartStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetProductReciepeDispatch: (updatedSlectedProduct) => {
      dispatch(resetProductReciepe(updatedSlectedProduct));
    },
    handleAutoPopulate: (selectedProductData) => {
      dispatch({ type: 'CUPAUTOPOPULATE', data: { selectedProductData } });
    },
    mutateSixPackStore: (type, data) => {
      dispatch({ type, data });
    },
    fetchCartData: () => {
      dispatch(fetchCartDataAsyncCreator());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectProduct);

// (selectedCategory.subCategory.IsTopping == true &&
//   singleProductData.toppings.length == 0) ||
// (selectedCategory.subCategory.IsTopTopping == true &&
//   singleProductData.topTopping.length == 0) ||
// (selectedCategory.subCategory.IsMiddleTopping == true &&
//   singleProductData.middleTopping.length == 0) ||
// (selectedCategory.subCategory.IsBottomTopping == true &&
//   singleProductData.bottomTopping.length == 0) ||
// (selectedCategory.subCategory.IsSideTopping == true &&
//   singleProductData.sideTopping.length == 0))
