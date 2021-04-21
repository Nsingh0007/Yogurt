import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { version } from '../../../package.json';
import SwitchToggle from 'react-native-switch-toggle';
import cross from '../../assets/icon/Wrong.png';
import rightArrow from '../../assets/icon/order/icons8-forward-26.png'
import { userLogoutSucess, updateUserOnEdit } from '@redux';
import { UpdateNotificationData, addToken } from '@api'
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'; 

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      InboxNotification: this.props.userstore.userDetails.IsInboxNotification,
      OrderItemNotification: this.props.userstore.userDetails.IsOrderNotification,
      fcmToken: ''
    };
  }

  componentDidMount = async () => { 
  };   

  addFcmToken = async () => {
    if (NotificationService.hasToken && NotificationService.hasPermission) {
      let body = {
        IsTokenAvailable: true,
        TokenUpdateTime: new Date().toISOString(),
        DeviceToken: NotificationService.getToken()
      }
      const FcmTokenUpdate = await addToken(body); 
    } 
  }

  handleNotificationToggle = (ToggleOf) => {
    if (ToggleOf === 'inbox') {
      this.setState({ InboxNotification: !this.state.InboxNotification })
    } else {
      this.setState({ OrderItemNotification: !this.state.OrderItemNotification })
    }
    setTimeout(() => {
      this.HandleUpdateNotification()
    }, 500);

  }

  openPrivacyURL = async () => {
    let URL = 'http://ec2-54-145-253-240.compute-1.amazonaws.com/Yogurt_PrivacyPolicy/PrivacyPolicy.html'
    const canOpen = await Linking.canOpenURL(URL)
    if (canOpen) {
      await Linking.openURL(URL)
    } else {
      Alert.alert('Oops..', 'Sorry unable to open privacy policy')
    }
  }

  openTermsURL = async () => {
    let URL = 'http://ec2-54-145-253-240.compute-1.amazonaws.com/Yogurt_PrivacyPolicy/ApplicationTerms.html'
    const canOpen = await Linking.canOpenURL(URL)
    if (canOpen) {
      await Linking.openURL(URL)
    } else {
      Alert.alert('Oops..', 'Sorry unable to open privacy policy')
    }
  }

  HandleUpdateNotification = async () => {
    const { InboxNotification, OrderItemNotification } = this.state
    let body = {
      IsInboxNotification: InboxNotification,
      IsOrderNotification: OrderItemNotification
    }
    const notify = await UpdateNotificationData(body);
    if (notify.result != true) {
      //Alert.alert('Oops..','Something went wrong, please try again later...')
    }
    this.props.updateUserOnEditDispatch();
  }

  render() {
    const { isUserLoggedIn, loading, userDetails } = this.props.userstore;
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{ marginStart: 15, width: 30, margin: 4, borderColor: 'red', borderWidth: 0 }}>
            <FastImage source={cross} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>

          <Text style={styles.headerText}>Account</Text>
        </View>
        <ScrollView bounces={false}>
          <View style={styles.NameEmailView}>
            <Text style={styles.NameText}>{`${userDetails?.FirstName} ${userDetails?.LastName}`}</Text>
            <Text style={styles.emailText}>{userDetails?.Email}</Text>
          </View>

          <Text style={styles.subHeaderText}>Profile</Text>

          <View>

            <TouchableOpacity onPress={() =>
              isUserLoggedIn != null && isUserLoggedIn == false ?
                this.props.navigation.navigate('login')
                :
                this.props.navigation.navigate('personalinfo')}>

              <View style={styles.subHeaderView}>
                <Text style={styles.subHeaderTextContent}>Personal Info</Text>
                <View style={{ justifyContent: 'center' }}>
                  <FastImage source={rightArrow} style={{ width: 15, height: 15, marginRight: 10 }} />
                </View>
              </View>

            </TouchableOpacity>

          </View>

          <Text style={styles.subHeaderText}>Notification Preferences</Text>

          <View>

            <View style={styles.subHeaderView}>
              <Text style={styles.subHeaderTextContent}>Inbox messages</Text>
              <View style={{ justifyContent: 'center' }}>
                <SwitchToggle
                  containerStyle={styles.swithContainerStyle}
                  circleStyle={styles.swithCircleStyle}
                  switchOn={this.state.InboxNotification}
                  onPress={() => this.handleNotificationToggle(data = 'inbox')}
                  circleColorOff="white"
                  circleColorOn="#FFFFFF"
                  duration={100}
                  backgroundColorOn="#793422"
                />
              </View>
            </View>

            <View style={styles.subHeaderView}>
              <Text style={styles.subHeaderTextContent}>Orders & item changes</Text>
              <View style={{ justifyContent: 'center' }}>
                <SwitchToggle
                  containerStyle={styles.swithContainerStyle}
                  circleStyle={styles.swithCircleStyle}
                  switchOn={this.state.OrderItemNotification}
                  onPress={() => this.handleNotificationToggle(data = 'order')}
                  circleColorOff="white"
                  circleColorOn="#FFFFFF"
                  duration={100}
                  backgroundColorOn="#793422"
                />
              </View>
            </View>

          </View>

          <Text style={styles.subHeaderText}>Policies</Text>

          <View>

            <TouchableOpacity onPress={() => this.openTermsURL()}>
              <Text style={styles.policyText}>Application Terms</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.openPrivacyURL()}>
              <Text style={styles.policyText}>Privacy Statement</Text>
            </TouchableOpacity>

            <View style={styles.signOutButton}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Logout',
                    'Are you sure to Logout?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Logout',
                        onPress: async () => {
                          this.addFcmToken();
                          this.props.userLogoutSucessDispatch();
                          let keys = [
                            'userLoggedIn',
                            'userLoggedInData',
                            'userLoggedInToken',
                          ];
                          await AsyncStorage.multiRemove(keys, (err) => { });
                          this.props.navigation.navigate('RootHome');
                        },
                      },
                    ],
                    { cancelable: false },
                  );
                }}
              >
                <Text style={styles.signOutText}>Sign out</Text>
              </TouchableOpacity>
            </View>

          </View>
          <Text style={styles.versionText}>
            App Version : {version+' (2.6)'}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomColor: '#414040',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerView: {
    flexDirection: 'column',
    borderBottomColor: '#414040',
    borderWidth: 0,
    borderBottomWidth: 0.2,
    backgroundColor: '#FFF'
  },
  headerText: {
    fontSize: 24,
    margin: 7,
    marginTop: 20,
    marginStart: 20,
    color: '#222624',
    fontFamily: 'OpenSans-Bold',
  },
  NameText: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold'
  },
  emailText: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular'
  },
  NameEmailView: {
    width: '93%',
    alignSelf: 'center',
    marginTop: 20
  },
  subHeaderView: {
    width: "92%",
    alignSelf: 'flex-end',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subHeaderText: {
    marginTop: 20,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold'
  },
  subHeaderTextContent: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
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
    backgroundColor: 'white',
  },
  notificationButton: {
    width: 150,
    height: 30,
    justifyContent: 'center',
    marginLeft: 25,
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: '#793422',
  },
  notificationText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'OpenSans-SemiBold',
  },
  signOutButton: {
    width: 80,
    height: 30,
    justifyContent: 'center',
    marginLeft: 30,
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#793422'
  },
  signOutText: {
    color: '#793422',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
  },
  policyText: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    marginLeft: 30,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  versionText: {
    fontSize: 10,
    fontFamily: 'OpenSans-SemiBold',
    margin: 30,
    alignSelf: 'center',
  }
});
const mapStateToProps = (state) => {
  return {
    userstore: state.userstore,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    userLogoutSucessDispatch: () => {
      dispatch(userLogoutSucess());
    },
    updateUserOnEditDispatch: () => {
      dispatch(updateUserOnEdit());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Account);