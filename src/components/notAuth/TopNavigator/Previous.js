import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import BottomNavigator from '../../../router/BottomNavigator';
import PreviousIcon from '../../../assets/icon/PreviousIcon.png';
import cart1 from '../../../assets/icon/order/cart1.png';
import cart2 from '../../../assets/icon/order/cart2.png';
import {connect} from 'react-redux';
import {GetOrderStatus} from '@api';
import Subtract from '../../../assets/icon/order/Subtract.png';
import circularCheck from '../../../assets/icon/order/circularCheck.png';
import rightArrow from '../../../assets/icon/order/icons8-forward-26.png';
import {topLevelNavigate} from '@navigation/topLevelRef.js';
import {fetchCartDataAsyncCreator} from '@redux/getcart.js';
import FastImage from 'react-native-fast-image';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

SimpleLineIcon.loadFont();

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

class Previous extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: '',
      previousOrderData: [],
      cartDataLength: 0,
    };
  }

  fetchPreviousOrders = async () => {
    const GetPreviousOrderRespone = await GetOrderStatus();
    if (GetPreviousOrderRespone.result === true) {
      let prevdata = [];
      var previousOrderData = GetPreviousOrderRespone.response;
      previousOrderData.map((singlePrevOrder, index) => {
        if (singlePrevOrder.Status === 'Order Completed') {
          prevdata.push(singlePrevOrder);
        }
      });
      this.setState({previousOrderData: prevdata});
    }
  };

  componentDidMount = async () => {
    const {userDetails, authToken} = this.props.userstore;
    this.setState({userDetails: userDetails, authToken: authToken});
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      //this.fetchPreviousOrders();
      //Put your Data loading function here instead of my this.LoadData()
    });
  };

  phoneNoWithDash(phoneNo) {
    return `${phoneNo.slice(0, 3)}-${phoneNo.slice(3, 6)}-${phoneNo.slice(6)}`;
    //return phoneNo;
  }

  render() {
    const { PreviousData, error, loading } = this.props.getPrevStore
    const {cartData} = this.props.getCartStore;
    return (
      <View style={styles.continer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {PreviousData.length > 0 ? (
            PreviousData?.map((singleOrderStatus, singleIndex) => {
              let PickUpTimeNew =
                singleOrderStatus?.PickUpTime != null
                  ? singleOrderStatus?.PickUpTime.split(':')
                  : '';
              let TData =
                PickUpTimeNew == '' ? '' : PickUpTimeNew[2].split(' ');
              return (
                <View key={singleIndex} style={styles.cardParentView}>
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
                    <View style={{flexDirection: 'column'}}>
                      <View>
                        <Text style={styles.txtdata}>
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
                        {singleOrderStatus.Status != 'Order Completed' ? (
                          <View>
                            <Text style={styles.txtdata}>
                              Status : {singleOrderStatus.Status}
                            </Text>
                          </View>
                        ) : (
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                color: '#793422',
                                fontSize: 14,
                                fontFamily: 'OpenSans-ExtraBold',
                                marginTop: 5,
                              }}>
                              Status : {singleOrderStatus.Status}
                            </Text>
                            <FastImage
                              source={circularCheck}
                              style={{width: 16, height: 16, margin: 5}}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        topLevelNavigate('viewprevious', {
                          OrderNumber: singleOrderStatus.OrderNumber,
                          OrderDate: singleOrderStatus.OrderDate,
                          OrderTime: singleOrderStatus.OrderTime,
                        })
                      }>
                      <FastImage
                        source={rightArrow}
                        style={{
                          width: 20,
                          height: 20,
                          margin: 20,
                          marginStart: 10,
                          marginEnd: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={{justifyContent: 'center'}}>
              <FastImage
                resizeMode="contain"
                source={PreviousIcon}
                style={{
                  width: Dimensions.get('screen').width,
                  height: Dimensions.get('screen').height * 0.4,
                  marginTop: 15,
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#262A29',
                  paddingLeft: 15,
                }}>
                No Previous Order
              </Text>
              {/* <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Regular',
                  color: '#696969',
                  paddingLeft: 15,
                }}>
                Use the heart to save customizations. Your favorites will appear
                here to order again.
              </Text> */}
            </View>
          )}
        </ScrollView>
         
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
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 100,
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
    getCartStore: state.getCartStore,
    getPrevStore: state.getPrevStore
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCartData: () => {
      dispatch(fetchCartDataAsyncCreator());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Previous);
