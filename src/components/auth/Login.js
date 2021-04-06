import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  LogBox,
  Platform
} from 'react-native';
import FastImage from 'react-native-fast-image';
import cross from '../../assets/icon/Wrong.png';
LogBox.ignoreAllLogs()
import Spinner from 'react-native-loading-spinner-overlay';
import eyePassword from '../../assets/icon/eyePassword.png';
import eyePassword1 from '../../assets/icon/eyePassword1.png';
import { connect } from 'react-redux';
import { updateUserTree } from '@redux';
import FloatingLabel from 'react-native-floating-labels';
import { loginUser, addToken } from '@api'; 
import { NotificationService } from '@service';
Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      Password: '',
      showPassword: true,
      spinner: false,
      Alert_Visibility: false,
      invalidCredentials: null, 
    };
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }
  toggleSwitch() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  componentDidMount = async () => { 
  }    

  addFcmToken = async () => {
    if (NotificationService.hasToken && NotificationService.hasPermission) {
      let body = {
        IsTokenAvailable: true,
        TokenUpdateTime: new Date().toISOString(),
        DeviceToken: NotificationService.getToken()
      }
      const FcmTokenUpdate = await addToken(body)
      console.log('FCM Token Response Login ---- ', FcmTokenUpdate)
    }
  }

  userLoginFunction = async () => {
    try {
       
      this.setState({ spinner: true });
      const { Email, Password } = this.state;
      const loginUserResponse = await loginUser(Email, Password);

      if (loginUserResponse.result === true) {
        // check for send the data to the profile screen........
        this.props.updateUserTreeOnLogin(loginUserResponse.response);

        setTimeout(() => {
          this.setState({
            spinner: !this.state.spinner,
          });
          this.addFcmToken();
          this.props.navigation.navigate('Home')
        }, 300);
      } else {
        if (loginUserResponse.result == '122') {
          Alert.alert('Message', 'Invalid Credentials', [{ text: 'Okay' }]);
        } else {
          Alert.alert('Error', 'Try Again');
          console.log('getting error here on else-------------');
        }
      }
    } catch (error) {
      this.setState({ invalidCredentials: true, spinner: false });
    }
  };

  myAlert = (title = '', message = '') => {
    Alert.alert(title, message);
  };

  validateUser = () => {
    console.log("NOTIICATION_PERMISSION_GIVEN - ", NotificationService.hasPermission);
    const { Email, Password } = this.state;

    if (Email.length === 0) {
      this.myAlert('Message', 'Please enter your email');
    } else if (Password.length === 0) {
      this.myAlert('Message', 'Please enter your password');
    } else {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!Email.match(mailformat)) {
        this.myAlert('Message', 'Invalid Email-Id');
        return false;
      }
      this.userLoginFunction();
    }
  };

  Show_Custom_Alert(visible) {
    this.setState({ Alert_Visibility: visible });
  }


  displayErrorMessage = () => {
    if (this.state.Password.length == 0) {
      return <View></View>;
    } else {
      return (
        <View>
          <Text
            style={{
              color: 'red',
              fontSize: 16,
              fontWeight: '800',
              alignSelf: 'center',
              margin: 10,
            }}>
            Invalid email or password
          </Text>
        </View>
      );
    }
  };

  render() {
    const { invalidCredentials } = this.state;
    return (
      <View style={styles.container}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.spinner}
          color="#793422"
        //Text with the Spinner
        />
        <View>
          <View style={styles.header}>
            <View style={styles.headerView}>
              <TouchableOpacity
                style={{ width: 30, marginStart: 15 }}
                onPress={() => this.props.navigation.navigate('Home')}>
                <FastImage
                  source={cross}
                  style={{ width: 30, height: 30, }}
                />
              </TouchableOpacity>

              <Text style={styles.headerText}>Sign in to Rewards</Text>
            </View>
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="always">
          <View>
            <View style={styles.cardParentView}>
              <View>
                <FloatingLabel
                  labelStyle={styles.labelInput}
                  inputStyle={{
                    fontSize: 15,
                    marginStart: 15,
                    width: '95%',
                    borderColor: '#F9F9F9',
                    fontWeight: '700',
                    borderBottomColor:
                      invalidCredentials && invalidCredentials
                        ? 'red'
                        : '#E5E5E5',
                    borderWidth: Platform.OS === 'ios' ? 2 : 0,
                  }}

                  value={this.state.Email}
                  onChangeText={(Email) => {
                    if (invalidCredentials) {
                      this.setState({ invalidCredentials: false });
                    }
                    this.setState({ Email });
                  }}
                  style={styles.formInput}>
                  Email
                </FloatingLabel>

                <View
                  style={{
                    flexDirection: 'row',
                    borderColor: '#FFF',
                    borderBottomColor: '#FEFEFE',
                    borderWidth: 0,
                    padding: 4,
                    borderColor: 'blue',
                  }}>
                  <View style={{ width: '98%', marginStart: 10 }}>
                    <FloatingLabel
                      labelStyle={{
                        color: '#505755',
                        fontSize: 13,
                        paddingStart: 10,
                      }}
                      inputStyle={{
                        fontSize: 15,
                        width: '100%',
                        fontWeight: '700',
                        borderColor: '#F9F9F9',
                        borderBottomColor:
                          invalidCredentials && invalidCredentials
                            ? 'red'
                            : '#E5E5E5',
                        borderWidth: Platform.OS === 'ios' ? 2 : 0,
                      }}
                      value={this.state.Password}
                      password={this.state.showPassword}
                      onChangeText={(Password) => {
                        if (invalidCredentials) {
                          this.setState({ invalidCredentials: false });
                        }
                        this.setState({ Password });
                      }}>
                      Password
                    </FloatingLabel>
                  </View>
                  <TouchableOpacity
                    style={{ height: 30, width: 30, marginLeft: -40, marginTop: 17 }}
                    onPress={this.toggleSwitch}
                    value={!this.state.showPassword}>
                    {
                      !this.state.showPassword ?
                        <FastImage
                          source={eyePassword}
                          style={{ width: 30, height: 30, resizeMode: 'contain' }}
                        /> :
                        <FastImage
                          source={eyePassword1}
                          style={{ width: 30, height: 30, resizeMode: 'contain' }}
                        />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              {invalidCredentials && invalidCredentials === true ? (
                <this.displayErrorMessage />
              )
                : null
              }
            </View>

            {/* {invalidCredentials && invalidCredentials === true ? (
              <View>
                <Text
                  style={{
                    color: 'red',
                    fontSize: 16,
                    fontWeight: '800',
                    alignSelf: 'center',
                    width: '80%',
                  }}>
                  Invalid email or password
                </Text>
              </View>
            ) : null} */}

            <View>
              <TouchableOpacity
                style={{ borderColor: 'red', borderWidth: 0, width: 150, marginStart: 25, }}
                onPress={() =>
                  this.props.navigation.navigate('forgotpassword')
                }>
                <Text
                  style={{
                    color: '#793422',
                    fontFamily: 'OpenSans-SemiBold',
                    fontSize: 16,
                  }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            right: 10,
            left: 10,
            right: 10,
            bottom: 70,
          }}>
          <TouchableOpacity
            onPress={this.validateUser}
            style={{
              backgroundColor: '#793422',
              borderRadius: 50,
              width: 100,
              height: 35,
              alignSelf: 'flex-end',
              margin: 10,
              justifyContent: 'center'
            }}>
            <Text
              style={{
                color: '#FFF',
                textAlign: 'center',
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 14,
              }}>
              Sign in
                </Text>
          </TouchableOpacity>
        </View>



        <Modal
          visible={this.state.Alert_Visibility}
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => {
            this.Show_Custom_Alert(!this.state.Alert_Visibility);
          }}>
          <View
            style={{
              // backgroundColor:'#FFF',
              backgroundColor: 'rgba(0,0,0,0.5)',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <View
              style={{
                width: '96%',
                height: 200,
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 10,
                borderRadius: 10,
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    fontWeight: '700',
                    margin: 10,
                  }}>
                  Use iCloud KeyChain to Sign In
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    alignSelf: 'center',
                    fontWeight: '600',
                    margin: 10,
                    marginStart: 20,
                    marginEnd: 5,
                  }}>
                  Your credentials will be securely saved to iCloud KeyChain for
                  faster sign in.
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignSelf: 'center',
                  margin: 10,
                  marginStart: 30,
                  marginEnd: 10,
                }}>

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Home')}
                  style={{
                    borderColor: '#793422',
                    borderRadius: 50,
                    height: 30,
                    backgroundColor: '#793422',
                    margin: 20,
                    width: '20%',
                    justifyContent: 'center'
                  }}>
                  <Text
                    style={{
                      color: '#FFF',
                      fontSize: 14,
                      fontWeight: '700',
                      textAlign: 'center'

                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
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
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'OpenSans-SemiBold',
    marginTop: 20,
    marginStart: 20,
    color: '#000',
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
    backgroundColor: '#F9F9F9',
    width: '94%',
    height: 200,
    margin: 10,
    borderColor: 'red',
    borderWidth: 0,
  },
  cardParentView2: {
    backgroundColor: '#F9F9F9',
    width: '94%',
    height: 460,
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
    paddingStart: 0,
    paddingEnd: 10,
    fontWeight: '600',
    margin: 1,
    width: '90%',
    flexDirection: 'column',
  },
  input: {
    padding: 5,
    margin: 10,
    fontSize: 15,
    borderColor: '#FFF',
    borderBottomColor: '#E5E5E5',
    borderWidth: 2,
    width: '80%',
  },
  labelInput: {
    color: '#505755',
    fontSize: 13,
    paddingStart: 25,
  },
});

const mapStateToProps = (state) => {
  return {
    userstore: state.userstore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserTreeOnLogin: (payload) => {
      dispatch(updateUserTree(payload));
    },
    updateUserOnEditDispatch: () => {
      dispatch(updateUserOnEdit());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
