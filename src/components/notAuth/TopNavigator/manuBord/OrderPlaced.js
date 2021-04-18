//import liraries
import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import ORDERPLACED from '../../../../assets/icon/order/OrderPlacedIMG.png';

// create a component
const OrderPlaced = (props) => {

  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('RootHome');
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <FastImage
        source={ORDERPLACED}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default OrderPlaced;
