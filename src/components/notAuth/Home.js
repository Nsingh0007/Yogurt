import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  LogBox,
  Platform,
  Linking,
  Alert,
  BackHandler,
} from 'react-native';
import {
  getCategoryData,
  handleCollapse,
  readyProduct,
  setCurrentSelectedCategory,
} from '@redux';
import {fetchCartDataAsyncCreator} from '@redux/getcart.js';
import ProgressBar from '../../custom/ProgressBar';
import {Badge} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import SignIn from '../../assets/icon/SignIn.png';
import Inbox from '../../assets/icon/Inbox.png';
import User_Profile from '../../assets/icon/User_Profile.png';
import iceCreamCorn from '../../assets/icon/Ice-Cream_Cone.png';
import rewards from '../../assets/icon/snow.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {validateIsUserLoggedIn, getMessageData, updateUserOnEdit} from '@redux';
import {HostURL} from '@api';
import FastImage from 'react-native-fast-image';
import VersionCheck from 'react-native-version-check';
import {topLevelNavigate} from '@navigation/topLevelRef';
import {navigateRootBottomTab} from '../../router/rootBottomTabRef';
import {navigateTopTabRef} from '../../router/topTabRef';
import {fetchBannerRequest} from '../../Redux/offerbanner'; 
LogBox.ignoreAllLogs();

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;

const zIndexAndroid = Platform.select({
  ios: 0,
  android: 148,
});

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      userLoggedInToken: '',
      spinner: false,
      slideByUserData: [],
      IsRedeem: true,
      firstCircleColor: '#E8E8E8',
      secondCircleColor: '#E8E8E8',
      thirdCircleColor: '#E8E8E8',
      progressBarcompleted1Data: '0%',
      progressBarcompleted2Data: '0%',
      progressBarcompleted3Data: '0%',
      progressBarcompleted4Data: '0%',
    };
  }


  componentDidMount = async () => {
    this.props.isUserLoggedIn();
    this.fetchSlideByUser();
    this.props.fetchCartData();
    
    setTimeout(() => {
      this.checkVersion();
    }, 1500);

    this.progressData = setInterval(() => {
      this.progressBarData();
    }, 2000);

    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.props.isUserLoggedIn();
      setTimeout(() => {
        this.allData();
      }, 400);
    });
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

  allData() {
    this.getCardData();
    this.progressBarData();
    this.props.readyProductDispatch();

    setTimeout(() => {
      this.checkVersion();
    }, 1500);
  }

  getCardData = async () => {
    this.props.fetchCartData(GetCartDataResponse => {
      if (GetCartDataResponse.result === true) {
        let IsRedeem = false;
        GetCartDataResponse?.response?.map((cartData, CartIndex) => {
          if (cartData.IsRedeem && IsRedeem == false) {
            IsRedeem = true;
          }
        });
        this.setState({
          IsRedeem,
        });
      } else {
        console.log('getting Error on the get cart details --------------- ');
      }
    });
  };

  fetchGetCategory = async () => {
    this.props.fetchCategoryData();
  };

  addRedeem = () => {
    const {categoryStore} = this.props;
    const {categoryData, loader} = categoryStore;

    categoryData.map((singleMenu, categoryIndex) => {
      if (
        singleMenu.CategoryName === 'Cups' &&
        singleMenu.SubCategoryInfolst[0].SubCategoryName === 'Cups'
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
          IsRedeem: true,
          disabledReedemButton: () => {
            setTimeout(() => {
              this.getCardData();
            }, 2000);
          },
        });
      }
    });
  };

  fetchSlideByUser = async () => {
    try{
      await fetchBannerRequest();
    }catch(error) {
      console.log('FETCH_BANNER_ERROR - ', error);
    }
  };

  progressBarData() {
    const {userDetails} = this.props.userstore;
    const {LeftRewardPoints} = userDetails;

    if (LeftRewardPoints <= 75) {
      //First Bar
      if (LeftRewardPoints == 75) {
        this.setState({
          firstCircleColor: 'lightblue',
          progressBarcompleted1Data: '100%',
          secondCircleColor: '#E8E8E8',
          thirdCircleColor: '#E8E8E8',
          progressBarcompleted2Data: '0%',
          progressBarcompleted3Data: '0%',
          progressBarcompleted4Data: '0%',
        });
      } else if (LeftRewardPoints < 75) {
        let percentage = parseInt((LeftRewardPoints / 75) * 100);
        this.setState({
          firstCircleColor: '#E8E8E8',
          progressBarcompleted1Data: `${percentage}%`,

          secondCircleColor: '#E8E8E8',
          thirdCircleColor: '#E8E8E8',
          progressBarcompleted2Data: '0%',
          progressBarcompleted3Data: '0%',
          progressBarcompleted4Data: '0%',
        });
      }
    }
    if (LeftRewardPoints > 75 && LeftRewardPoints <= 150) {
      // Second Bar
      this.setState({
        firstCircleColor: 'lightblue',
        progressBarcompleted1Data: '100%',

        thirdCircleColor: '#E8E8E8',
        progressBarcompleted3Data: '0%',
        progressBarcompleted4Data: '0%',
      });
      if (LeftRewardPoints >= 150) {
        this.setState({
          secondCircleColor: 'lightblue',
          progressBarcompleted2Data: '100%',
        });
      } else if (LeftRewardPoints < 150) {
        let data = LeftRewardPoints - 75;
        let percentage = parseInt((data / 75) * 100);
        this.setState({
          secondCircleColor: '#E8E8E8',
          progressBarcompleted2Data: `${percentage}%`,
        });
      }
    }
    if (LeftRewardPoints > 150 && LeftRewardPoints <= 225) {
      // Third Bar
      this.setState({
        firstCircleColor: 'lightblue',
        progressBarcompleted1Data: '100%',
        secondCircleColor: 'lightblue',
        progressBarcompleted2Data: '100%',

        progressBarcompleted4Data: '0%',
      });

      if (LeftRewardPoints >= 225) {
        this.setState({
          thirdCircleColor: 'lightblue',
          progressBarcompleted3Data: '100%',
        });
      } else if (LeftRewardPoints < 225) {
        let data = LeftRewardPoints - 150;
        let percentage = parseInt((data / 75) * 100);
        this.setState({
          thirdCircleColor: '#E8E8E8',
          progressBarcompleted3Data: `${percentage}%`,
        });
      }
    }
    if (LeftRewardPoints > 225) {
      // Third Bar
      this.setState({
        firstCircleColor: 'lightblue',
        progressBarcompleted1Data: '100%',
        secondCircleColor: 'lightblue',
        progressBarcompleted2Data: '100%',
        thirdCircleColor: 'lightblue',
        progressBarcompleted3Data: '100%',
      });
      if (LeftRewardPoints < 300) {
        let data = LeftRewardPoints - 225;
        let percentage = parseInt((data / 75) * 100);
        this.setState({
          progressBarcompleted4Data: `${percentage}%`,
        });
      } else if (LeftRewardPoints > 300) {
        this.setState({
          progressBarcompleted4Data: `100%`,
        });
      }
    }
    setTimeout(() => {
      this.setState({
        spinner: false,
      });
    }, 500);
  }

  render() {
    const {messageStore} = this.props;
    const {inboxData, loader, messageCount} = messageStore;
    const {isUserLoggedIn, loading, userDetails} = this.props.userstore;
    const {
      IsRedeem,
      spinner, 
      firstCircleColor,
      secondCircleColor,
      thirdCircleColor,
      progressBarcompleted1Data,
      progressBarcompleted2Data,
      progressBarcompleted3Data,
      progressBarcompleted4Data,
    } = this.state;

    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });

    const headreZindex = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const headreTitleBottom = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <View style={{...styles.container}}>
        <Spinner visible={spinner} size="large" color="#793422" />
        <Animated.View
          useNativeDriver={true}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            backgroundColor: '#fff',
            height: headerHeight,
            zIndex: 3000,
            borderBottomColor: '#414040',
            borderBottomWidth: 0.3,
          }}>
          <View style={{flex: 1}}>
            <View
              style={{
                borderColor: '#EAEAEA',
                width: '100%',
                alignItems: 'center',
              }}
            />
            <Animated.View
              useNativeDriver={true}
              style={{
                position: 'absolute',
                margin: 10,
                width: '90%',
                bottom: headreTitleBottom,
              }}>
              <View style={{flexDirection: 'column', marginTop: 60}}>
                <Text style={styles.headerText}>Hungry meets</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.headerText, {marginTop: -5}]}>
                    happy
                  </Text>
                  <FastImage
                    source={iceCreamCorn}
                    style={{width: 32, height: 32}}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 10,
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                  {isUserLoggedIn != null && isUserLoggedIn == false ? (
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => topLevelNavigate('login')}>
                      <FastImage
                        source={SignIn}
                        style={{width: 30, height: 20}}
                        resizeMode="contain"
                      />
                      <View style={{justifyContent: 'center'}}>
                        <Text
                          style={{
                            marginLeft: 3,
                            fontSize: 15,
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          Sign in
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => topLevelNavigate('account')}>
                      <FastImage
                        source={User_Profile}
                        style={{width: 18, height: 18, alignSelf: 'center'}}
                        resizeMode="contain"
                      />
                      <View style={{justifyContent: 'center'}}>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 15,
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          Profile
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => topLevelNavigate('inbox')}
                    style={{
                      flexDirection: 'row',
                      position: 'relative',
                      marginLeft: 15,
                    }}>
                    <FastImage
                      source={Inbox}
                      style={{width: 25, height: 20}}
                      resizeMode="contain"
                    />
                    <View style={{justifyContent: 'center'}}>
                      <Text style={{marginLeft: 5, fontSize: 15}}>Inbox</Text>
                    </View>
                    {messageCount > 0 ? (
                      <Badge
                        value={messageCount}
                        status="error"
                        containerStyle={{
                          position: 'absolute',
                          top: 0,
                          right: -20,
                        }}
                      />
                    ) : null}
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.ScrollView
          style={{flex: 1}}
          bounces={true}
          scrollEventThrottle={16}
          useNativeDriver={true}
          scrollsToTop={true}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {useNativeDriver: false},
          )}
          showsVerticalScrollIndicator={false}>

          <View style={{marginTop: 10, marginBottom: 5, marginTop: 200}}>
            {/* code here for the rewards points */}

            {isUserLoggedIn != null && isUserLoggedIn == true && !spinner ? (
              <ProgressBar
                data={{
                  firstCircleColor,
                  secondCircleColor,
                  thirdCircleColor,
                  progressBarcompleted1Data,
                  progressBarcompleted2Data,
                  progressBarcompleted3Data,
                  progressBarcompleted4Data,
                  IsRedeem,
                }}
                add={() => this.addRedeem()}
              />
            ) : null}

            {this.props.bannerStore?.banners.length > 0
              ? this.props.bannerStore?.banners.map((singleslide, index) => {
                  return (
                    <View style={styles.bannerView} key={index}>
                      <View>
                        <FastImage
                          resizeMode="stretch"
                          source={{
                            uri: `${HostURL}${singleslide.Pic}`,
                          }}
                          style={styles.bannerImage}
                        />
                      </View>
                      <View>
                        <Text style={styles.bannerTitle}>
                          {singleslide.SliderTitle}
                        </Text>
                        <Text numberOfLines={2} style={styles.bannerSubTitle}>
                          {singleslide.Description}
                        </Text>
                        <View
                          style={{
                            width: 77,
                            height: 30,
                            margin: 15,
                          }}>
                          {isUserLoggedIn != null &&
                          isUserLoggedIn == true &&
                          singleslide.ButtonName === 'Order Now' ? (
                            <TouchableOpacity
                              onPress={() => {
                                if(singleslide.ButtonName == 'Order Now')
                                  {
                                    navigateRootBottomTab('Order');
                                    setTimeout(()=>{
                                      navigateTopTabRef('Menu');
                                    },150);
                                  }
                                else
                                  topLevelNavigate('login');
                              }}
                              style={styles.bannerButton}>
                              <Text style={styles.bannerButtonText}>
                                {singleslide.ButtonName.split(' ')[0]}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {isUserLoggedIn != null && isUserLoggedIn == false ? (
                            <TouchableOpacity
                              onPress={() => {
                                singleslide.ButtonName == 'Login' ||
                                singleslide.ButtonName == 'Order Now'
                                  ? topLevelNavigate('login')
                                  : topLevelNavigate('singup');
                              }}
                              style={styles.bannerButton}>
                              <Text style={styles.bannerButtonText}>
                                {singleslide.ButtonName.split(' ')[0]}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        </Animated.ScrollView>
        <>
          {isUserLoggedIn != null && isUserLoggedIn == false ? (
            <View
              style={{
                position: 'absolute',
                left: Dimensions.get('window').width * 0.63,
                right: 30,
                bottom: 30,
                width: 120,
              }}>
              <TouchableOpacity
                onPress={() => {
                  topLevelNavigate('singup');
                }}
                style={{
                  backgroundColor: '#793422',
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                  marginLeft: 30,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50,
                    width: 120,
                  }}>
                  <Text
                    style={{
                      color: '#F9F9F9',
                      fontSize: 16,
                      textAlign: 'center',
                      fontFamily: 'OpenSans-Bold',
                    }}>
                    Join Now
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#EAEAEA',
    height: 130,
  },
  headerView: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 0,
  },
  headerText: {
    fontSize: 30,
    marginStart: 15,
    marginEnd: 10,
    color: '#000',
    fontFamily: 'OpenSans-Bold',
  },
  headerImageView: {
    height: 50,
    margin: 10,
    padding: 5,
    marginBottom: 30,
    paddingBottom: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardParentView: {
    backgroundColor: '#FFF',
    width: '97%',
    height: 360,
    margin: 10,
    borderColor: 'red',
    borderWidth: 0,
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
    fontWeight: '700',
    margin: 5,
  },
  cardSubtitleText: {
    fontSize: 16,
    color: '#2D0400',
    paddingStart: 10,
    paddingEnd: 10,
    fontWeight: '600',
    margin: 1,
    width: '90%',
    flexDirection: 'column',
  },
  barText: {
    marginLeft: -5,
  },
  barText2: {
    marginLeft: -10,
  },
  progressBarMainView: {
    flexDirection: 'column',
    width: '24%',
  },
  progressBar: {
    borderWidth: 1,
    width: '100%',
    height: 4,
    backgroundColor: '#E8E8E8',
    borderColor: '#E8E8E8',
    margin: 4,
    marginStart: -1,
    justifyContent: 'center',
  },
  progressBarcompleted: {
    height: 4,
    backgroundColor: 'lightblue',
  },
  Circle: {
    borderWidth: 1,
    width: 15,
    height: 15,
    borderColor: '#E8E8E8',
    borderRadius: 7.5,
    marginStart: -5,
  },
  freeMiniText: {
    flexWrap: 'wrap',
    fontWeight: '500',
    fontSize: 12,
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'right',
  },
  bannerView: {
    height: 350,
    width: '97%',
    marginTop: 9,
    alignSelf: 'center',
    backgroundColor: '#F9F9F9',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 7,
  },
  bannerImage: {
    width: '100%',
    alignSelf: 'center',
    height: 200,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  bannerTitle: {
    fontSize: 19,
    color: '#222624',
    marginTop: 15,
    marginStart: 15,
    marginEnd: 8,
    fontFamily: 'OpenSans-Bold',
  },
  bannerSubTitle: {
    fontSize: 13,
    fontFamily: 'OpenSans-SemiBold',
    color: '#262A29',
    marginTop: 8,
    marginStart: 15,
    marginEnd: 8,
  },
  bannerButton: {
    backgroundColor: '#793422',
    borderRadius: 50,
    width: 77,
    height: 30,
    borderColor: '#000',
    borderWidth: 0,
    justifyContent: 'center',
  },
  bannerButtonText: {
    color: '#F9F9F9',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
  },
});

const mapStateToProps = state => {
  return {
    reduxStore: state,
    userstore: state.userstore,
    messageStore: state.messageStore,
    categoryStore: state.categoryStore,
    getCartStore: state.getCartStore,
    bannerStore: state.bannerStore
  };
};

const mapDispatchToProps = dispatch => {
  return {
    isUserLoggedIn: () => {
      dispatch(validateIsUserLoggedIn());
    },
    fetchMessageData: () => {
      dispatch(getMessageData());
    },
    updateUserOnEditDispatch: () => {
      dispatch(updateUserOnEdit());
    },
    fetchCategoryData: () => {
      dispatch(getCategoryData());
    },
    categoryCollapse: id => {
      dispatch(handleCollapse(id));
    },
    readyProductDispatch: () => {
      dispatch(readyProduct());
    },
    setCurrentSelectedCategoryDispatch: categoryData => {
      dispatch(setCurrentSelectedCategory(categoryData));
    },
    dispatch,
    fetchCartData: cb => {
      dispatch(fetchCartDataAsyncCreator(cb));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
