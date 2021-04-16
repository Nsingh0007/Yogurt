import React, {Component} from 'react';
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
import FastImage from 'react-native-fast-image';
import cross from '../../assets/icon/Wrong.png';
LogBox.ignoreAllLogs()
import Spinner from 'react-native-loading-spinner-overlay';
import FloatingLabel from 'react-native-floating-labels';
import {UserForgotPassword} from '@api';
import { topLevelNavigate } from '@navigation/topLevelRef';

Text.defaultProps={
  allowFontScaling:false,
  fontScale:1
}

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      EmailId: '',
      spinner: false,
      Alert_Visibility: false,
      wrongPassword: false,
    };
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }
  toggleSwitch() {
    this.setState({showPassword: !this.state.showPassword});
  }

  userForgotPasswordFunction = async () => {
    this.setState({spinner: true});
    const {EmailId} = this.state;
    const userForgotPasswordResponse = await UserForgotPassword({
      EmailId,
    });
    if (userForgotPasswordResponse.result == true) {
      //   this.myAlert('Message', 'Password Reset Successfully');
      setTimeout(() => {
        this.setState({
          spinner: !this.state.spinner,
        });
        this.Show_Custom_Alert();
      }, 500);
    } else {
      this.setState({
        spinner: !this.state.spinner,
      });
      setTimeout(() => {
        this.myAlert('Message', 'this email is not registered');
      }, 100);
      console.log('getting error here-------------',userForgotPasswordResponse);
    }
    return;
  };

  myAlert = (title = '', message = '') => {
    Alert.alert(title, message);
  };

  myAlert = (title = '', message = '') => {
    Alert.alert(title, message);
  };

  validateUser = () => {
    const {EmailId} = this.state;

    if (EmailId.length === 0) {
      this.myAlert('Message', 'Enter EmailId');
    } else {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!EmailId.match(mailformat)) {
        this.myAlert('Message', 'Not a valid EmailId-Id');
        return false;
      }
      this.userForgotPasswordFunction();
    }
  };

  Show_Custom_Alert(visible) {
    this.setState({Alert_Visibility: visible});
  }

  ok_Button = () => {
    Alert.alert('OK Button Clicked');
  };

  render() {
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
                style={{borderColor:'red',borderWidth:0,width:30,marginStart:13}}
                onPress={() => this.props.navigation.goBack()}>
                <FastImage
                  source={cross}
                  style={{width: 30, height: 30}}
                />
              </TouchableOpacity>

              <Text style={styles.headerText}>Forgot Password</Text>
            </View>
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.cardParentView}>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: '#000',
                  margin: 10,
                  fontFamily: 'OpenSans-SemiBold',
                }}>
                Personal Info
              </Text>

              <FloatingLabel
                autoCapitalize="none"
                labelStyle={styles.labelInput}
                inputStyle={{
                  fontSize: 15,
                  marginStart: 15,
                  width: '94%',
                  fontFamily: 'OpenSans-SemiBold',
                  borderColor: '#F9F9F9',
                  borderBottomColor: '#E5E5E5',
                  borderWidth: Platform.OS === 'ios'?2:0,
                }}
                value={this.state.EmailId}
                onChangeText={(EmailId) => this.setState({EmailId})}
                style={styles.formInput}>
                Email
              </FloatingLabel>
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
            onPress={() => this.validateUser()}
            style={{
              backgroundColor: '#793422',
              borderRadius: 50,
              width: '30%',
              height: 46,
              alignSelf: 'flex-end',
              margin: 10,
              justifyContent:'center'
            }}>
            <Text
              style={{
                color: '#FFF',
                textAlign:'center',
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 18,
              }}>
              Submit
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
            }}>
            <View
              style={{
                width: '95%',
                height: 200,
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 10,
                marginStart: 10,
                borderRadius: 10,
                marginTop: 200,
                marginBottom: 100,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 22,
                    alignSelf: 'center',
                    fontFamily: 'OpenSans-SemiBold',
                    margin: 10,
                  }}>
                  Congratulations!
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    fontFamily: 'OpenSans-SemiBold',
                    margin: 10,
                    marginStart: 20,
                    marginEnd: 5,
                  }}>
                  Please check your email for your temporary password.
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
                  justifyContent:'center'
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Home')}
                  style={{
                    borderColor: '#793422',
                    borderRadius: 50,
                    height: 30,
                    backgroundColor: '#793422',
                    margin: 20,
                    width: 60,
                    justifyContent:'center'
                  }}>
                  <Text
                    style={{
                      color: '#FFF',
                      fontSize: 14,
                      fontWeight: '700',
                      textAlign:'center'
                    }}>
                    Ok
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
    borderBottomColor:'#414040',
    borderWidth:0.5,
    borderColor:'#FFFFFF',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
  },
  headerView: {
    flexDirection: 'column',
    marginTop: 6,
  },
  headerText: {
    fontSize: 24,
    margin: 7,
    marginTop:20,
    marginStart:20,
    color: '#000',   
    fontFamily: 'OpenSans-SemiBold',
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
    height: 160,
    margin: 10,
    borderColor: 'red',
    borderWidth: 0,
  },
  cardParentView2: {
    backgroundColor: '#F9F9F9',
    width: '94%',
   
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
    fontSize: 13,
    borderColor: '#FFF',
    borderBottomColor: '#E5E5E5',
    borderWidth: 2,
    width: '90%',
  },
  labelInput: {
    color: '#505755',
    fontSize: 13,
    paddingStart: 25,
  },
});
