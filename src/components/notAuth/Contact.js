import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet, 
  Linking,
  Platform,
  Alert,
  LogBox
} from 'react-native';
LogBox.ignoreAllLogs()
import MapView, { Marker, PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';
import Telephone from '../../assets/icon/Telephone.png';
import iceCreamCorn from '../../assets/icon/Ice-Cream_Cone.png';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BottomNavigator from '../../router/BottomNavigator';
import FastImage from 'react-native-fast-image';
import { withBackHandler } from '@appHoc';
Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // backAction = () => {
  //   console.log('Contact');
  //   return true;
  // };

  openCall = async () => {
    const IsCanOpenUrl = await Linking.canOpenURL("tel: 5164841822");
    if (IsCanOpenUrl === true) {
      await Linking.openURL("tel: 5164841822");
    } else {
      Alert.alert("Oops..", `Unable to dial the phone number`)
    }
  }

  openMail = async () => {
    const IsCanOpenUrl = await Linking.canOpenURL("mailto:Support@Yogurtandsuch.com");
    if (IsCanOpenUrl === true) {
      await Linking.openURL("mailto:Support@Yogurtandsuch.com");
    } else {
      Alert.alert("Oops..", `Unable to Open the mail`)
    }
  }

  openMap = async () => {
    let url = Platform.OS == "ios" ? "http://maps.apple.com/?daddr=1+Glen+Cove+Road+Greenvale+NY+11548&dirflg=d&z=20" : "https://maps.google.com?saddr=Current+Location&daddr=1+Glen+Cove+Road%2C+Greenvale%2C+NY&travelmode=driving"
    let message = Platform.OS == "ios" ? "Apple Map" : "Google Map";
    const IsCanOpenUrl = await Linking.canOpenURL(url);
    if (IsCanOpenUrl === true) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Oops..", `Unable to Open the map please download the ${message}`)
    }
  }

  componentDidMount() {
   // BackHandler.addEventListener("hardwareBackPress", this.backAction);
  }

  componentWillUnmount() {
    //BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 2 }}>
          <View style={styles.headerView}>
            <Text style={styles.headerText}>It’s a great day for yogurt</Text>
            <FastImage
              source={iceCreamCorn}
              style={{ width: 25, height: 25, }}
              resizeMode={'contain'}
            />
          </View>
          <MapView
            provider={PROVIDER_DEFAULT}
            mapType="none"
            style={{ flex: 2 }}
            region={{
              latitude: 40.807501,
              longitude: -73.626794,
              latitudeDelta: 0.0010,
              longitudeDelta: 0.0010,
            }}
          >
            <Marker
              coordinate={{
                latitude: 40.807551,
                longitude: -73.6266945,
              }}
              title={'YOGURT & SUCH'}
              image={require('../../assets/icon/MapPin.png')}
            />
          </MapView>
          <View style={{ height: 160 }}>
            <Text style={styles.addressText}>1 Glen Cove Road, Greenvale, NY 11548</Text>

            <View style={{ alignSelf: 'center', marginTop: 7 }}>
              <Text style={[styles.PhoneText, {color: '#414040'}]}>Monday - Sunday: 11:00 AM - 10:00 PM</Text>
            </View>

            <View style={{ width: 200, alignSelf: 'center' }}>
              <TouchableOpacity onPress={() => {
                this.openMail();
              }}>
                <Text style={styles.mailText}>Support@Yogurtandsuch.com</Text>
              </TouchableOpacity>
            </View>

            

            <View style={{ width: 110, alignSelf: 'center' }}>
              <TouchableOpacity onPress={() => {
                this.openCall();
              }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 7 }}>
                  <FastImage
                    source={Telephone}
                    style={{ width: 12, height: 12, alignSelf: 'center', marginRight: 5 }}
                    resizeMode={'contain'}
                  />
                  <Text style={styles.PhoneText}>516-484-1822</Text>
                </View>

              </TouchableOpacity>
            </View>

            <View style={{ width: 92, alignSelf: 'center' }}>
              <TouchableOpacity onPress={() => {
                this.openMap();
              }}>
                <Text style={styles.directionText}>Get Directions</Text>
              </TouchableOpacity>
            </View>

          </View>
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
    backgroundColor: '#FFF',
    height: 130,
  },
  headerView: {
    backgroundColor: "#FFF",
    height: 60,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: "#414040",
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#414040',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 22,
  },
  mailText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#1D77FF',
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 22,
    textDecorationLine: 'underline'
  },
  PhoneText: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#793422',
    textAlign: 'center',
    lineHeight: 22
  },
  directionText: {
    fontSize: 13,
    fontFamily: 'OpenSans-SemiBold',
    color: '#064b99',
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 22
  },
});

export default withBackHandler(Contact);