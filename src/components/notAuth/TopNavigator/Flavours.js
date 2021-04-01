import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import BottomNavigator from '../../../router/BottomNavigator';
import cart1 from '../../../assets/icon/order/cart1.png';
import cart2 from '../../../assets/icon/order/cart2.png';
import PreviousIcon from '../../../assets/icon/PreviousIcon.png';
import {getCartDetails, FeaturePageByUser, HostURL} from '@api';
import {NavigationActions} from 'react-navigation';
import {navigateTabRef} from '@navigation/refs';
import {topLevelNavigate} from '@navigation/topLevelRef.js';
import {fetchCartDataAsyncCreator} from '@redux/getcart.js';
import FastImage from 'react-native-fast-image';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

SimpleLineIcon.loadFont();
Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

class Featured extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featureData: [],
      cartDataLength: 0,
    };
  }

  componentWillUnmount() {
    //console.log("TEST HERE FOR THE UNMOUNTING");
  }

  fetchGetCategory = async () => {
    const FeatureResponse = await FeaturePageByUser();
    if (FeatureResponse.result === true) {
      var featureData = FeatureResponse.response;
    }
    this.setState({featureData});
  };

  componentDidMount = async () => {
    this.fetchGetCategory();
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.fetchGetCategory();
    });
  }; 

  handle_Navigate() {
    const navigateAction = NavigationActions.navigate({
      routeName: 'topNav',
      action: NavigationActions.navigate({routeName: 'menu'}),
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    const {featureData} = this.state;
    const {getCartStore} = this.props;
    const {cartData} = getCartStore;
    return (
      <View style={styles.continer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {featureData.length > 0 ? (
            featureData?.map((singleslide) => {
              return (
                <View
                  style={{
                    height: 350,
                    width: '97%',
                    borderColor: 'red',
                    borderWidth: 0,
                    marginTop: 9,
                    alignSelf: 'center',
                    backgroundColor: '#F9F9F9',
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                    borderRadius: 7,
                  }}>
                  <View>
                    <FastImage
                      resizeMode="stretch"
                      source={{
                        uri: `${HostURL}${singleslide.Pic}`,
                      }}
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        height: 200,
                        borderTopLeftRadius: 7,
                        borderTopRightRadius: 7,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 19,
                        color: '#222624',
                        marginTop: 15,
                        marginStart: 15,
                        marginEnd: 8,
                        fontFamily: 'OpenSans-Bold',
                      }}>
                      {singleslide.SliderTitle}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 13,
                        fontFamily: 'OpenSans-SemiBold',
                        color: '#262A29',
                        marginTop: 8,
                        marginStart: 15,
                        marginEnd: 8,
                      }}>
                      {singleslide.Description}
                    </Text>
                    <View
                      style={{
                        width: 77,
                        height: 30,
                        margin: 15,
                      }}>
                      {
                        <TouchableOpacity
                          onPress={() => {
                            console.log('Featured');
                            navigateTabRef('Menu');
                          }}
                          style={{
                            backgroundColor: '#793422',
                            borderRadius: 50,
                            width: 77,
                            height: 30,
                            borderColor: '#000',
                            borderWidth: 0,
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#F9F9F9',
                              textAlign: 'center',
                              alignSelf: 'center',
                              fontFamily: 'OpenSans-SemiBold',
                              fontSize: 15,
                            }}>
                            {singleslide.ButtonName.split(' ')[0]}
                          </Text>
                        </TouchableOpacity>
                      }
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            null
            /* <View style={{justifyContent: 'center'}}>
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
                Featured Item
              </Text>
               <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Regular',
                  color: '#696969',
                  paddingLeft: 15,
                }}>
                Use the heart to save customizations. Your favorites will appear
                here to order again.
              </Text>
            </View> */
          )}
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
          <TouchableOpacity onPress={() => topLevelNavigate('revieworder')}>
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
    color: '#696969',
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
    getCartStore: state.getCartStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCartData: () => {
      dispatch(fetchCartDataAsyncCreator());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Featured);