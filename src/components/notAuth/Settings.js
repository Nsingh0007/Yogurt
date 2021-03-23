import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import cross from '../../assets/icon/Wrong.png';
import AsyncStorage from '@react-native-community/async-storage';
import { userLogoutSucess } from '@redux';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchOn1: false,
      switchOn2: false,
      switchOn4: false,
      switchOn6: false,
    };
  }

  getButtonText() {
    return this.state.switchOn4 ? 'Hour' : 'Day';
  }

  getRightText() {
    return this.state.switchOn4 ? '' : 'Hour';
  }

  getLeftText() {
    return this.state.switchOn4 ? 'Day' : '';
  }
  onPress1 = () => {
    this.setState({ switchOn1: !this.state.switchOn1 });
  };
  onPress2 = () => {
    this.setState({ switchOn2: !this.state.switchOn2 });
  };
  onPress3 = () => {
    this.setState({ switchOn3: !this.state.switchOn3 });
  };
  onPress4 = () => {
    this.setState({ switchOn4: !this.state.switchOn4 });
  };
  onPress6 = () => {
    this.setState({ switchOn6: !this.state.switchOn6 });
  };

  componentDidMount = async () => {
    const userLoggedInData = await AsyncStorage.getItem('userLoggedInToken');
    this.props.isUserLoggedIn();
  };


  render() {

    const { isUserLoggedIn, loading } = this.props.userstore;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerView}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('account')}
              style={{ marginStart: 15, width: 30, margin: 4, borderColor: 'red', borderWidth: 0 }}>
              <FastImage source={cross} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>

            <Text style={styles.headerText}>Settings</Text>
          </View>
        </View>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: 140,
              width: '96%',
              backgroundColor: '#fff',
              borderColor: 'red',
              borderWidth: 0,
              marginTop: 20,
              alignSelf: 'center',
            }}>
            <Text style={{ fontSize: 19, fontFamily: 'OpenSans-ExtraBold', margin: 10 }}>
              Preferance
            </Text>
            <View
              style={{ borderColor: '#E5E5E5', borderWidth: 1, width: '100%' }}
            />
            <View
              style={{
                marginTop: 5,
                borderColor: 'red',
                borderWidth: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 7,
              }}>
              <Text style={{ fontSize: 16, fontFamily: 'OpenSans-ExtraBold', margin: 7 }}>
                Notification
              </Text>
              <SwitchToggle
                containerStyle={{
                  margin: 5,
                  width: 60,
                  height: 28,
                  borderRadius: 25,
                  backgroundColor: '#696969',
                  padding: 5,
                }}
                circleStyle={{
                  width: 25,
                  height: 25,
                  borderRadius: 19,
                  backgroundColor: 'white', // rgb(102,134,205)
                }}
                switchOn={this.state.switchOn2}
                onPress={this.onPress2}
                circleColorOff="white"
                circleColorOn="#FFFFFF"
                duration={500}
                backgroundColorOn="#793422"
              />
            </View>
          </View>

          <View style={{
            height: 310,
            width: '96%',
            backgroundColor: '#fff',
            borderColor: 'red',
            borderWidth: 0,
            marginTop: 10,
            alignSelf: 'center',
          }}>
            <Text style={{ fontSize: 19, fontFamily: 'OpenSans-ExtraBold', margin: 10 }}>
              About
            </Text>
            <View
              style={{ borderColor: '#E5E5E5', borderWidth: 1, width: '100%' }}
            />
            <Text style={{ fontSize: 16, margin: 6, fontFamily: 'OpenSans-ExtraBold', margin: 10 }}>
              Terms of use
            </Text>
            <Text style={{ fontSize: 16, margin: 6, fontFamily: 'OpenSans-ExtraBold', margin: 10 }}>
              Privacy policy
            </Text>
          </View>

        </ScrollView>

        {isUserLoggedIn != null && isUserLoggedIn == true ? (
          <View
            style={{
              justifyContent: 'center',
              position: 'absolute',
              right: 10,
              left: 10,
              alignSelf: 'baseline',
              bottom: 30,
            }}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Logout',
                  'Are you sure to Logout ?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Logout',
                      onPress: async () => {
                        this.props.userLogoutSucessDispatch();
                        let keys = [
                          'userLoggedIn',
                          'userLoggedInData',
                          'userLoggedInToken',
                        ];
                        await AsyncStorage.multiRemove(keys, (err) => { });
                        this.props.navigation.navigate('Home');
                      },
                    },
                  ],
                  { cancelable: false },
                );
              }}
              style={{
                backgroundColor: '#793422',
                borderRadius: 20,
                height: 35,
                width: 100,
                alignSelf: 'flex-end',
                margin: 10,
                marginEnd: 3,
                marginTop: 50,
                marginBottom: 20,
                justifyContent: 'center'
              }}>
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 16,
                  alignSelf: 'center',
                  fontFamily: 'OpenSans-ExtraBold',
                  textAlign: 'center'
                }}>
                Sign Out
             </Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
    height: 80,
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
    color: '#414040',
    fontFamily: 'OpenSans-ExtraBold',
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
    width: '94%',
    height: 340,
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
    userLogoutSucessDispatch: () => {
      dispatch(userLogoutSucess());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);