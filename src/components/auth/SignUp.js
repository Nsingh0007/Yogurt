import React, { Component } from 'react';;
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
  Dimensions,
  Modal,
  TouchableOpacity,
  Platform,
  LogBox
} from 'react-native';
LogBox.ignoreAllLogs()
import Spinner from 'react-native-loading-spinner-overlay';
import { updateUserTree } from '@redux';
import { connect } from 'react-redux';
import { CheckBox, Overlay } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import FastImage from 'react-native-fast-image';
import uncheck from '../../assets/icon/uncehck.png';

import rightPwd from '../../assets/icon/8_Right.png';

import wrongPwd from '../../assets/icon/7_Wrong_red.png';

import noChangePwd from '../../assets/icon/Wrong.png';

import cross from '../../assets/icon/Wrong.png';

import checked from '../../assets/icon/checked.png';

import errorIcon from '../../assets/icon/3_Error.png';

import eyePassword1 from '../../assets/icon/eyePassword1.png';

import eyePassword from '../../assets/icon/eyePassword.png';

import FloatingLabel from 'react-native-floating-labels';

import userLogo from '../../assets/icon/Successfully_Reset_Password.png';

import { createUser } from '@api';

import firebase from 'react-native-firebase';

const HEADER_MAX_HEIGHT = 110;
const HEADER_MIN_HEIGHT = 70;

const FloatBorderWidth = Platform.select({
  ios: 2,
  android: 0
})

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      checked1: false,
      checked2: false,
      checked3: false,
      collapsed: true,
      FirstName: '',
      LastName: '',
      EmailId: '',
      Password: '',
      MobileNumber: '',
      spinner: false,
      showPassword: true,
      Alert_Visibility: false,
      fcmToken: ''
    };
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  toggleSwitch() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  componentDidMount = async () => {
    const fcmToken = await this.checkPermission();
    if (fcmToken != '' || fcmToken != undefined || fcmToken != null) {
      this.setState({ fcmToken })
    }
  }

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      const Token = this.getFcmToken();
      return Token
    } else {
      this.requestPermission();
    }
  }

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token from signUp ========', fcmToken);
    } else {
      console.log('FCM Token ========', 'No token received');
      return null
    }
    return fcmToken
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  }

  messageListener = async () => {
    const notificationListener = firebase.notifications().onNotification((notification) => {
      firebase.notifications().displayNotification(notification)
    });

    const messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
  }

  UserRegistrationFunction = async () => {
    this.setState({ spinner: true });
    const { FirstName, LastName, EmailId, Password, MobileNumber, fcmToken } = this.state;
    let Mobile = MobileNumber.split('-').join('');
    const createUserResponse = await createUser({
      FirstName,
      LastName,
      EmailId,
      Password,
      MobileNumber: Mobile,
      IsTokenAvailable: fcmToken === '' ? false : true,
      TokenUpdateTime: new Date().toISOString(),
      DeviceToken: fcmToken,
      IsInboxNotification: true,
      IsOrderNotification: true,
    });
    if (createUserResponse.result === true) {
      this.props.updateUserTreeOnSignup(createUserResponse.response);
      setTimeout(() => {
        this.setState({
          spinner: !this.state.spinner,
        });
        this.Show_Custom_Alert();
      }, 100);
    } else {
      this.setState({
        spinner: !this.state.spinner,
      }, () => {
        setTimeout(() => {
          this.myAlert('Error', createUserResponse.error)
        }, 10);
      });
    }
    return;
  };

  myAlert = (title = '', message = '') => {
    Alert.alert(title, message);
  };

  toggleExpanded = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed });
  };

  Show_Custom_Alert(visible) {
    this.setState({ Alert_Visibility: visible }, () => { this.props.navigation.navigate('topNav') });
  };

  ok_Button = () => {
    Alert.alert('OK Button Clicked');
  };

  validateUser = () => {
    const { FirstName, LastName, EmailId, Password, MobileNumber } = this.state;
    if (FirstName.length === 0) {
      this.myAlert('Message', 'Please enter your first name');
    } else if (LastName.length === 0) {
      this.myAlert('Message', 'Please enter your last name');
    } else if (EmailId.length === 0) {
      this.myAlert('Message', 'Please enter your email');
    } else if (MobileNumber.length === 0) {
      this.myAlert('Message', 'Please enter your mobile number');
    } else if (Password.length === 0) {
      this.myAlert('Message', 'Please enter your password');
    }

    else if (!this.state.checked3) {
      this.myAlert('Message', 'please accept the Terms of use');
    } else {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!EmailId.match(mailformat)) {
        this.myAlert('Message', 'Invalid email');
        return false;
      }
      let mobileNo = MobileNumber.split('-').join('');
      const mobileformat = /^(?:[0-9] ?){6,14}[0-9]$/;
      if (!mobileNo.match(mobileformat)) {
        this.myAlert('Message', 'Invalid mobile number');
        return false;
      }
      const pwd = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.?_])(?=.{8,})';
      if (!Password.match(pwd)) {
        this.myAlert('Message', 'Invalid password');
        return false;
      }
      this.UserRegistrationFunction();
    }
  };

  returnMyValidateImg = (resultType) => {
    return resultType == 0
      ? noChangePwd
      : resultType == 1
        ? rightPwd
        : wrongPwd;
  };

  collapsibleView = ({
    between8To25,
    atLeastOneNumber,
    atLeastOneCapital,
    atLeastOneLower,
    atLeastOneSymbol,
  }) => {
    return (
      <View style={{ marginBottom: 50, marginTop: 0, borderColor: 'red', borderWidth: 0, width: '100%', margin: -10, }}>

        <View style={{ flexDirection: 'row', margin: 3 }}>
          <FastImage
            source={this.returnMyValidateImg(between8To25)}
            style={{ width: 20, height: 20 }}
          />
          <Text>Between 8 and 25 character</Text>
        </View>
        <View style={{ flexDirection: 'row', margin: 3 }}>
          <FastImage
            source={this.returnMyValidateImg(atLeastOneNumber)}
            style={{ width: 20, height: 20 }}
          />
          <Text>At least one number</Text>
        </View>
        <View style={{ flexDirection: 'row', margin: 3 }}>
          <FastImage
            source={this.returnMyValidateImg(atLeastOneCapital)}
            style={{ width: 20, height: 20 }}
          />
          <Text>At least one capital letter</Text>
        </View>
        <View style={{ flexDirection: 'row', margin: 3 }}>
          <FastImage
            source={this.returnMyValidateImg(atLeastOneLower)}
            style={{ width: 20, height: 20 }}
          />
          <Text>At least one lower case </Text>
        </View>
        <View style={{ flexDirection: 'row', margin: 3 }}>
          <FastImage
            source={this.returnMyValidateImg(atLeastOneSymbol)}
            style={{ width: 20, height: 20 }}
          />
          <Text>
            At least one special character such as exclaim point or comma.
          </Text>
        </View>
      </View>
    );
  };

  validatePasswordField(Password = '') {
    let returnObj = {
      between8To25: 0,
      atLeastOneNumber: 0,
      atLeastOneCapital: 0,
      atLeastOneLower: 0,
      atLeastOneSymbol: 0,
      allValidateComplete: 0,
      allZero: true,
    };
    let ATLEST_ONE_NUMBER_REGEX = /.*[0-9].*/;
    let ATLEST_ONE_CAPITAL_REGEX = /.*[A-Z].*/;
    let ATLEST_ONE_LOWER_REGEX = /.*[a-z].*/;
    let ATLEST_ONE_SYMBOL = /.*[!@#$%^&*.?_].*/;

    //Length Logic
    if (Password.length === 0 || Password === undefined || Password === null) {
      returnObj.between8To25 = 0;
      returnObj.atLeastOneNumber = 0;
      returnObj.atLeastOneCapital = 0;
      returnObj.atleastOneLower = 0;
      returnObj.allZero = true;
    } else if (Password.length >= 8 && Password.length <= 25) {
      returnObj.between8To25 = 1;
    } else {
      returnObj.between8To25 = 2;
    }

    //Atleast One Number Logic
    if (Password.length > 0) {
      if (Password.match(ATLEST_ONE_NUMBER_REGEX)) {
        returnObj.atLeastOneNumber = 1;
      } else {
        returnObj.atLeastOneNumber = 2;
      }

      if (Password.match(ATLEST_ONE_CAPITAL_REGEX)) {
        returnObj.atLeastOneCapital = 1;
      } else {
        returnObj.atLeastOneCapital = 2;
      }

      if (Password.match(ATLEST_ONE_LOWER_REGEX)) {
        returnObj.atLeastOneLower = 1;
      } else {
        returnObj.atLeastOneLower = 2;
      }

      if (Password.match(ATLEST_ONE_SYMBOL)) {
        returnObj.atLeastOneSymbol = 1;
      } else {
        returnObj.atLeastOneSymbol = 2;
      }
      returnObj.allZero = false;
    }

    returnObj.allValidateComplete = returnObj.allZero
      ? 0
      : returnObj.atLeastOneLower == 1 &&
        returnObj.atLeastOneCapital == 1 &&
        returnObj.atLeastOneNumber == 1 &&
        returnObj.atLeastOneSymbol == 1 &&
        returnObj.between8To25 == 1
        ? 1
        : 2;
    return returnObj;
  };

  pickFName = (FirstName) => {
    let re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    if (re.test(FirstName) || FirstName == '') {
      this.setState({
        FirstName: FirstName
      })
    }
  }

  pickLName = (name) => {
    let re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    if (re.test(name) || name == '') {
      this.setState({
        LastName: name
      })
    }
  }

  phoneNoWithDash = (phoneNo) => {
    let output = phoneNo;
    let str = phoneNo.split('-').join('');
    let seprator = '-';

    let strArr = str.split('');
    for (let i = 0; i < strArr.length; i++) {
      if (i === 3) {
        output = [str.slice(0, 3), seprator, str.slice(3)].join('');
      } else if (i === 6) {
        output = [
          str.slice(0, 3),
          seprator,
          str.slice(3, 6),
          seprator,
          str.slice(6),
        ].join('');
      }
    }
    return output;
  }

  render() {
    const {
      between8To25,
      allValidateComplete,
      atLeastOneNumber,
      atLeastOneCapital,
      atLeastOneLower,
      atLeastOneSymbol,
    } = this.validatePasswordField(this.state.Password);
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
      <View style={{ flex: 1 }}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.spinner}
          color="#793422"
        //Text with the Spinner
        />

        <View>
          <View style={styles.header}>
            <View style={styles.headerView}>
              <View style={{ height: 40, width: 40 }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Home')}>
                  <FastImage
                    source={cross}
                    style={{ width: 30, height: 30, marginStart: 15 }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.headerText}>  Yogurt & Such Rewards</Text>
            </View>
          </View>
        </View>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } },
          ], () => { console.log('') })}>
          <View style={{ margin: 10, marginTop: 20, width: '98%' }}>
            <View style={styles.cardParentView}>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#000',
                    margin: 10,
                    marginStart: 15,
                    fontWeight: '700',
                  }}>
                  Personal info
                </Text>

                <FloatingLabel
                  labelStyle={styles.labelInput}
                  inputStyle={styles.input}
                  value={this.state.FirstName}
                  onChangeText={FirstName => this.pickFName(FirstName)}
                  style={styles.formInput}>
                  First Name
                </FloatingLabel>
                <FloatingLabel
                  labelStyle={styles.labelInput}
                  inputStyle={styles.input}
                  value={this.state.LastName}
                  onChangeText={(LastName) => this.pickLName(LastName)}
                  style={styles.formInput}>
                  Last Name
                </FloatingLabel>
                <FloatingLabel
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  labelStyle={styles.labelInput}
                  inputStyle={styles.input}
                  value={this.phoneNoWithDash(this.state.MobileNumber)}
                  maxLength={12}
                  onChangeText={(MobileNumber) => this.setState({ MobileNumber: this.phoneNoWithDash(MobileNumber) })}
                  style={styles.formInput}>
                  Mobile Number
                </FloatingLabel>
              </View>
            </View>

            <View style={styles.cardParentView}>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#000',
                    margin: 10,
                    marginStart: 15,
                    fontWeight: '700',
                  }}>
                  Security
                </Text>

                <FloatingLabel
                  labelStyle={styles.labelInput}
                  inputStyle={styles.input}
                  value={this.state.EmailId}
                  onChangeText={(EmailId) => this.setState({ EmailId })}
                  style={styles.formInput}>
                  Email
                </FloatingLabel>
                <View style={{ height: 300, }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '100%' }}>
                      <FloatingLabel
                        autoCapitalize="none"
                        labelStyle={styles.labelInput}
                        inputStyle={{
                          ...styles.input,
                          borderBottomColor:
                            allValidateComplete === 0 ||
                              allValidateComplete === 1
                              ? '#E5E5E5'
                              : 'red',
                        }}
                        password={this.state.showPassword}
                        onFocus={this.toggleExpanded}
                        value={this.state.Password}
                        onChangeText={(Password) => this.setState({ Password })}
                        style={styles.formInput}>
                        Password
                      </FloatingLabel>
                    </View>
                    {
                      allValidateComplete == 2 && (
                        <FastImage
                          source={errorIcon}
                          style={{
                            width: 24,
                            height: 24,
                            marginStart: -100,
                            marginEnd: 10,
                            margin: 7,
                            marginTop: 30,
                            resizeMode: 'contain'
                          }}
                        />
                      )
                    }
                    {
                      this.state.Password != '' && (
                        <TouchableOpacity
                          onPress={this.toggleSwitch}
                        >
                          {
                            !this.state.showPassword ?
                              <FastImage
                                source={eyePassword}
                                style={{ width: 30, height: 30, margin: 5, paddingEnd: 10, marginTop: 26, resizeMode: 'contain' }}
                              /> :
                              <FastImage
                                source={eyePassword1}
                                style={{ width: 30, height: 30, margin: 5, paddingEnd: 10, marginTop: 26, resizeMode: 'contain' }}
                              />
                          }
                        </TouchableOpacity>
                      )
                    }
                  </View>
                  <View
                    collapsed={this.state.collapsed}
                    style={{
                      width: '100%',
                      borderColor: 'red',
                      borderWidth: 0,
                      marginEnd: 10,
                      marginBottom: 20,
                      padding: 10,
                      height: 164,
                    }}>
                    <this.collapsibleView
                      between8To25={between8To25}
                      atLeastOneNumber={atLeastOneNumber}
                      atLeastOneCapital={atLeastOneCapital}
                      atLeastOneLower={atLeastOneLower}
                      atLeastOneSymbol={atLeastOneSymbol}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.cardParentView2}>
              <View style={{ borderColor: 'red', borderWidth: 0 }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#000',
                    margin: 10,
                    fontWeight: '700',
                  }}>
                  Preferences & Terms
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <CheckBox
                    checked={this.state.checked1}
                    onPress={() =>
                      this.setState({ checked1: !this.state.checked1 })
                    }
                    checkedIcon={
                      <FastImage source={checked} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                    }
                    uncheckedIcon={
                      <FastImage source={uncheck} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                    }
                  />

                  <View
                    style={{
                      flexDirection: 'column',
                      borderColor: 'red',
                      borderWidth: 0,
                      width: '85%',
                      marginTop: 7,
                      marginLeft: -10
                    }}>
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-SemiBold',
                      padding: 7,
                      paddingBottom: -2,
                      marginEnd: 10,
                    }}>
                      Yes, I’d like email from yogurt & such
                    </Text>
                    <Text
                      style={{ paddingStart: 10, paddingEnd: 10, paddingTop: 5, fontSize: 12, color: '#2D0400', fontFamily: 'OpenSans-SemiBold', }}>
                      {`Know about product offers, announcements and initiatives.`}
                    </Text>
                  </View>
                </View>

                {/* {
                  Platform.OS === "ios" ?
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <CheckBox
                        checked={this.state.checked2}
                        onPress={() =>
                          this.setState({ checked2: !this.state.checked2 })
                        }
                        checkedIcon={
                          <FastImage source={checked} style={{ width: 25, height: 25 }} />
                        }
                        uncheckedIcon={
                          <FastImage source={uncheck} style={{ width: 25, height: 25 }} />
                        }
                      />
                      <View
                        style={{
                          flexDirection: 'column',
                          borderColor: 'red',
                          borderWidth: 0,
                          width: '85%',
                          marginTop: 7,
                          marginLeft: -10
                        }}>
                        <Text style={{
                          fontSize: 14,
                          padding: 7,
                          paddingBottom: -2,
                          marginEnd: 10,
                          fontFamily: 'OpenSans-SemiBold',
                        }}>
                          I’d like sign in faster
                    </Text>
                        <Text
                          style={{ paddingStart: 10, paddingEnd: 10, fontSize: 12, color: '#2D0400', fontFamily:'OpenSans-SemiBold' }}>
                          Use iCloud keychain to securely store sign in credentials.
                    </Text>
                      </View>
                    </View>
                    : null
                } */}

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <CheckBox
                    style={{ paddingStart: 30 }}
                    checked={this.state.checked3}
                    onPress={() =>
                      this.setState({ checked3: !this.state.checked3 })
                    }
                    checkedIcon={
                      <FastImage source={checked} style={{ width: 25, height: 25 }} />
                    }
                    uncheckedIcon={
                      <FastImage source={uncheck} style={{ width: 25, height: 25 }} />
                    }
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      borderColor: 'red',
                      borderWidth: 0,
                      width: '85%',
                      marginTop: 7,
                      marginLeft: -10
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'OpenSans-SemiBold',
                        padding: 7,
                        paddingBottom: -2,
                        marginEnd: 10,
                      }}>
                      I accept the Terms of Use
                    </Text>
                    <Text
                      style={{ paddingStart: 10, paddingEnd: 10, paddingTop: 5, fontSize: 12, color: '#2D0400', fontFamily: 'OpenSans-SemiBold', }}>
                      By joining, I agree to Yogurt & Such privacy policy, and Yogurt & Such application terms.
                    </Text>
                  </View>
                </View>

                <View style={{ margin: 10, marginStart: 65, marginEnd: 20, marginTop: 5 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-SemiBold',
                      color: '#793422',
                      margin: 4,
                    }}>
                    Privacy Policy
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'OpenSans-SemiBold',
                      color: '#793422',
                      margin: 4,
                      marginTop: 0
                    }}>
                    Application Terms
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            position: 'absolute',
            right: 10,
            left: Dimensions.get('window').width * 0.63,
            right: 20,
            bottom: 20,
            width: 120,
          }}>
          <TouchableOpacity
            onPress={() => { this.validateUser() }}
            style={{
              backgroundColor: '#793422',
              borderRadius: 25,
              justifyContent: 'center',
              alignSelf: 'flex-end',
              marginLeft: 30,
            }}>
            <View style={{
              justifyContent: 'center', alignItems: 'center', height: 50,
              width: 120,
            }}>
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 16,
                  textAlign: 'center',
                  fontFamily: 'OpenSans-SemiBold',
                }}>
                Join now
                  </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          visible={this.state.Alert_Visibility}
          transparent={false}
          animationType={'fade'}
          onRequestClose={() => {
            this.Show_Custom_Alert(!this.state.Alert_Visibility);
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              marginTop: 200,
              marginBottom: 20,
            }}>
            <View style={{ height: 100, width: 90 }}>
              <FastImage
                source={userLogo}
                style={{
                  width: 80,
                  height: 60,
                  alignSelf: 'center',
                  margin: 20,
                }}
                resizeMode='contain'
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 33,
                  alignSelf: 'center',
                  fontFamily: 'OpenSans-SemiBold',
                  textAlign: 'center',
                  color: '#414040'
                }}>
                You're in!
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  textAlign: 'center',
                  margin: 10,
                  marginStart: 25,
                  marginEnd: 25,
                }}>
                We have created your account!  The next thing to do is place your first order!
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#793422',
                width: 100,
                alignSelf: 'flex-end',
                margin: 10,
                marginTop: 120,
                marginBottom: 20,
                borderRadius: 50,
                height: 45,
                justifyContent: 'center'
              }}>
              <TouchableOpacity
                onPress={() => { this.Show_Custom_Alert(!this.state.Alert_Visibility) }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 14,
                    fontFamily: 'OpenSans-SemiBold',
                    textAlign: 'center',
                    padding: 10,
                  }}>
                  Order now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
  },
  headerView: {
    flexDirection: 'column',
    marginTop: 6,
  },
  headerText: {
    fontSize: 24,
    margin: 10,
    // marginStart: 20,
    color: '#000',
    fontFamily: 'OpenSans-SemiBold'
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
    // backgroundColor: '#F9F9F9',
    width: '100%',
    alignSelf: 'center',
    borderColor: 'red',
    borderWidth: 0,
    marginEnd: 5
  },
  cardParentView2: {
    // backgroundColor: '#F9F9F9',
    width: '96%',
    marginEnd: 5,
    alignSelf: 'center',
    marginTop: -50,
    marginBottom: 30,
    backgroundColor: '#fff'
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
  input: {
    padding: 5,
    margin: 10,
    fontSize: 14,
    borderColor: '#F9F9F9',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: FloatBorderWidth,
    borderWidth: 0,
    width: '96%',
    alignSelf: 'center'
  },
  labelInput: {
    color: '#505755',
    fontSize: 15,
    paddingStart: 20,
  },

  Alert_Main_View: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009688',
    height: 200,
    width: '90%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
  },

  Alert_Title: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    height: '28%',
  },

  Alert_Message: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    height: '42%',
  },

  buttonStyle: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    marginTop: -5,
  },
});

const mapStateToProps = (state) => {
  return {
    userstore: state.userstore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserTreeOnSignup: (payload) => {
      dispatch(updateUserTree(payload));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
