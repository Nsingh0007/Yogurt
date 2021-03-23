import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  LogBox
} from 'react-native';
LogBox.ignoreAllLogs()

import SignIn from '../../assets/icon/SignIn.png';
import Inbox from '../../assets/icon/Inbox.png';
import User_Profile from '../../assets/icon/User_Profile.png';
import iceCreamCorn from '../../assets/icon/Ice-Cream_Cone.png';


import {TouchableOpacity} from 'react-native-gesture-handler';

import BottomNavigator from '../../router/BottomNavigator';
import FastImage from 'react-native-fast-image';

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;

Text.defaultProps={
  allowFontScaling:false,
  fontScale:1
}

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }
  render() {
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
      <View style={{flex: 1}}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            backgroundColor: '#fff',
            height: headerHeight,
            zIndex: headreZindex,
          }}>
          <View
            style={{flex: 1, height: 10, borderColor: 'blue', borderWidth: 0}}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#efefef',
                width: '100%',
                alignItems: 'center',
                
              }}
            />
            <Animated.View
              style={{
                position: 'absolute',
                bottom: headreTitleBottom,
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
                width:'90%'
              }}>
              <View>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => this.props.navigation.navigate('login')}>
                  <FastImage source={SignIn} style={{width: 30, height: 30}} />
                  <Text style={{fontWeight: '600', padding: 5}}>Login</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={{flexDirection: 'row', marginEnd: 120, marginStart: 0}}>
                  <FastImage source={Inbox} style={{width: 30, height: 30}} />
                  <Text style={{fontWeight: '600', padding: 5}}>Inbox</Text>
                </TouchableOpacity>
              </View>
              <View >
                <TouchableOpacity onPress={()=> this.props.navigation.navigate('personalinfo')}>
                  <FastImage
                    source={User_Profile}
                    style={{
                      width: 30,
                      height: 30,
                      marginStart: 20,
                      marginEnd: 20,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
       
        </Animated.View>
        <ScrollView
          style={{flex: 1}}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
          ],()=> {console.log('')})}>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Text style={styles.headerText}>hungry meets happy</Text>
            <FastImage
              source={iceCreamCorn}
              style={{width: 30, height: 30, margin: 10}}
            />
          </View>
          <View
            style={{borderWidth: 2, borderColor: '#EFEFEF', width: '100%'}}
          />
          <View style={{justifyContent:'center',alignItems:'center',margin:50,marginTop:200}}>
            <Text style={{fontSize:16,fontWeight:'900'}}> I am from the Order screen</Text>
          </View>


        </ScrollView>
                  
            <BottomNavigator 
              currentRoute={"Order"}
              navigation={this.props.navigation}
            >             
            </BottomNavigator>
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
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 0,
  },
  headerText: {
    fontSize: 20,
    margin: 10,

    marginStart: 25,
    marginEnd: 10,
    fontWeight: '700',
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
    width: '97%',
    height: 360,
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
    paddingStart: 10,
    paddingEnd: 10,
    fontWeight: '600',
    margin: 1,
    width: '90%',
    flexDirection: 'column',
  },
});