import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { GetOrderStatusDetails, HostURL } from '@api';
import { ScrollView } from 'react-native-gesture-handler';
import backArrow from '../assets/icon/back.png';
import FastImage from 'react-native-fast-image';

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

export default class orderStatusDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatusDetailsData: [],
      OrderNumber: 0,
      spinner: true,
    };
  }

  componentDidMount = async () => {
    const OrderNumber = this.props.navigation.getParam('OrderNumber').OrderNumber;
    this.fetchOrderStatusDetailsByUser(OrderNumber);
  }

  fetchOrderStatusDetailsByUser = async (OrderNumber) => {
    const GetOrderStatusResponse = await GetOrderStatusDetails(OrderNumber);
    if (GetOrderStatusResponse.result === true) {
      var orderStatusDetailsData = GetOrderStatusResponse.response;
    }
    this.setState({ orderStatusDetailsData, spinner: false });
  }

  render() {
    const { orderStatusDetailsData, spinner } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <FastImage
              source={backArrow}
              style={{ width: 24, height: 24, margin: 15 }}
            />
          </TouchableOpacity>
          <View style={{ alignSelf: 'center', width: 240, }}>
            <Text style={styles.headerText}>Status Order Details</Text>
          </View>
          <Text>        </Text>
        </View>
        <View
          style={{
            height: 50,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#DDDDDD',
          }}>
          <Text style={{ color: '#414040', fontSize: 15, fontFamily: 'OpenSans-Bold' }}>
            Order Number:
            {" " + this.props.navigation.getParam('OrderNumber').OrderNumber}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: '#505755', fontFamily: 'OpenSans-SemiBold', fontSize: 13 }}>
              {this.props.navigation.getParam('OrderNumber').OrderDate}
            </Text>
            <Text style={{ color: '#505755', fontFamily: 'OpenSans-SemiBold', fontSize: 13 }}>
              - {this.props.navigation.getParam('OrderNumber').OrderTime}
            </Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {orderStatusDetailsData?.map((singleOrderDetails, singleOrderDetailsIndex) => {
            let sixpackFlavor = []
            let sixpackTopping = []
            let IsTopping = true
            if (singleOrderDetails.IsSixPack === true) {
              sixpackFlavor = JSON.parse(singleOrderDetails.FlavorName)
              if (singleOrderDetails.ToppingName != "") {
                sixpackTopping = JSON.parse(singleOrderDetails.ToppingName)
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
              <View key={singleOrderDetailsIndex} style={{ borderColor: 'red', borderWidth: 0, margin: 3, backgroundColor: '#FFFFFF', borderBottomColor: '#E5E5E5', borderBottomWidth: 1 }}>
                <View style={{ flexDirection: 'row', margin: 7 }}>
                  <View style={{ width: 60, height: 60, borderColor: '#DDDDDD', borderWidth: 0.5, borderRadius: 30, justifyContent: 'center', marginTop: 10 }}>
                    <FastImage source={{
                      uri: `${HostURL}${singleOrderDetails.CategoryImage}`,
                    }}
                      style={{ height: 40, width: 40, alignSelf: 'center', }} resizeMode="contain" />
                  </View>
                  <View style={{ borderColor: 'red', borderWidth: 0, alignSelf: 'flex-start', marginStart: 4, marginTop: 10, width: '75%', }} >
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ alignSelf: 'flex-start', fontSize: 14, fontFamily: 'OpenSans-ExtraBold', color: '#505755', paddingStart: 10 }}>{singleOrderDetails.CategoryName + " "}</Text>
                      {
                        singleOrderDetails?.SubCategoryName &&
                        singleOrderDetails.CategoryName != singleOrderDetails?.SubCategoryName && (
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: "OpenSans-Bold",
                              color: "#414040",
                            }}
                          >
                            ({singleOrderDetails?.SubCategoryName})
                          </Text>
                        )
                      }
                    </View>

                    {
                      singleOrderDetails.SizeName != "" && singleOrderDetails.SizeName != null ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text numberOfLines={2} style={styles.subHeader}>Size:
                                <Text style={styles.subHeaderText}>{" " + singleOrderDetails.SizeName}</Text>
                          </Text>
                        </View>
                        : null
                    }
                    {
                      singleOrderDetails.Comment != "" && singleOrderDetails.Comment != null ?
                        <Text
                          numberOfLines={2}
                          style={styles.subHeader}
                        >
                          Special Instruction:
                          <Text style={styles.subHeaderText}>
                            {" " + singleOrderDetails.Comment}
                          </Text>
                        </Text> : null
                    }
                    {
                      singleOrderDetails.FlavorName != "" ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text numberOfLines={singleOrderDetails.IsSixPack ? 25 : 2} style={styles.subHeader}>Flavors:
                                <Text style={styles.subHeaderText}>
                              {
                                singleOrderDetails.IsSixPack === true ?
                                  sixpackFlavor.map((flavorName, index) => {
                                    return <Text key={index} style={styles.subHeaderText}>
                                      {`\n${flavorName.type}: ${flavorName.products}`}
                                    </Text>
                                  })
                                  :
                                  <Text style={styles.subHeaderText}>
                                    {singleOrderDetails.FlavorName}
                                  </Text>
                              }
                            </Text>
                          </Text>
                        </View>
                        : null
                    }
                    {
                      singleOrderDetails.TopFlavorName != "" ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text numberOfLines={2} style={styles.subHeader}>Top Flavors:
                                <Text style={styles.subHeaderText}>{" " + singleOrderDetails.TopFlavorName}</Text>
                          </Text>
                        </View>
                        : null
                    }
                    {
                      singleOrderDetails.MiddleFlavorName != "" ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text numberOfLines={2} style={styles.subHeader}>Middle Flavors:
                                <Text style={styles.subHeaderText}>{" " + singleOrderDetails.MiddleFlavorName}</Text>
                          </Text>
                        </View>
                        : null
                    }
                    {
                      singleOrderDetails.BottomFlavorName != "" ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text numberOfLines={2} style={styles.subHeader}>Bottom Flavors:
                                <Text style={styles.subHeaderText}>{" " + singleOrderDetails.BottomFlavorName}</Text>
                          </Text>
                        </View>
                        : null
                    }

                    {
                      singleOrderDetails.ToppingName != "" && singleOrderDetails.ToppingName != null && singleOrderDetails.IsSixPack == false ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text numberOfLines={2} style={styles.subHeader}>Toppings:
                                <Text style={styles.subHeaderText}>{" " + singleOrderDetails.ToppingName}</Text>
                          </Text>
                        </View>
                        : null
                    }
                    {
                      singleOrderDetails.ToppingName != "" && singleOrderDetails.ToppingName != null && singleOrderDetails.IsSixPack == true && IsTopping == true ?
                        <Text
                          numberOfLines={25}
                          style={styles.subHeader}
                        >
                          Toppings:
                              <Text style={styles.subHeaderText}>
                            {
                              sixpackTopping.map((toppingName, index) => {
                                return <Text key={index} style={styles.subHeaderText}>
                                  {`\n${toppingName.type}: ${toppingName.products}`}
                                </Text>
                              })
                            }
                          </Text>
                        </Text> : null
                    }
                    {
                      singleOrderDetails.TopToppingName != "" ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text numberOfLines={2} style={styles.subHeader}>Top Toppings:
                                <Text style={styles.subHeaderText}>{" " + singleOrderDetails.TopToppingName}</Text>
                          </Text>
                        </View>
                        : null
                    }

                    {
                      singleOrderDetails.BottomToppingName != "" ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text numberOfLines={2} style={styles.subHeader}>Bottom Topping:
                                <Text style={styles.subHeaderText}>{" " + singleOrderDetails.BottomToppingName}</Text>
                          </Text>
                        </View>
                        : null

                    }

                    {
                      singleOrderDetails.MiddleToppingName != "" ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text style={styles.subHeader}>Middle Topping:
                                <Text style={styles.subHeaderText}>{" " + singleOrderDetails.MiddleToppingName}</Text>
                          </Text>
                        </View>
                        : null

                    }

                    {
                      singleOrderDetails.IsSideTopping === true ?
                        <View style={{ flexDirection: 'row', }}>
                          <Text style={styles.subHeader}>Side Topping:
                                <Text style={styles.subHeaderText}>{" " + singleOrderDetails.SideToppingName}</Text>
                          </Text>
                        </View>
                        : null
                    }

                    {
                      singleOrderDetails.IsLayered == true ?
                        <Text
                          numberOfLines={2}
                          style={styles.subHeader}
                        >
                          Layered
                            </Text> : null
                    }
                    {
                      singleOrderDetails.IsCandle == true ?
                        <Text
                          numberOfLines={2}
                          style={styles.subHeader}
                        >
                          With candle
                            </Text> : null
                    }
                    {
                      singleOrderDetails.IsWippedCream == true ?
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
                        {" " + singleOrderDetails.Quantity}
                      </Text>
                    </Text>
                    <Text style={{ alignSelf: 'flex-start', fontSize: 16, fontFamily: 'OpenSans-ExtraBold', color: '#505755', paddingStart: 10, marginTop: 10 }}>$ {singleOrderDetails.OrderPrice}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#2D2926',
    height: 70,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'OpenSans-Bold',
    margin: 7,
    color: '#FFFFFF',
    textAlign: 'center'
  },
  cardParentView: {
    borderColor: 'red',
    borderWidth: 0,
    margin: 5,
    padding: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 7,
  },
  cardImage: {
    width: '94%',
    margin: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitleText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'OpenSans-Bold',
    margin: 5,
  },
  timedata: {
    fontSize: 16,
    margin: 3,
    fontFamily: 'OpenSans-Bold',
    color: '#414040',
    marginBottom: 6,
  },
  txtdata: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    color: '#414040',
    marginTop: 5,
  },
  progressBarMainView: {
    flexDirection: 'row',
    marginStart: 10,
    alignSelf: 'center',
    width: '100%',
    borderWidth: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
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
});
