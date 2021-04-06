import React, {Component} from 'react';
import {View, Text, Animated, Easing, Image, } from 'react-native';
import FastImage from 'react-native-fast-image';

export default class Splash extends Component {
  constructor() {
    super();
    
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.replace('Home');
    }, 1000);
  }
  
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FastImage
          style={{
            width: '100%',
            height: '100%',
          }}
          source={require('../../assets/Splash.png')}
        />
      </View>
    );
  }
}
