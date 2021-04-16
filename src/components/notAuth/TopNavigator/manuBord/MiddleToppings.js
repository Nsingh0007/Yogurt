import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import Vector2 from "../../../../assets/icon/order/Vector2.png";
import search from "../../../../assets/icon/order/search.png";
import { connect } from "react-redux";
import { mutateProducts } from "@redux";
import SearchInput, { createFilter } from "react-native-search-filter";
import FastImage from "react-native-fast-image";
import BackHoc from './BackHoc';

const KEYS_TO_FILTERS = ["ToppingName"];

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

class MiddleToppings extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = { searchTerm: "" };
  }

  componentDidMount = async () => {
    // this.fetchGetToppings()
    // let CategoryId = this.props.navigation.getParam("CategoryId");
    // console.log("getting category id here------------",CategoryId)
  };

  handleMutate = (subCategoryData, currentTopTopingArray) => {
    //return true;
    if (subCategoryData.MiddleToppingCount > currentTopTopingArray.length) {
      return true;
    } else {
      Alert.alert(
        "Message",
        `Oops! Please select only ${subCategoryData.MiddleToppingCount} middle toppings`,
        [
          {
            text: "Okay",
          },
        ]
      );
      return false;
    }
  };

  SearchFilterFunction(value) {
    const newData = this.props.productstore.toppingsData.filter(function (
      item
    ) {
      //applying filter for the inserted text in search bar
      const itemData = item.ToppingName
        ? item.ToppingName.toUpperCase()
        : "".toUpperCase();
      const textData = value.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      newData,
      value: value,
    });
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }

  addToppings = (selectedCategory, singleMiddleTopping) => {
    let { sixPackStore } = this.props;
    let { sixPackData } = sixPackStore;
    const {
      sixPackDataIndex,
      productIndex,
      isSixPackLogic,
      type,
    } = this.readyRender();
    if (isSixPackLogic) {
      sixPackData[sixPackDataIndex].Products[type][productIndex].products.push(
        singleMiddleTopping
      );
      return this.props.mutateSixPackStore("MUTATE", {
        ready: true,
        sixPackData,
      });
    }
    return this.props.mutateProductsDispatch(
      selectedCategory,
      singleMiddleTopping,
      "MIDDLETOPPINGS",
      "ADD"
    );
  };

  readyRender = () => {
    const { getParam } = this.props.navigation;
    const CategoryId = getParam("CategoryId");
    const SubCategoryId = getParam("SubCategoryId");
    const type = getParam("type");
    const sixPackDataIndex = getParam("sixPackDataIndex");
    const productIndex = getParam("productIndex");
    const isSixPackLogic = getParam("isSixPackLogic", false);
    return {
      CategoryId,
      SubCategoryId,
      type,
      sixPackDataIndex,
      productIndex,
      isSixPackLogic,
    };
  };

  removeSixPackFlavor = (mutateIndex) => {
    let { sixPackStore } = this.props;
    let { sixPackData } = sixPackStore;
    const { sixPackDataIndex, productIndex, type } = this.readyRender();
    let updatedProduct = sixPackData[sixPackDataIndex].Products[type][
      productIndex
    ].products.filter((itr) => itr.ToppingId != mutateIndex);

    sixPackData[sixPackDataIndex].Products[type][
      productIndex
    ].products = updatedProduct;
    return this.props.mutateSixPackStore("MUTATE", {
      ready: true,
      sixPackData,
    });
  };

  render() {
    const toppingsData = this.props.productstore.toppingsData.filter(
      createFilter(this.state.searchTerm, KEYS_TO_FILTERS)
    );

    const {
      // toppingsData = [],
      selectedProductData,
      flavorData,
    } = this.props?.productstore;
    const { selectedCategory } = this.props?.categorystore;

    let selectMiddleToppings = [];
    const { sixPackStore } = this.props;
    const {
      CategoryId,
      SubCategoryId,
      type,
      sixPackDataIndex,
      productIndex,
      isSixPackLogic,
    } = this.readyRender();

    if (!isSixPackLogic) {
      if (!selectedCategory.isSubCategory) {
        let updatedDemo = selectedProductData.find((singleCategory) => {
          if (
            selectedCategory.category.CategoryId === singleCategory.CategoryId
          ) {
            return true;
          } else {
            return false;
          }
        });
        selectMiddleToppings = updatedDemo.middleTopping;
      } else {
        let updatedDemo = [];

        selectedProductData.map((singleMap) => {
          if (singleMap.CategoryId === selectedCategory.category.CategoryId) {
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

        selectMiddleToppings = updatedDemo.middleTopping;
      }
    } else {
      let sixPackObject = sixPackStore.sixPackData[sixPackDataIndex];
      selectMiddleToppings =
        sixPackObject.Products[type][productIndex].products;
    }
    return (
      <View style={styles.continer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              isSixPackLogic
                ? this.props.navigation.goBack()
                : this.props.navigation.navigate("menuIndex");
            }}
          >
            <FastImage
              source={Vector2}
              style={{ height: 25, width: 25, margin: 1 }}
            />
          </TouchableOpacity>
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.headerText}>MIDDLE TOPPINGS</Text>
          </View>
          <Text style={styles.headerText}> </Text>
        </View>
        <View
          style={{
            alignSelf: "center",
            margin: 10,
            width: "90%",
            borderColor: "#E5E5E5",
            borderWidth: 2,
            height: 45,
            borderRadius: 50,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <SearchInput
              onChangeText={(term) => {
                this.searchUpdated(term);
              }}
              placeholder="Search Topping"
              style={{
                paddingStart: 20,
                width: Dimensions.get("window").width * 0.75,
              }}
            />
          </View>
          <View>
            <TouchableOpacity>
              <FastImage
                source={search}
                style={{ height: 30, width: 30, margin: 6 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View
            style={{
              backgroundColor: "#DBDDDE",
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Bold",
                fontSize: 18,
                fontWeight: "700",
                margin: 0,
                marginStart: 20,
              }}
            >
              POPULAR TOPPINGS
            </Text>
          </View>

          {toppingsData.map((singleMiddleTopping, singleMiddleToppingIndex) => {
            return (
              <Fragment key={singleMiddleToppingIndex}>
                <ScrollView>
                  <View>
                    {singleMiddleTopping.ToppingTypeName ===
                    "Popular Toppings" ? (
                      <ScrollView>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            margin: 10,
                          }}
                        >
                          <Text style={styles.subContent}>
                            {" "}
                            {singleMiddleTopping.ToppingName}
                          </Text>
                          {selectMiddleToppings.some(
                            (item) =>
                              item.ToppingId == singleMiddleTopping.ToppingId
                          ) ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (isSixPackLogic) {
                                  return this.removeSixPackFlavor(
                                    singleMiddleTopping.ToppingId
                                  );
                                }
                                this.props.mutateProductsDispatch(
                                  selectedCategory,
                                  singleMiddleTopping,
                                  "MIDDLETOPPINGS",
                                  "REMOVE"
                                );
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Remove</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  this.handleMutate(
                                    selectedCategory.subCategory,
                                    selectMiddleToppings
                                  )
                                ) {
                                  this.addToppings(
                                    selectedCategory,
                                    singleMiddleTopping
                                  );
                                }
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Add</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={styles.borderLine} />
                      </ScrollView>
                    ) : null}
                  </View>
                </ScrollView>
              </Fragment>
            );
          })}

          <View
            style={{
              backgroundColor: "#DBDDDE",
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Bold",
                fontSize: 18,
                fontWeight: "700",
                margin: 0,
                marginStart: 20,
              }}
            >
              NUTS & PEANUT TOPPINGS
            </Text>
          </View>

          {toppingsData.map((singleMiddleTopping, singleMiddleToppingIndex) => {
            return (
              <Fragment key={singleMiddleToppingIndex}>
                <ScrollView>
                  <View>
                    {singleMiddleTopping.ToppingTypeName ===
                    "Nuts & Peanut Toppings" ? (
                      <ScrollView>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            margin: 10,
                          }}
                        >
                          <Text style={styles.subContent}>
                            {" "}
                            {singleMiddleTopping.ToppingName}
                          </Text>
                          {selectMiddleToppings.some(
                            (item) =>
                              item.ToppingId == singleMiddleTopping.ToppingId
                          ) ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (isSixPackLogic) {
                                  return this.removeSixPackFlavor(
                                    singleMiddleTopping.ToppingId
                                  );
                                }
                                this.props.mutateProductsDispatch(
                                  selectedCategory,
                                  singleMiddleTopping,
                                  "MIDDLETOPPINGS",
                                  "REMOVE"
                                );
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Remove</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  this.handleMutate(
                                    selectedCategory.subCategory,
                                    selectMiddleToppings
                                  )
                                ) {
                                  this.addToppings(
                                    selectedCategory,
                                    singleMiddleTopping
                                  );
                                }
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Add</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={styles.borderLine} />
                      </ScrollView>
                    ) : null}
                  </View>
                </ScrollView>
              </Fragment>
            );
          })}

          <View
            style={{
              backgroundColor: "#DBDDDE",
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Bold",
                fontSize: 18,
                fontWeight: "700",
                margin: 0,
                marginStart: 20,
              }}
            >
              CANDIES
            </Text>
          </View>

          {toppingsData.map((singleMiddleTopping, singleMiddleToppingIndex) => {
            return (
              <Fragment key={singleMiddleToppingIndex}>
                <ScrollView>
                  <View>
                    {singleMiddleTopping.ToppingTypeName === "Candies" ? (
                      <ScrollView>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            margin: 10,
                          }}
                        >
                          <Text style={styles.subContent}>
                            {" "}
                            {singleMiddleTopping.ToppingName}
                          </Text>
                          {selectMiddleToppings.some(
                            (item) =>
                              item.ToppingId == singleMiddleTopping.ToppingId
                          ) ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (isSixPackLogic) {
                                  return this.removeSixPackFlavor(
                                    singleMiddleTopping.ToppingId
                                  );
                                }
                                this.props.mutateProductsDispatch(
                                  selectedCategory,
                                  singleMiddleTopping,
                                  "MIDDLETOPPINGS",
                                  "REMOVE"
                                );
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Remove</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  this.handleMutate(
                                    selectedCategory.subCategory,
                                    selectMiddleToppings
                                  )
                                ) {
                                  this.addToppings(
                                    selectedCategory,
                                    singleMiddleTopping
                                  );
                                }
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Add</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={styles.borderLine} />
                      </ScrollView>
                    ) : null}
                  </View>
                </ScrollView>
              </Fragment>
            );
          })}

          <View
            style={{
              backgroundColor: "#DBDDDE",
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Bold",
                fontSize: 18,
                fontWeight: "700",
                margin: 0,
                marginStart: 20,
              }}
            >
              SAUCES
            </Text>
          </View>

          {toppingsData.map((singleMiddleTopping, singleMiddleToppingIndex) => {
            return (
              <Fragment key={singleMiddleToppingIndex}>
                <ScrollView>
                  <View>
                    {singleMiddleTopping.ToppingTypeName === "Sauces" ? (
                      <ScrollView>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            margin: 10,
                          }}
                        >
                          <Text style={styles.subContent}>
                            {" "}
                            {singleMiddleTopping.ToppingName}
                          </Text>
                          {selectMiddleToppings.some(
                            (item) =>
                              item.ToppingId == singleMiddleTopping.ToppingId
                          ) ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (isSixPackLogic) {
                                  return this.removeSixPackFlavor(
                                    singleMiddleTopping.ToppingId
                                  );
                                }
                                this.props.mutateProductsDispatch(
                                  selectedCategory,
                                  singleMiddleTopping,
                                  "MIDDLETOPPINGS",
                                  "REMOVE"
                                );
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Remove</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  this.handleMutate(
                                    selectedCategory.subCategory,
                                    selectMiddleToppings
                                  )
                                ) {
                                  this.addToppings(
                                    selectedCategory,
                                    singleMiddleTopping
                                  );
                                }
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Add</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={styles.borderLine} />
                      </ScrollView>
                    ) : null}
                  </View>
                </ScrollView>
              </Fragment>
            );
          })}

          {/* // NEW ADDED TOPPING FROM HERE----- */}

          <View
            style={{
              backgroundColor: "#DBDDDE",
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Bold",
                fontSize: 18,
                fontWeight: "700",
                margin: 0,
                marginStart: 20,
              }}
            >
              FRUITS
            </Text>
          </View>

          {toppingsData.map((singleMiddleTopping, singleMiddleToppingIndex) => {
            return (
              <Fragment key={singleMiddleToppingIndex}>
                <ScrollView>
                  <View>
                    {singleMiddleTopping.ToppingTypeName === "Fruits" ? (
                      <ScrollView>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            margin: 10,
                          }}
                        >
                          <Text style={styles.subContent}>
                            {" "}
                            {singleMiddleTopping.ToppingName}
                          </Text>
                          {selectMiddleToppings.some(
                            (item) =>
                              item.ToppingId == singleMiddleTopping.ToppingId
                          ) ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (isSixPackLogic) {
                                  return this.removeSixPackFlavor(
                                    singleMiddleTopping.ToppingId
                                  );
                                }
                                this.props.mutateProductsDispatch(
                                  selectedCategory,
                                  singleMiddleTopping,
                                  "MIDDLETOPPINGS",
                                  "REMOVE"
                                );
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Remove</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  this.handleMutate(
                                    selectedCategory.subCategory,
                                    selectMiddleToppings
                                  )
                                ) {
                                  this.addToppings(
                                    selectedCategory,
                                    singleMiddleTopping
                                  );
                                }
                              }}
                            >
                              <Text style={styles.addRemoveButton}>Add</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={styles.borderLine} />
                      </ScrollView>
                    ) : null}
                  </View>
                </ScrollView>
              </Fragment>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  continer: {
    flex: 1,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
  },
  header: {
    backgroundColor: "#2D2926",
    width: "100%",
    height: 60,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subheaderView: {
    backgroundColor: "#DBDDDE",
    height: 50,
    width: "100%",
  },
  borderLine: {
    borderWidth: 0.5,
    borderColor: "#E6E6E6",
    width: "90%",
    alignSelf: "center",
    margin: 0,
  },
  subContent: {
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold",
    margin: 0,
    marginStart: 20,
  },
  subTextContent: {
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
    color: "#793422",
    marginStart: 20,
    marginEnd: 20,
  },
  addRemoveButton: {
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
    color: "#793422",
    fontWeight: "700",
    marginTop: 5,
    marginEnd: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    productstore: state.productstore,
    categorystore: state.categoryStore,
    sixPackStore: state.sixPackStore,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    mutateProductsDispatch: (
      currentSelectedCategory,
      productData,
      productType,
      productAction
    ) => {
      dispatch(
        mutateProducts(
          currentSelectedCategory,
          productData,
          productType,
          productAction
        )
      );
    },
    mutateSixPackStore: (type, data) => {
      dispatch({ type, data });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BackHoc(MiddleToppings));
