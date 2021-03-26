import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  BackHandler,
  Linking
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BottomNavigator from "../../../router/BottomNavigator";
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from "react-redux";
import cart1 from "../../../assets/icon/order/cart1.png";
import cart2 from "../../../assets/icon/order/cart2.png";
import {
  getCategoryData,
  handleCollapse,
  readyProduct,
  setCurrentSelectedCategory,
} from "@redux";
import Collapsible from "react-native-collapsible";
import { HostURL } from "@api";
import { topLevelNavigate } from '@navigation/topLevelRef.js';
import { fetchCartDataAsyncCreator } from '@redux/getcart.js';
import FastImage from "react-native-fast-image";
import VersionCheck from 'react-native-version-check';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

SimpleLineIcon.loadFont();
FontAwesome.loadFont();

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryData: [],
      userCartData: [],
    };
  }

  fetchGetCategory = async () => {
    this.props.fetchCategoryData();
    setTimeout(() => {
      this.props.readyProductDispatch();
    }, 100);
    setTimeout(() => {
      this.checkVersion();
    }, 2200)
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.props.fetchCartData();
      setTimeout(() => {
        this.props.readyProductDispatch();
        this.fetchGetCategory();
      }, 100);
    })
    
  };

  componentDidMount = () => {
    this.props.fetchCartData();
    setTimeout(() => {
      this.fetchGetCategory();
    }, 100);
  };

  checkVersion = async () => {
    try {
      const Update = await VersionCheck.needUpdate();
      if (Update && Update.isNeeded) {
        Alert.alert(
          'Please Update',
          'You will have to update your app to the latest version to continue using.',
          [
            {
              text: 'Update',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(Update.storeUrl);
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (e) {}
  };

  render() {
    const { categoryStore, getCartStore } = this.props;
    const { categoryData, loader } = categoryStore;
    const { cartData }= getCartStore 
    return (
      <View style={styles.continer}>
        <Spinner visible={loader} size="large" color="#793422" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {categoryData?.map((singleMenu, categoryIndex) => {
            let showSubCategory =
              singleMenu.SubCategoryInfolst != null &&
              singleMenu.SubCategoryInfolst.length > 1 &&
              singleMenu.IsSubCategory === true;
            return (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    borderColor: "red",
                    borderWidth: 0,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    key={categoryIndex}
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => {
                      if (!showSubCategory) {
                        this.props.setCurrentSelectedCategoryDispatch({
                          category: singleMenu,
                          subCategory: singleMenu.SubCategoryInfolst[0],
                          isSubCategory: false,
                          priceDetails: singleMenu.priceDetails,
                          categoryIndex,
                        });
                        topLevelNavigate("menuIndex", {
                          category: singleMenu,
                          subCategory: singleMenu.SubCategoryInfolst[0],
                          isSubCategory: false,
                          categoryIndex,
                          IsRedeem: false,
                        });
                      } else {
                        this.props.categoryCollapse(singleMenu.CategoryId);
                      }
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        borderColor: "red",
                        borderWidth: 0,
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          borderColor: "red",
                          borderWidth: 0,
                          alignItems: "center",
                        }}
                      >
                        <FastImage
                          style={{ height: 30, width: 30, margin: 20 }}
                          source={{
                            uri: `${HostURL}${singleMenu.LogoUrl}`,
                          }}
                        />
                        <Text style={styles.txt}>
                          {singleMenu.CategoryName}
                        </Text>
                      </View>

                      {showSubCategory && (
                        <View
                          style={{
                            flexDirection: "row",
                            marginRight: 10,
                            borderColor: "red",
                            borderWidth: 0,
                            alignItems: "center",
                          }}
                        >
                          {singleMenu.collapse == true ? (
                            <FontAwesome
                              name="chevron-down"
                              size={15}
                              color="#793422"
                            />
                          ) : (
                              <FontAwesome
                                name="chevron-up"
                                size={15}
                                color="#793422"
                              />
                            )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                <Collapsible collapsed={singleMenu.collapse}>
                  <Fragment>
                    {showSubCategory
                      ? singleMenu.SubCategoryInfolst.map(
                        (singleSubCategory, subCategoryIndex) => {
                          if (
                            singleSubCategory.SubCategoryName !==
                            singleMenu.CategoryName
                          ) {
                            return (
                              <View>
                                <TouchableOpacity
                                  key={subCategoryIndex}
                                  onPress={() => {
                                    this.props.setCurrentSelectedCategoryDispatch(
                                      {
                                        category: singleMenu,
                                        subCategory: singleSubCategory,
                                        categoryIndex,
                                        subCategoryIndex,
                                        isSubCategory: true,
                                        priceDetails: singleMenu.priceDetails,
                                        isSixPack:
                                          singleSubCategory.SubCategoryName ==
                                          "Six Pack" ||
                                          singleSubCategory.SubCategoryName ==
                                          "Saucers with toppings" ||
                                          singleSubCategory.SubCategoryName ==
                                          "Saucers without toppings",
                                      }
                                    );
                                    topLevelNavigate(
                                      "menuIndex",
                                      {
                                        category: singleMenu,
                                        subCategory: singleSubCategory,
                                        isSubCategory: true,
                                        priceDetails: singleMenu.priceDetails,
                                        isSixPack:
                                          singleSubCategory.SubCategoryName ==
                                          "Six Pack" ||
                                          singleSubCategory.SubCategoryName ==
                                          "Saucers with toppings" ||
                                          singleSubCategory.SubCategoryName ==
                                          "Saucers without toppings",
                                      }
                                    );
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      fontFamily: "OpenSans-SemiBold",
                                      margin: 4,
                                      marginStart: 50,
                                      color: "#793422",
                                      height: 24,
                                    }}
                                  >
                                    {singleSubCategory.SubCategoryName}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            );
                          } else {
                            return null;
                          }
                        }
                      )
                      : null}
                  </Fragment>
                </Collapsible>
              </View>
            );
          })}
        </ScrollView>
        <View
          style={{
            height: 65,
            backgroundColor: '#262A29',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <View style={{width: '80%', }}>
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

        <BottomNavigator
          currentRoute={"Order"}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  continer: {
    flex: 1,
    width: "100%",
  },
  img: {
    width: 30,
    height: 30,
    margin: 20,
  },
  txt: {
    fontSize: 18,
    fontFamily: "OpenSans-SemiBold",
    alignItems: "flex-start",
    margin: 10,
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
    categoryStore: state.categoryStore,
    getCartStore: state.getCartStore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCategoryData: () => {
      dispatch(getCategoryData());
    },
    categoryCollapse: (id) => {
      dispatch(handleCollapse(id));
    },
    readyProductDispatch: () => {
      dispatch(readyProduct());
    },
    setCurrentSelectedCategoryDispatch: (categoryData) => {
      dispatch(setCurrentSelectedCategory(categoryData));
    },
    fetchCartData: () => {
      dispatch(fetchCartDataAsyncCreator());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
