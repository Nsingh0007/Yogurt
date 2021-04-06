import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  LogBox,
  Platform
} from 'react-native';

import cross from '../../assets/icon/Wrong.png';
LogBox.ignoreAllLogs()
import { connect } from 'react-redux';
import FloatingLabel from 'react-native-floating-labels';
import FastImage from 'react-native-fast-image';

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsFetched: false,
    };
  }

  componentDidMount = async () => {
    this.setState({
      userDetails: JSON.parse(userLoggedInData),
      isDetailsFetched: true,
    });
  };

  phoneNoWithDash = (phoneNo) => {
    if (phoneNo != undefined) {
      return `${phoneNo?.slice(0, 3)}-${phoneNo?.slice(3, 6)}-${phoneNo?.slice(6)}`;
    } else {
      return ''
    }
  }

  render() {
    const { userDetails } = this.props.userstore;
    return (
      <View style={styles.container}>

        <View style={{ height: 100, backgroundColor: '#fff', width: '100%', borderBottomColor: '#414040', borderBottomWidth: 0.5 }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('account')}
            style={{ marginStart: 15, width: 30, margin: 4, }}>
            <FastImage source={cross} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>

          <Text style={styles.headerText}>Personal Information</Text>
        </View>

        <ScrollView bounces={false} keyboardShouldPersistTaps="always">
          <View style={{ marginStart: 10 }}>
            <View style={styles.cardParentView}>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#000',
                    margin: 6,
                    fontFamily: 'OpenSans-SemiBold',
                  }}>
                  User Details
                </Text>

                <FloatingLabel
                  autoCapitalize="none"
                  labelStyle={{
                    color: '#505755',
                    fontSize: 13,
                    paddingStart: 10,
                    fontFamily: 'OpenSans-SemiBold',

                  }}
                  inputStyle={{
                    fontSize: 15,
                    fontFamily: 'OpenSans-SemiBold',
                    width: '100%',
                    color: '#000000',
                    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
                    borderWidth: 0,
                    borderBottomColor: '#E5E5E5',
                  }}
                  editable={false}
                  value={userDetails?.FirstName}>
                  First Name
                </FloatingLabel>

                <FloatingLabel
                  autoCapitalize="none"
                  labelStyle={{
                    color: '#505755',
                    fontSize: 13,
                    fontFamily: 'OpenSans-SemiBold',
                    paddingStart: 10,
                  }}
                  inputStyle={{
                    fontSize: 15,
                    width: '100%',
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#000000',
                    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
                    borderWidth: 0,
                    borderBottomColor: '#E5E5E5',
                  }}
                  value={userDetails?.LastName}
                  editable={false}>
                  Last Name
                </FloatingLabel>
                <FloatingLabel
                  autoCapitalize="none"
                  labelStyle={{
                    color: '#505755',
                    fontSize: 13,
                    fontFamily: 'OpenSans-SemiBold',
                    paddingStart: 10,
                  }}
                  inputStyle={{
                    fontSize: 15,
                    width: '100%',
                    color: '#000000',
                    fontFamily: 'OpenSans-SemiBold',
                    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
                    borderWidth: 0,
                    borderBottomColor: '#E5E5E5',
                  }}
                  value={this.phoneNoWithDash(userDetails?.mobile)}
                  editable={false}>
                  Mobile Number
                </FloatingLabel>

                <FloatingLabel
                  autoCapitalize="none"
                  labelStyle={{
                    color: '#505755',
                    fontSize: 13,
                    fontFamily: 'OpenSans-SemiBold',
                    paddingStart: 10,
                  }}
                  inputStyle={{
                    fontSize: 15,
                    width: '100%',
                    color: '#000000',
                    fontFamily: 'OpenSans-SemiBold',
                    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
                    borderWidth: 0,
                    borderBottomColor: '#E5E5E5',
                  }}
                  value={userDetails?.Email}
                  editable={false}>
                  Email
                </FloatingLabel>
              </View>
            </View>
            <TouchableOpacity
              style={{
                margin: 1
              }}
              onPress={() => this.props.navigation.navigate('createpassword')}>
              <Text
                style={{
                  color: '#793422',
                  fontFamily: 'OpenSans-SemiBold',
                  fontSize: 16,
                  marginStart: 18
                }}>
                Change Password?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            right: 10,
            left: 10,
            right: 10,
            bottom: 50,
          }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('editprofile', {
                userDetails: userDetails,
              })
            }
            style={{
              backgroundColor: '#793422',
              borderRadius: 50,
              width: 130,
              height: 35,
              alignSelf: 'flex-end',
              margin: 10,
              justifyContent: 'center'
            }}>
            <Text
              style={{
                color: '#FFF',
                alignSelf: 'center',
                fontFamily: 'OpenSans-Bold',
                fontSize: 16,
              }}>
              Edit Profile
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
    borderBottomColor: '#414040',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    backgroundColor: '#F9F9F9',
    width: '94%',
    height: 300,
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
    fontFamily: 'OpenSans-Bold',
    margin: 5,
  },
  cardSubtitleText: {
    fontSize: 16,
    color: '#2D0400',
    paddingStart: 0,
    paddingEnd: 10,
    fontFamily: 'OpenSans-Bold',
    margin: 1,
    width: '90%',
    flexDirection: 'column',
  },
  input: {
    padding: 5,
    margin: 10,
    fontSize: 10,
    fontFamily: 'OpenSans-Bold',
    borderColor: '#FFF',
    borderBottomColor: '#E5E5E5',
    borderWidth: 2,
    width: '80%',
  },
  labelInput: {
    color: '#505755',
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
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
export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfo);
