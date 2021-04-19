import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  BackHandler,
  Animated,
  TouchableOpacity,
  Alert,
  AppState,
  RefreshControl,
  LogBox,
} from 'react-native';
LogBox.ignoreAllLogs();
import {connect} from 'react-redux';
import {GetOrderStatus} from '@api';
import {fetchCartDataAsyncCreator} from '@redux/getcart.js';
import Subtract from '../../assets/icon/order/Subtract.png';
import circularCheck from '../../assets/icon/order/circularCheck.png';
import NoOrder from '../../assets/icon/order/noOrderStatus.png';
import rightArrow from '../../assets/icon/order/icons8-forward-26.png';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import {topLevelNavigate} from '@navigation/topLevelRef.js';
import {withBackHandler} from '@appHoc';

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus: [],
      authToken: '',
      userDetails: {},
      loader: false,
    };
    // this.statusDataCall = React.createRef();
  }

  // stateListener = state => {
  //   if (state == 'active') {
  //     console.log('state listener Status Call');
  //     this.triggerProgressDataCall();
  //   }
  // };

  // triggerProgressDataCall = () => {
  //   this.statusDataCall.current = this.fetchOrderStatusByUser();
  // };

  componentDidMount = async () => {
    const {userDetails, authToken} = this.props.userstore;
    this.setState({userDetails: userDetails, authToken: authToken});
  };

  componentWillUnmount() {
    //AppState.removeEventListener('change', this.stateListener);
    //BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  fetchOrderStatusByUser = async () => {
    let focused = this.props.navigation.isFocused();
    const GetOrderStatusResponse = await GetOrderStatus();
    let OrderData = [];
    if (GetOrderStatusResponse.result === true) {
      var orderStatus = GetOrderStatusResponse.response;
      orderStatus.map((singleOrderStatus, index) => {
        if (singleOrderStatus.Status != 'Order Completed') {
          OrderData.push(singleOrderStatus);
        }
      });
      this.setState({orderStatus: OrderData, loader: false});
      setTimeout(() => {
        if (focused) {
          this.fetchOrderStatusByUser();
        }
      }, 10000);
    } else {
      console.log(
        'error on Status --> ',
        JSON.stringify(GetOrderStatusResponse),
      );
      setTimeout(() => {
        if (focused) {
          this.fetchOrderStatusByUser();
        }
      }, 10000);
    }
  };

  phoneNoWithDash(phoneNo) {
    return `${phoneNo.slice(0, 3)}-${phoneNo.slice(3, 6)}-${phoneNo.slice(6)}`;
  }

  render() {
    const {orderStatus, loader} = this.state;
    const { OrderData, error, loading } = this.props.getOrderStore
    let orderData = [];
    OrderData.map((singleOrder, index) => {
      if (singleOrder.Status != 'Order Completed') {
        orderData.push(singleOrder);
      }
  });
    return (
      <View style={styles.container}>
        <Spinner visible={loader} size="large" color="#793422" />
        <View style={styles.header}>
          <Text style={styles.headerText}>Status</Text>
        </View>
        {orderData.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{borderColor: 'blue', borderWidth: 0, width: '98%'}}>
            {orderData.map((singleOrderStatus, singleOrderStatusIndex) => {
              let PickUpTimeNew = singleOrderStatus.PickUpTime.split(':');
              let TData = PickUpTimeNew[2].split(' ');
              return (
                <View
                  key={singleOrderStatusIndex}
                  style={styles.cardParentView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomColor: '#DDDDDD',
                      borderBottomWidth: 1,
                      justifyContent: 'center',
                      alignContent: 'center',
                      width: '90%',
                      alignSelf: 'center',
                      margin: 7,
                    }}>
                    <Text style={styles.timedata}>Order Placed: </Text>
                    <Text style={styles.timedata}>
                      {singleOrderStatus.OrderDate} -{' '}
                    </Text>
                    <Text style={styles.timedata}>
                      {singleOrderStatus.OrderTime}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        borderColor: '#DDDDDD',
                        borderWidth: 0,
                        borderRadius: 100,
                        width: 60,
                        height: 60,
                        margin: 10,
                      }}>
                      <FastImage
                        source={Subtract}
                        style={{width: 40, height: 40, margin: 7}}
                        resizeMode={'contain'}
                      />
                    </View>
                    <View style={{flexDirection: 'column', width: '66%'}}>
                      <View>
                        <Text numberOfLines={1} style={styles.txtdata}>
                          Order Name: {singleOrderStatus.CustomerName}
                        </Text>
                        <Text style={styles.txtdata}>
                          Order Phone:{' '}
                          {this.phoneNoWithDash(singleOrderStatus.Mobile)}
                        </Text>
                        <Text style={styles.txtdata}>
                          Order Number: {singleOrderStatus.OrderNumber}
                        </Text>
                        <Text style={styles.txtdata}>
                          Pick Up Time:{' '}
                          {`${PickUpTimeNew[0]}:${PickUpTimeNew[1]} ${TData[1]}`}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          topLevelNavigate('orderstatusdetails', {
                            OrderNumber: {...singleOrderStatus},
                          })
                        }>
                        <FastImage
                          source={rightArrow}
                          style={{width: 20, height: 20}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.progressBarMainView}>
                    {singleOrderStatus.Status === 'New Order' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginLeft: 10,
                        }}>
                        <View style={{width: '28%'}}>
                          <View style={{flexDirection: 'row'}}>
                            <FastImage
                              source={circularCheck}
                              style={{width: 20, height: 20}}
                            />
                            <View
                              style={{
                                borderWidth: 1,
                                width: '100%',
                                height: 6,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                                margin: 7,
                                marginStart: -1,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -20,
                            }}>
                            Order Placed
                          </Text>
                        </View>

                        <View style={{width: '28%'}}>
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 20,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                              }}
                            />
                            <View
                              style={{
                                borderWidth: 1,
                                width: '100%',
                                height: 6,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                                margin: 7,
                                marginStart: -1,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -20,
                            }}>
                            In-Progress
                          </Text>
                        </View>

                        <View style={{width: '28%'}}>
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 20,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                              }}
                            />
                            <View
                              style={{
                                borderWidth: 1,
                                width: '100%',
                                height: 6,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                                margin: 7,
                                marginStart: -1,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -30,
                            }}>
                            Ready for pickup
                          </Text>
                        </View>

                        <View style={{width: '27%', marginEnd: -38}}>
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 20,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -13,
                            }}>
                            Picked up
                          </Text>
                        </View>
                      </View>
                    ) : singleOrderStatus.Status === 'Inprogress' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginLeft: 10,
                        }}>
                        <View style={{width: '28%'}}>
                          <View style={{flexDirection: 'row'}}>
                            <FastImage
                              source={circularCheck}
                              style={{width: 20, height: 20}}
                            />
                            <View
                              style={{
                                borderWidth: 1,
                                width: '100%',
                                height: 6,
                                backgroundColor: '#793422',
                                borderColor: '#793422',
                                margin: 7,
                                marginStart: -1,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -20,
                            }}>
                            Order Placed
                          </Text>
                        </View>

                        <View style={{width: '28%'}}>
                          <View style={{flexDirection: 'row'}}>
                            <FastImage
                              source={circularCheck}
                              style={{width: 20, height: 20}}
                            />
                            <View
                              style={{
                                borderWidth: 1,
                                width: '100%',
                                height: 6,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                                margin: 7,
                                marginStart: -1,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -20,
                            }}>
                            In-Progress
                          </Text>
                        </View>

                        <View style={{width: '28%'}}>
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 20,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                              }}
                            />
                            <View
                              style={{
                                borderWidth: 1,
                                width: '100%',
                                height: 6,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                                margin: 7,
                                marginStart: -1,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -30,
                            }}>
                            Ready for pickup
                          </Text>
                        </View>

                        <View style={{width: '28%', marginEnd: -38}}>
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 20,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -13,
                            }}>
                            Picked up
                          </Text>
                        </View>
                      </View>
                    ) : singleOrderStatus.Status === 'Ready For Pickup' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginLeft: 10,
                        }}>
                        <View style={{width: '28%'}}>
                          <View style={{flexDirection: 'row'}}>
                            <FastImage
                              source={circularCheck}
                              style={{width: 20, height: 20}}
                            />
                            <View
                              style={{
                                borderWidth: 1,
                                width: '100%',
                                height: 6,
                                backgroundColor: '#793422',
                                borderColor: '#793422',
                                margin: 7,
                                marginStart: -1,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -20,
                            }}>
                            Order Placed
                          </Text>
                        </View>

                        <View style={{width: '28%'}}>
                          <View style={{flexDirection: 'row'}}>
                            <FastImage
                              source={circularCheck}
                              style={{width: 20, height: 20}}
                            />
                            <View
                              style={{
                                borderWidth: 1,
                                width: '100%',
                                height: 6,
                                backgroundColor: '#793422',
                                borderColor: '#793422',
                                margin: 7,
                                marginStart: -1,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -20,
                            }}>
                            In-Progress
                          </Text>
                        </View>

                        <View style={{width: '28%'}}>
                          <View style={{flexDirection: 'row'}}>
                            <FastImage
                              source={circularCheck}
                              style={{width: 20, height: 20}}
                            />
                            <View
                              style={{
                                borderWidth: 1,
                                width: '100%',
                                height: 6,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                                margin: 7,
                                marginStart: -1,
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -30,
                            }}>
                            Ready for pickup
                          </Text>
                        </View>

                        <View style={{width: '28%', marginEnd: -38}}>
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 20,
                                backgroundColor: '#E8E8E8',
                                borderColor: '#E8E8E8',
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              fontSize: 10,
                              fontFamily: 'OpenSans-Bold',
                              marginLeft: -13,
                            }}>
                            Picked up
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={{flex: 2}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                marginTop: 130,
              }}>
              <FastImage
                resizeMode="contain"
                source={NoOrder}
                style={{width: 80, height: 80}}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'OpenSans-Bold',
                  color: '#696969',
                  marginTop: 10,
                }}>
                No Order Status
              </Text>
            </View>
          </View>
        )}
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
    backgroundColor: '#FFFFFF',
    height: 70,
    width: '100%',
    justifyContent: 'center',
    borderBottomWidth: 0.3,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'OpenSans-Bold',
    margin: 7,
    textAlign: 'center',
    color: '#414040',
  },
  cardParentView: {
    flex: 2,
    borderColor: 'red',
    borderWidth: 0,
    margin: 5,
    padding: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
});

const mapStateToProps = state => {
  return {
    userstore: state.userstore,
    getOrderStore: state.getOrderStore
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUserTreeOnLogin: payload => {
      dispatch(updateUserTree(payload));
    },
    fetchCartData: () => {
      dispatch(fetchCartDataAsyncCreator());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Status);
