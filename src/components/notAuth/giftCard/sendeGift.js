import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
  Modal,
  Alert,
  LogBox
} from 'react-native';
LogBox.ignoreAllLogs()

import back from '../../../assets/icon/gift/back.png';
import cross from '../../../assets/icon/gift/cross.png';
import FloatingLabel from 'react-native-floating-labels';
import {connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {postGiftCart} from '@api';
import FastImage from 'react-native-fast-image';

class sendeGift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsFetched: false,
      Alert_Visibility: false,
      spinner: false,
      RecipientName: '',
      RecipientEmail: '',
      RecipientMobileNumber: '',
      Message: '',
      GiftAmount: 0,
    };
  }

  Show_Custom_Alert(visible) {
    this.setState({Alert_Visibility: visible});
  }

  Hide_Custom_Alert() {
    this.setState({Alert_Visibility: false});
  }

  componentDidMount = async () => {
    this.setState({
      userDetails: this.props.userstore.userDetails,
      isDetailsFetched: true,
    });
  };

  myAlert = (title = '', message = '') => {
    Alert.alert(title, message);
  };

  postGiftCartByUser = async () => {
    const {userDetails} = this.props.userstore;
    const YourEmail = userDetails?.Email;
    const YourName = `${userDetails.FirstName} ${userDetails.LastName}`;
    const YourMobileNumber = userDetails.mobile;
    // this.setState({spinner: true});
    const {
      RecipientName,
      RecipientEmail,
      RecipientMobileNumber,
      Message,
      GiftAmount,
    } = this.state;
    const postGiftCartResponse = await postGiftCart({
      YourEmail,
      YourName,
      YourMobileNumber,
      RecipientName,
      RecipientEmail,
      RecipientMobileNumber,
      Message,
      GiftAmount,
    });
    if (postGiftCartResponse.result == true) {
        setTimeout(() => {
            this.setState({
              spinner: !this.state.spinner,
            });            
          }, 500);
      Alert.alert(
        'Message',
        'Gift Cart send successfully!',
        {text: 'OK', onPress: () => this.props.navigation.navigate('home')},
        {cancelable: false},
      );
    } else {
      this.myAlert('Error', 'Try Again !');
      console.log('getting error here-------------');
    }
    return;
  };

  validateGiftCartUser = () => {
    const {
      RecipientName,
      RecipientEmail,
      RecipientMobileNumber,
      GiftAmount,
    } = this.state;

    if (GiftAmount.length === 0) {
      this.myAlert('Message', 'Please enter GiftAmount');
    } else if (RecipientName.length === 0) {
      this.myAlert('Message', 'Please enter RecipientName');
    } else if (RecipientEmail.length === 0) {
      this.myAlert('Message', 'Please enter RecipientEmail');
    } else if (RecipientMobileNumber.length === 0) {
      this.myAlert('Message', 'Please enter RecipientMobileNumber');
    } else {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!RecipientEmail.match(mailformat)) {
        this.myAlert('Message', 'Invalid RecipientEmail');
        return false;
      }
      this.Show_Custom_Alert();
    }
  };

  render() {
    const {userDetails} = this.props.userstore;
    const {spinner} = this.state
    let giftImage = this.props.navigation.getParam('giftImage');

    return (
      <View style={styles.container}>
        <Spinner visible={spinner} size="large" color="#793422" />
        <View style={styles.header}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <FastImage
                source={cross}
                style={{width: 30, height: 30, margin: 15}}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily:'OpenSans-Bold',
              margin: 10,
              marginStart: 20,
            }}>
            Send eGift
          </Text>
        </View>

        <ScrollView>
          <View style={styles.cardParentView}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  color: '#414040',
                  fontSize: 15,
                  fontFamily:'OpenSans-Bold',
                }}></Text>
              <Text
                style={{
                  color: '#793422',
                  fontSize: 15,
                  fontFamily:'OpenSans-Bold',
                }}></Text>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity>
                <FastImage
                    resizeMode="stretch"
                  source={giftImage}
                  style={{
                    width: 150,
                    height: 100,
                    margin: 10,
                    alignSelf: 'flex-start',
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text
                  style={{
                    color: '#793422',
                    fontSize: 15,
                    fontFamily:'OpenSans-Bold',
                    margin: 10,
                  }}>
                  Change Cart Art
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                borderWidth: 1,
                width: '90%',
                borderColor: '#E5E5E5',
                alignSelf: 'center',
              }}
            />

            <View style={{marginStart: 10}}>
              <FloatingLabel
                autoCapitalize="none"
                labelStyle={{
                  color: '#505755',
                  fontSize: 12,
                  fontFamily:'OpenSans-Bold',
                  paddingStart: 10,
                }}
                inputStyle={{
                  fontSize: 13,
                  fontFamily:'OpenSans-Bold',
                  width: '90%',
                  borderColor: '#FFF',
                  borderWidth: 0,
                  borderBottomColor: '#E5E5E5',
                  borderBottomWidth: 1,
                }}
                keyboardType="numeric"
                value={this.state.GiftAmount}
                onChangeText={(GiftAmount) => this.setState({GiftAmount})}>
                Gift Amount
              </FloatingLabel>
            </View>
          </View>

          <View style={styles.cardParentView}>
            <View
            //   style={{flexDirection: 'row', justifyContent: 'space-between'}}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 16,
                  fontFamily:'OpenSans-Bold',
                  margin: 10,
                }}>
                To
              </Text>
              {/* <Text
                style={{
                  color: '#793422',
                  fontSize: 16,
                  fontWeight: 'bold',
                  margin: 10,
                }}>
                Select from contacts
              </Text> */}
            </View>
            <View style={{marginStart: 10}}>
              <FloatingLabel
                autoCapitalize="none"
                labelStyle={{
                  color: '#505755',
                  fontSize: 10,
                  fontFamily:'OpenSans-Bold',
                  paddingStart: 10,
                }}
                inputStyle={{
                  fontSize: 13,
                  fontFamily:'OpenSans-Bold',
                  width: '90%',
                  borderColor: '#FFF',
                  borderWidth: 0,
                  borderBottomColor: '#E5E5E5',
                  borderBottomWidth: 1,
                }}
                value={this.state.RecipientName}
                onChangeText={(RecipientName) =>
                  this.setState({RecipientName})
                }>
                Recipient Name
              </FloatingLabel>

              <FloatingLabel
                autoCapitalize="none"
                labelStyle={{
                  color: '#505755',
                  fontSize: 10,
                  fontFamily:'OpenSans-Bold',
                  paddingStart: 10,
                }}
                inputStyle={{
                  fontSize: 13,
                  fontFamily:'OpenSans-Bold',
                  width: '90%',
                  borderColor: '#FFF',
                  borderBottomColor: '#E5E5E5',
                  borderBottomWidth: 1,
                }}
                keyboardType="email-address"
                value={this.state.RecipientEmail}
                onChangeText={(RecipientEmail) =>
                  this.setState({RecipientEmail})
                }>
                Recipient Email
              </FloatingLabel>

              <FloatingLabel
                autoCapitalize="none"
                labelStyle={{
                  color: '#505755',
                  fontSize: 10,
                  fontFamily:'OpenSans-Bold',
                  paddingStart: 10,
                }}
                inputStyle={{
                  fontSize: 13,
                  fontFamily:'OpenSans-Bold',
                  width: '90%',
                  borderColor: '#FFF',
                  borderBottomColor: '#E5E5E5',
                  borderBottomWidth: 1,
                }}
                keyboardType="phone-pad"
                value={this.state.RecipientMobileNumber}
                onChangeText={(RecipientMobileNumber) =>
                  this.setState({RecipientMobileNumber})
                }>
                Recipient Mobile Number
              </FloatingLabel>
            </View>
          </View>

          <View style={styles.cardParentView}>
            <Text
              style={{
                color: '#000',
                fontSize: 16,
                fontFamily:'OpenSans-Bold',
                margin: 10,
              }}>
              From :
            </Text>
            <View style={{marginStart: 10}}>
              <FloatingLabel
                autoCapitalize="none"
                labelStyle={{
                  color: '#505755',
                  fontSize: 10,
                  fontFamily:'OpenSans-Bold',
                  paddingStart: 10,
                }}
                inputStyle={{
                  fontSize: 13,
                  fontFamily:'OpenSans-Bold',
                  width: '90%',
                  borderColor: '#FFF',
                  borderWidth: 0,
                  borderBottomColor: '#E5E5E5',
                  borderBottomWidth: 1,
                }}
                editable={false}
                value={userDetails?.FirstName}
                >
                Your Name
              </FloatingLabel>

              <FloatingLabel
                autoCapitalize="none"
                labelStyle={{
                  color: '#505755',
                  fontSize: 10,
                  fontFamily:'OpenSans-Bold',
                  paddingStart: 10,
                }}
                inputStyle={{
                  fontSize: 13,
                  fontFamily:'OpenSans-Bold',
                  width: '90%',
                  borderColor: '#FFF',
                  borderBottomColor: '#E5E5E5',
                  borderBottomWidth: 1,
                }}
                value={userDetails?.Email}
                editable={false}>
                Your Email
              </FloatingLabel>

              <FloatingLabel
                autoCapitalize="none"
                labelStyle={{
                  color: '#505755',
                  fontSize: 10,
                  fontFamily:'OpenSans-Bold',
                  paddingStart: 10,
                }}
                inputStyle={{
                  fontSize: 13,
                  fontFamily:'OpenSans-Bold',
                  width: '90%',
                  borderColor: '#FFF',
                  borderBottomColor: '#E5E5E5',
                  borderBottomWidth: 1,
                }}
                value={userDetails?.mobile}
                editable={false}>
                Your Mobile Number
              </FloatingLabel>
            </View>
          </View>

          <View style={styles.cardParentView}>
            <Text
              style={{
                color: '#000',
                fontSize: 16,
                fontFamily:'OpenSans-Bold',
                margin: 10,
              }}>
              Share a Message
            </Text>
            <View style={{marginStart: 10}}>
              <FloatingLabel
                autoCapitalize="none"
                labelStyle={{
                  color: '#505755',
                  fontSize: 12,
                  fontFamily:'OpenSans-Bold',
                  paddingStart: 10,
                }}
                inputStyle={{
                  fontSize: 13,
                  fontFamily:'OpenSans-Bold',
                  width: '90%',
                  borderColor: '#FFF',
                  borderBottomColor: '#E5E5E5',
                  borderBottomWidth: 1,
                }}
                value={this.state.Message}
                onChangeText={(Message) => this.setState({Message})}>
                Personal Message
              </FloatingLabel>
            </View>
            <Text
              style={{
                color: '#000',
                fontSize: 14,
                fontFamily:'OpenSans-Bold',
                margin: 10,
                marginStart: 20,
                marginTop: 60,
              }}>
              Optional Field
            </Text>
          </View>
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            right: 10,
            left: 10,
            right: 30,
            bottom: 70,
          }}>
          <TouchableOpacity
            onPress={() => this.validateGiftCartUser()}
            style={{
              backgroundColor: '#793422',
              borderRadius: 20,
              height: 42,
              width: '30%',
              alignSelf: 'flex-end',
              marginLeft: 30,
              borderColor: 'red',
              borderWidth: 0,
            }}>
            <Text
              style={{
                color: '#FFF',
                fontSize: 16,
                alignSelf: 'center',
                padding: 7,
                fontFamily:'OpenSans-Bold',
              }}>
              Confirm
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
              marginTop: 200,
            }}>
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F9F9F9',
                alignSelf: 'center',
              }}>
              <View style={{flexDirection: 'row', margin: 10}}>
                <TouchableOpacity onPress={() => this.Hide_Custom_Alert()}>
                  <FastImage
                    source={cross}
                    style={{width: 30, height: 30, margin: 10}}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 22,
                    alignSelf: 'center',
                    fontFamily:'OpenSans-Bold',
                    margin: 10,
                  }}>
                  Payment Details
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: 30,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    margin: 10,
                  }}>
                  <FastImage
                    resizeMode="stretch"
                    source={giftImage}
                    style={{
                      width: 70,
                      height: 50,
                      alignSelf: 'flex-start',
                      margin: 10,
                    }}
                  />
                  <View style={{flexDirection: 'column', margin: 10}}>
                    <Text style={{fontSize: 12, fontFamily:'OpenSans-Bold', margin: 3}}>Gift Amount </Text>
                    <Text style={{fontSize: 15, fontFamily:'OpenSans-Bold', color: '#414040', margin: 3}}>
                      Rs. {this.state.GiftAmount}{' '}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: '90%',
                    borderColor: '#E5E5E5',
                    alignSelf: 'center',
                  }}
                />
                <View style={{margin: 20}}>
                  <Text style={{color: '#414040', margin: 3, fontFamily:'OpenSans-Bold',fontSize: 17}}>
                    Payment Method
                  </Text>
                  <Text style={{color: '#000', margin: 10, fontFamily:'OpenSans-Bold',fontSize: 12}}>
                    Add Card in Profile on Continue
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                position: 'absolute',
                right: 10,
                left: 10,
                right: 30,
                bottom: 40,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.postGiftCartByUser();
                }}
                style={{
                  backgroundColor: '#793422',
                  borderRadius: 50,
                  height: 42,
                  width: '35%',
                  alignSelf: 'flex-end',
                  marginLeft: 30,
                  borderColor: 'red',
                  borderWidth: 0,
                }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 16,
                    alignSelf: 'center',
                    padding: 10,
                    fontFamily:'OpenSans-Bold',
                  }}>
                  Send Gift
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
    backgroundColor: '#FFF',
    height: 130,
  },
  cardParentView: {
    backgroundColor: '#FFF',
    width: '94%',
    height: 230,
    alignSelf: 'center',
    margin: 4,
    borderColor: 'red',
    borderWidth: 0,
    marginBottom: 10,
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
export default connect(mapStateToProps, mapDispatchToProps)(sendeGift);