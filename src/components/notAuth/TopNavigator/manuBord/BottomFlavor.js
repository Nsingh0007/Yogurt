import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Vector2 from '../../../../assets/icon/order/Vector2.png';
import {connect} from 'react-redux';
import {mutateProducts} from '@redux';
import FastImage from 'react-native-fast-image';
import BackHoc from './BackHoc';
import {TransformFlavor} from '../../../../pipes';

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

class BottomFlavors extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMutate = (subCategoryData, currentTopTopingArray) => {
    if (subCategoryData.BottomFlavorCount > currentTopTopingArray.length) {
      return true;
    } else {
      Alert.alert(
        'Message',
        `Oops! Please select only ${subCategoryData.BottomFlavorCount} Flavors`,
        [
          {
            text: 'Okay',
          },
        ],
      );
      return false;
    }
  };

  readyRender = () => {
    const {getParam} = this.props.navigation;
    const CategoryId = getParam('CategoryId');
    const SubCategoryId = getParam('SubCategoryId');
    const type = getParam('type');
    const sixPackDataIndex = getParam('sixPackDataIndex');
    const productIndex = getParam('productIndex');
    const isSixPackLogic = getParam('isSixPackLogic', false);
    return {
      CategoryId,
      SubCategoryId,
      type,
      sixPackDataIndex,
      productIndex,
      isSixPackLogic,
    };
  };

  addBottomFlavor = (selectedCategory, singleflavor) => {
    let {sixPackStore} = this.props;
    let {sixPackData} = sixPackStore;
    const {
      sixPackDataIndex,
      productIndex,
      isSixPackLogic,
      type,
    } = this.readyRender();
    if (isSixPackLogic) {
      sixPackData[sixPackDataIndex].Products[type][productIndex].products.push(
        singleflavor,
      );
      return this.props.mutateSixPackStore('MUTATE', {
        ready: true,
        sixPackData,
      });
    }
    return this.props.mutateProductsDispatch(
      selectedCategory,
      singleflavor,
      'BOTTOMFLAVORS',
      'ADD',
    );
  };

  removeSixPackFlavor = mutateIndex => {
    let {sixPackStore} = this.props;
    let {sixPackData} = sixPackStore;
    const {sixPackDataIndex, productIndex, type} = this.readyRender();
    let updatedProduct = sixPackData[sixPackDataIndex].Products[type][
      productIndex
    ].products.filter(itr => itr.FlavorId != mutateIndex);

    sixPackData[sixPackDataIndex].Products[type][
      productIndex
    ].products = updatedProduct;
    return this.props.mutateSixPackStore('MUTATE', {
      ready: true,
      sixPackData,
    });
  };

  addFlavor = (selectedCategory, singleflavor) => {
    let {sixPackStore} = this.props;
    let {sixPackData} = sixPackStore;
    const {
      sixPackDataIndex,
      productIndex,
      isSixPackLogic,
      type,
    } = this.readyRender();
    if (isSixPackLogic) {
      sixPackData[sixPackDataIndex].Products[type][productIndex].products.push(
        singleflavor,
      );
      return this.props.mutateSixPackStore('MUTATE', {
        ready: true,
        sixPackData,
      });
    }
    this.props.mutateProductsDispatch(
      selectedCategory,
      singleflavor,
      'BOTTOMFLAVORS',
      'ADD',
    );
  };

  renderFlavors = ({
    flavor,
    flavIndex,
    isSixPackLogic,
    selectBottomFlavorsForSpecificCategory,
    selectedCategory,
  }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.subContent}>{flavor.FlavorName}</Text>
          <Text style={styles.subTextContent}>{flavor.Description}</Text>
        </View>
        {selectBottomFlavorsForSpecificCategory.some(
          item => item.FlavorId == flavor.FlavorId,
        ) ? (
          <TouchableOpacity
            onPress={() => {
              if (isSixPackLogic) {
                return this.removeSixPackFlavor(flavor.FlavorId);
              }
              this.props.mutateProductsDispatch(
                selectedCategory,
                flavor,
                'BOTTOMFLAVORS',
                'REMOVE',
              );
            }}>
            <Text style={styles.addRemoveButton}>Remove</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (
                this.handleMutate(
                  selectedCategory.subCategory,
                  selectBottomFlavorsForSpecificCategory,
                )
              ) {
                this.addFlavor(selectedCategory, flavor);
              }
            }}>
            <Text style={styles.addRemoveButton}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  render() {
    let {selectedProductData, flavorData} = this.props?.productstore;
    const {selectedCategory} = this.props?.categorystore;
    const {sixPackStore} = this.props;
    let selectBottomFlavorsForSpecificCategory = [];
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
        let updatedDemo = selectedProductData.find(singleCategory => {
          if (
            selectedCategory.category.CategoryId === singleCategory.CategoryId
          ) {
            return true;
          } else {
            return false;
          }
        });
        selectBottomFlavorsForSpecificCategory = updatedDemo.bottomflavours;
      } else {
        let updatedDemo = [];

        selectedProductData.map(singleMap => {
          if (singleMap.CategoryId === selectedCategory.category.CategoryId) {
            singleMap.subCategoryData.map(singleSubCategory => {
              if (
                singleSubCategory.SubCategoryId ===
                selectedCategory.subCategory.SubCategoryId
              ) {
                updatedDemo = singleSubCategory;
              }
            });
          }
        });

        selectBottomFlavorsForSpecificCategory = updatedDemo.bottomflavours;
        //selectFlavorsForSpecificCategory = [];
      }
    } else {
      let sixPackObject = sixPackStore.sixPackData[sixPackDataIndex];
      selectBottomFlavorsForSpecificCategory =
        sixPackObject.Products[type][productIndex].products;
    }
    flavorData = TransformFlavor(flavorData);

    return (
      <View style={styles.continer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              isSixPackLogic
                ? this.props.navigation.goBack()
                : this.props.navigation.navigate('menuIndex');
            }}>
            <FastImage
              source={Vector2}
              style={{height: 25, width: 25, margin: 6}}
            />
          </TouchableOpacity>
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.headerText}>BOTTOM FLAVORS</Text>
          </View>
          <Text style={styles.headerText}> </Text>
        </View>
        <ScrollView>
          {flavorData.map((FlavorType, fIndex) => {
            return (
              <Fragment>
                <View
                  style={{
                    backgroundColor: '#DBDDDE',
                    height: 50,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 18,
                      fontWeight: '700',
                      margin: 0,
                      marginStart: 20,
                    }}>
                    {FlavorType.FlavorTypeName}
                  </Text>
                </View>
                {FlavorType.flavours.map((flavor, flavIndex) => {
                  return this.renderFlavors({
                    flavor,
                    flavIndex,
                    isSixPackLogic,
                    selectBottomFlavorsForSpecificCategory,
                    selectedCategory,
                  });
                })}
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
    width: '100%',
    marginBottom: 20,
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
    fontFamily: 'OpenSans-ExtraBold',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subheaderView: {
    backgroundColor: '#DBDDDE',
    height: 50,
    width: '100%',
  },
  borderLine: {
    borderWidth: 0.5,
    borderColor: '#E6E6E6',
    width: '90%',
    alignSelf: 'center',
    margin: 0,
  },
  subContent: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    margin: 0,
    marginStart: 20,
  },
  subTextContent: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#793422',
    marginStart: 20,
    marginEnd: 20,
  },
  addRemoveButton: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#793422',
    fontWeight: '700',
    marginTop: 5,
    marginEnd: 10,
  },
});

const mapStateToProps = state => {
  return {
    productstore: state.productstore,
    categorystore: state.categoryStore,
    sixPackStore: state.sixPackStore,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    mutateProductsDispatch: (
      currentSelectedCategory,
      productData,
      productType,
      productAction,
    ) => {
      dispatch(
        mutateProducts(
          currentSelectedCategory,
          productData,
          productType,
          productAction,
        ),
      );
    },
    mutateSixPackStore: (type, data) => {
      dispatch({type, data});
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BackHoc(BottomFlavors));
