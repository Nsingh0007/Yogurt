import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Alert,
  Modal,
  TouchableOpacity,
  LogBox,
  Platform
} from 'react-native';

import cross from '../../assets/icon/Wrong.png';
import Spinner from 'react-native-loading-spinner-overlay';
import eyePassword from '../../assets/icon/eyePassword.png';
import eyePassword1 from '../../assets/icon/eyePassword1.png';
import { connect } from 'react-redux';
import FloatingLabel from 'react-native-floating-labels';
import { createNewPassword } from '@api';
import FastImage from 'react-native-fast-image';

LogBox.ignoreAllLogs()

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

class CreatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserID: '',
      OldPassword: '',
      NewPassword: '',
      ConfirmPassword: '',
      spinner: false,
      Alert_Visibility: false,
      wrongPassword: false,
      showPassword: true,
      showConfirmPassword: true,
      isDetailsFetched: false,
    };
    this.toggleSwitch1 = this.toggleSwitch1.bind(this);
    this.toggleSwitch2 = this.toggleSwitch2.bind(this);
  }

  toggleSwitch1() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  toggleSwitch2() {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  }

  componentDidMount = async () => {
    this.setState({
      userDetails: JSON.parse(userLoggedInData),
      isDetailsFetched: true,
    });
  };

  createNewPassword = async () => {
    const { userDetails } = this.props.userstore;
    const UserID = userDetails?.Email
    const { OldPassword, NewPassword, ConfirmPassword } = this.state;
    const createNewPasswordResponse = await createNewPassword({
      UserID,
      OldPassword,
      NewPassword,
      ConfirmPassword,
    });
    if (createNewPasswordResponse.result == true) {
      setTimeout(() => {
        this.setState({
          spinner: false,
        });
        this.Show_Custom_Alert();
      }, 500);
    } else {

      this.myAlert('Error', `${createNewPasswordResponse.error.Message}`);
    }
    return;
  };

  myAlert = (title = '', message = '') => {
    Alert.alert(title, message);
  };

  validateUser = () => {
    const { OldPassword, NewPassword, ConfirmPassword } = this.state;

    if (OldPassword.length === 0) {
      this.myAlert('Message', 'Enter Old password');
    } else if (NewPassword.length === 0) {
      this.myAlert('Message', 'Enter New Password');
    } else if (ConfirmPassword.length === 0) {
      this.myAlert('Message', 'Enter Password');
    } else {
      if (NewPassword != ConfirmPassword) {
        this.myAlert(
          'Message',
          'Confirm password not match',
        );
        return false;
      }
      const pwd = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})';
      if (!NewPassword.match(pwd)) {
        this.myAlert('Message', 'Invalid password format');
        return false;
      }
      this.createNewPassword();
    }
  };

  Show_Custom_Alert(visible) {
    this.setState({ Alert_Visibility: visible });
  }

  ok_Button = () => {
    Alert.alert('OK Button Clicked');
  };


  render() {

    const { userDetails } = this.props.userstore;
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          color="#793422"
        />
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              style={{ marginStart: 15, width: 30, margin: 4, }}
              onPress={() => this.props.navigation.navigate('personalinfo')}>
              <FastImage
                source={cross}
                style={{ width: 30, height: 30, }}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create New Password</Text>
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.cardParentView}>
            <View>
              <Text
                style={{
                  fontSize: 15,
                  color: '#000',
                  margin: 10,
                  fontFamily: 'OpenSans-SemiBold'
                }}>
                Your new password must be different from the previously used passwords.
              </Text>

              {/* <FloatingLabel
                autoCapitalize="none"
                labelStyle={styles.labelInput}
                inputStyle={{
                  fontSize: 12,
                  marginStart: 15,
                  width: '78%',
                  borderColor: '#FFF',
                  borderBottomColor: '#E5E5E5',
                  borderWidth: 2,
                }}
                value={userDetails?.Email}
                onChangeText={(UserID) => this.setState({UserID})}
                style={styles.formInput}>
                Email Id or User Name
              </FloatingLabel> */}
              <View style={{ width: '90%', marginStart: 10 }}>
                <FloatingLabel
                  autoCapitalize="none"
                  labelStyle={{
                    color: '#505755',
                    fontSize: 15,
                    paddingStart: 16,
                    fontFamily: 'OpenSans-SemiBold'
                  }}
                  inputStyle={{
                    fontSize: 13,
                    width: '100%',
                    fontFamily: 'OpenSans-SemiBold',
                    borderBottomColor: '#E5E5E5',
                    borderWidth: 0,
                    borderBottomWidth: Platform.OS === 'ios' ? 2 : 0
                  }}
                  value={this.state.OldPassword}
                  onChangeText={(OldPassword) => this.setState({ OldPassword })}
                  style={styles.formInput}>
                  Old Password
              </FloatingLabel>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderColor: '#FFF',
                  borderBottomColor: '#FEFEFE',
                  borderWidth: 0,
                  padding: 4,
                  borderColor: 'blue',
                }}>
                <View style={{ width: '90%', marginStart: 10 }}>
                  <FloatingLabel
                    autoCapitalize="none"
                    labelStyle={{
                      color: '#505755',
                      fontSize: 15,
                      paddingStart: 16,
                      fontFamily: 'OpenSans-SemiBold'
                    }}
                    inputStyle={{
                      fontSize: 13,
                      width: '100%',
                      fontFamily: 'OpenSans-SemiBold',
                      borderBottomColor: '#E5E5E5',
                      borderWidth: 0,
                      borderBottomWidth: Platform.OS === 'ios' ? 2 : 0
                    }}
                    value={this.state.NewPassword}
                    password={this.state.showPassword}
                    onChangeText={(NewPassword) => {
                      this.setState({ NewPassword });
                    }}>
                    New Password
                  </FloatingLabel>
                </View>
                <TouchableOpacity
                  style={{ borderWidth: 0, borderColor: 'red', marginStart: -30, marginTop: 10 }}
                  onPress={this.toggleSwitch1}
                  value={!this.state.showPassword}>
                  {
                    !this.state.showPassword ?
                      <FastImage
                        source={eyePassword}
                        style={{ width: 30, height: 30, margin: 10, marginEnd: 20 }}
                      /> :
                      <FastImage
                        source={eyePassword1}
                        style={{ width: 30, height: 30, margin: 10, marginEnd: 20 }}
                      />
                  }
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderColor: '#FFF',
                  borderBottomColor: '#FEFEFE',
                  borderWidth: 0,
                  padding: 4,
                  borderColor: 'blue',
                }}>
                <View style={{ width: '90%', marginStart: 10 }}>
                  <FloatingLabel
                    autoCapitalize="none"
                    labelStyle={{
                      color: '#505755',
                      fontSize: 15,
                      paddingStart: 16,
                      fontFamily: 'OpenSans-SemiBold'
                    }}
                    inputStyle={{
                      fontSize: 13,
                      width: '100%',
                      fontFamily: 'OpenSans-SemiBold',
                      borderBottomColor: '#E5E5E5',
                      borderWidth: 0,
                      borderBottomWidth: Platform.OS === 'ios' ? 2 : 0
                    }}
                    value={this.state.ConfirmPassword}
                    password={this.state.showConfirmPassword}
                    onChangeText={(ConfirmPassword) => {
                      this.setState({ ConfirmPassword });
                    }}>
                    Confirm Password
                  </FloatingLabel>
                </View>
                <TouchableOpacity
                  style={{ borderWidth: 0, borderColor: 'red', marginStart: -30, marginTop: 10 }}
                  onPress={this.toggleSwitch2}
                  value={!this.state.showConfirmPassword}>
                  {
                    !this.state.showConfirmPassword ?
                      <FastImage
                        source={eyePassword}
                        style={{ width: 30, height: 30, margin: 10, marginEnd: 20 }}
                      /> :
                      <FastImage
                        source={eyePassword1}
                        style={{ width: 30, height: 30, margin: 10, marginEnd: 20 }}
                      />
                  }
                </TouchableOpacity>
              </View>
            </View>
            {/* <this.displayErrorMessage /> */}
          </View>

          <View>
            <TouchableOpacity
              onPress={() => this.validateUser()}
              style={{
                backgroundColor: '#793422',
                borderRadius: 18,
                width: '27%',
                height: 35,
                alignSelf: 'flex-end',
                margin: 10,
                marginTop: 50,
                justifyContent: 'center'
              }}>
              <Text style={{ color: '#FFF', alignSelf: 'center', fontFamily: 'OpenSans-SemiBold', fontSize: 18 }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
                width: '95%',
                height: 150,
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 22,
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    margin: 10,
                  }}>
                  Congratulations
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    fontWeight: '600',
                  }}>
                  Your password has been successfully reset
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
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
                    width: '25%',
                    justifyContent: 'center'
                  }}>
                  <Text
                    style={{
                      color: '#FFF',
                      fontSize: 14,
                      fontWeight: '700',
                      alignSelf: 'center',
                      padding: 4,
                    }}>
                    Done
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
    height: 100,
    backgroundColor: '#fff',
    width: '100%',
    borderBottomColor: '#414040',
    borderBottomWidth: 0.5
  },
  headerView: {
    flexDirection: 'column',
    marginTop: 6,
  },
  headerText: {
    fontSize: 24,
    margin: 7,
    marginTop: 20,
    marginStart: 20,
    color: '#414040',
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
    margin: 10,
    borderColor: 'red',
    borderWidth: 0,
  },
  cardParentView2: {
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
    fontSize: 10,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    width: '90%',
  },
  labelInput: {
    color: '#505755',
    fontSize: 15,
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreatePassword);