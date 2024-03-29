//import liraries
import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import ORDERPLACED from '../../../../assets/icon/order/OrderPlacedIMG.png';
import { topLevelNavigate } from '../../../../router/topLevelRef';
import { navigateRootBottomTab } from '../../../../router/rootBottomTabRef';
// create a component
const OrderPlaced = (props) => {

  useEffect(() => {
    setTimeout(() => {
      topLevelNavigate('RootHome');
      setTimeout(()=>{
        navigateRootBottomTab('Status');
      }, 100);
    }, 2000);
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
