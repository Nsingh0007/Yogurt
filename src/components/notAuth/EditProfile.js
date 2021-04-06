import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  LogBox,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import cross from '../../assets/icon/Wrong.png';
LogBox.ignoreAllLogs()
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {updateUserOnEdit} from '@redux';
import FloatingLabel from 'react-native-floating-labels';
import {UserUpdate} from '@api';

Text.defaultProps={
  allowFontScaling:false,
  fontScale:1
}

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirstEditable: false,
      isSecondEditable: false,
      buttonLabel: '',
      userDetails: {},
      isDetailsFetched: false,
      FirstName: '',
      LastName: '',
      Email: '',
      mobile: '',
      spinner: false,
    };
  }

  UserUpdateFunction = async () => {
    this.setState({spinner: true});
    const {FirstName, LastName, Email, mobile} = this.state;
    let MobileNumber = mobile.split('-').join('');
    const userUpdateProfile = await UserUpdate({
      FirstName,
      LastName,
      Email,
      mobile: MobileNumber,
    });
    if (userUpdateProfile.result === true) {
      this.props.updateUserOnEditDispatch();

      Alert.alert(
        'Message',
        'Update profile sucessfully',
        [
          {
            text: 'OK',
            onPress: () => {
              this.props.navigation.goBack();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      Alert.alert('Error', 'Try Again');
      console.log('getting error here on else-------------');
    }
  };

  myAlert = (title = '', message = '') => {
    Alert.alert(title, message);
  };

  validateUser = () => {
    const {FirstName, LastName, mobile} = this.state;
    if (FirstName.length === 0) {
      this.myAlert('Message', 'Please enter your first name');
    } else if (LastName.length === 0) {
      this.myAlert('Message', 'Please enter your last name');
    } else if (mobile.length === 0) {
      this.myAlert('Message', 'Please enter your mobile number');
    }
   else {
    const fnameformat = /^[a-zA-Z][a-zA-Z\\s]+$/;
    const lnameformat = /^[a-zA-Z][a-zA-Z\\s]+$/;
    let mob=mobile.split('-').join('')
    const mobileformat = /^(?:[0-9] ?){6,14}[0-9]$/;
    if (!FirstName.match(fnameformat)) {
      this.myAlert('Message', 'Invalid first name');
      return false;
    }else if (!LastName.match(lnameformat)) {
      this.myAlert('Message', 'Invalid last name');
      return false;
    }else if (mob.length < 10 || mob.length > 10 ) {
    this.myAlert('Message', 'Invalid Mobile number');
    return false;
    }
    else{
      this.UserUpdateFunction();
    }
    }
  };

  pickFName=(FirstName)=>{
    let re=/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    if(re.test(FirstName)==true){
      this.setState({
        FirstName:FirstName
      })
    }
  }

  pickLName=(name)=>{
    let re=/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    if(re.test(name) || name==''){
      this.setState({
        LastName:name
      })
    }
  }

  pickNumber=(number)=>{
    if(+number >=0 && number.length<=10){
      this.setState({
        pickupNumber:number
      })
    }
  }

  componentDidMount = async () => {
    const userDetails = this.props.navigation.getParam('userDetails');
    const {FirstName, LastName, Email, mobile} = userDetails;
    this.setState({
      userDetails,
      FirstName,
      LastName,
      Email,
      mobile,
      isDetailsFetched: true,
    });
  };

  _clickhandler1() {
    //Handler to enable of disable TextInput
    this.setState({isFirstEditable: !this.state.isFirstEditable});
    //Make TextInput Enable/Disable
  }

  _clickhandler2() {
    //Handler to enable of disable TextInput
    this.setState({isSecondEditable: !this.state.isSecondEditable});
    //Make TextInput Enable/Disable
  }

  phoneNoWithDash=(phoneNo)=> {
    if(phoneNo != undefined){
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
    }else{
      return null
    }
    
  }

  render() {
    const {userDetails, isDetailsFetched} = this.state;
    return (
      <View style={styles.container}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.spinner}
          color="#793422"
          //Text with the Spinner
        />
         <View style={{height:100,width:'100%', borderBottomColor:'#414040',borderWidth:0,borderBottomWidth:1}}>
              <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('account')}
              style={{marginStart:15,margin:4,width:30,borderColor:'red',borderWidth:0}}>
                <FastImage source={cross} style={{width:30,height:30}} />
              </TouchableOpacity>

              <Text style={styles.headerText}>Edit Profile</Text>
            </View>

        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View style={{marginStart:15}}>                          
                <Text
                  style={{
                    fontSize: 20,
                    color: '#000',
                    margin: 7,
                    fontFamily:'OpenSans-Bold',
                  }}>
                  User Details
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 7,
                    borderWidth: 0,
                    borderColor: 'red',
                    width: '100%',
                  }}>
                  <FloatingLabel
                    style={{width: '90%', borderColor: 'blue', borderWidth: 0}}
                    autoCapitalize="none"
                    labelStyle={{
                      color: '#505755',
                      fontSize: 13,
                      fontFamily:'OpenSans-Bold',
                      paddingStart: 10,
                    }}
                    inputStyle={{
                      fontSize: 15,
                      fontFamily:'OpenSans-Bold',
                      width: '100%',
                      borderBottomWidth:Platform.OS === 'ios'?2:0,
                      borderWidth:0,
                      borderBottomColor: '#EFEFEF',
                    }}
                    onChangeText={(FirstName) => this.setState({FirstName})}
                    value={this.state.FirstName}>
                    First Name
                  </FloatingLabel>
                  {/* <Button title={this.state.buttonLabel} onPress={this._clickhandler.bind(this)}/> */}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    margin: 7,
                    borderWidth: 0,
                    borderColor: 'red',
                    width: '100%',
                  }}>
                  <FloatingLabel
                    style={{width: '90%', borderColor: 'blue', borderWidth: 0}}
                    autoCapitalize="none"
                    labelStyle={{
                      color: '#505755',
                      fontSize: 13,
                      fontFamily:'OpenSans-Bold',
                      paddingStart: 10,
                    }}
                    inputStyle={{
                      fontSize: 15,
                      fontFamily:'OpenSans-Bold',
                      width: '100%',
                      borderBottomWidth:Platform.OS === 'ios'?2:0,
                      borderWidth:0,
                      borderBottomColor: '#EFEFEF',
                    }}
                    value={this.state.LastName}
                    onChangeText={(LastName) => this.setState({LastName})}>
                    Last Name
                  </FloatingLabel>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    margin: 7,
                    borderWidth: 0,
                    borderColor: 'red',
                    width: '100%',
                  }}>
                  <FloatingLabel
                    style={{width: '90%', borderColor: 'blue', borderWidth: 0}}
                    autoCapitalize="none"
                    labelStyle={{
                      color: '#505755',
                      fontSize: 13,
                      fontFamily:'OpenSans-Bold',
                      paddingStart: 10,
                    }}
                    inputStyle={{
                      fontSize: 15,
                      fontFamily:'OpenSans-Bold',
                      width: '100%',
                      borderBottomWidth:Platform.OS === 'ios'?2:0,
                      borderWidth:0,
                      borderBottomColor: '#EFEFEF',
                    }}
                    keyboardType={'numeric'}
                    returnKeyType={'done'}
                    value={this.phoneNoWithDash(this.state.mobile)}
                    onChangeText={(mobile) => {this.setState({mobile: this.phoneNoWithDash(mobile)})}}>
                    Mobile Number
                  </FloatingLabel>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 7,
                    borderWidth: 0,
                    borderColor: 'red',
                    width: '100%',
                  }}>
                  <FloatingLabel
                    style={{width: '90%', borderColor: 'blue', borderWidth: 0}}
                    autoCapitalize="none"
                    labelStyle={{
                      color: '#505755',
                      fontSize: 13,
                      fontFamily:'OpenSans-Bold',
                      paddingStart: 10,
                    }}
                    inputStyle={{
                      fontSize: 15,
                      fontFamily:'OpenSans-Bold',
                      width: '100%',
                      borderBottomWidth:Platform.OS === 'ios'?2:0 ,
                      borderWidth:0,
                      borderBottomColor: '#EFEFEF',
                    }}
                    editable={false}
                    value={userDetails.Email}>
                  Email
                  </FloatingLabel>
                </View>
            </View>
        </KeyboardAwareScrollView>

        <View
          style={{
            position: 'absolute',
            right: 10,
            left: 10,
            right: 10,
            bottom: 50,
          }}>
          <TouchableOpacity
            onPress={() => this.validateUser()}
            style={{
              backgroundColor: '#793422',
              borderRadius: 30,
              width: '30%',
              height: 46,
              alignSelf: 'flex-end',
              margin: 10,
              marginEnd: 15,
            }}>
            <Text
              style={{
                color: '#FFF',
                alignSelf: 'center',
                padding: 10,
                fontSize: 18,
                fontFamily:'OpenSans-ExtraBold',
              }}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
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
    height: 90,
    borderBottomColor:'#414040',
    borderWidth:1,
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
    marginStart:20,
    marginTop:20,
    color: '#414040',   
    fontFamily:'OpenSans-Bold',
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
    backgroundColor: '#FFF',
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
    fontFamily:'OpenSans-Bold',
    margin: 5,
  },
  cardSubtitleText: {
    fontSize: 16,
    color: '#2D0400',
    paddingStart: 0,
    paddingEnd: 10,
    fontFamily:'OpenSans-Bold',
    margin: 1,
    width: '90%',
    flexDirection: 'column',
  },
  input: {
    padding: 5,
    margin: 10,
    fontSize: 10,
    fontFamily:'OpenSans-Bold',
    borderColor: '#FFF',
    borderBottomColor: '#E5E5E5',
    borderWidth: 2,
    width: '94%',
  },
  labelInput: {
    color: '#505755',
    fontSize: 12,
    fontFamily:'OpenSans-Bold',
    paddingStart: 25,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserOnEditDispatch: () => {
      dispatch(updateUserOnEdit());
    },
  };
};
export default connect(null, mapDispatchToProps)(EditProfile);
