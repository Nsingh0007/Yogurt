import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import rewardIcon from '../../assets/icon/rewardIcon.png';
import cross1 from '../../assets/icon/cross1.png';
import { connect } from 'react-redux';
import { addCart } from '@api'
import {updateUserOnEdit} from '@redux';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';

Text.defaultProps={
  allowFontScaling:false,
  fontScale:1
}

export class RewardsPoints extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDetailsFetched: false,
      authToken: '',
      userDetails: {},
      HoldPoint:0,
      rewardPotint: {
        "CategoryId": 12,
        "CategoryName": "Cup",
        "SubCategoryId": 3002,
        "SubCategoryName": "Cup",
        "OrderPrice": 0.0,
        "Quantity": 1,
        "SizeId": 2,
        "IsRedeem": true,
      }
    };
  }

  componentDidMount = async () => {
    const { userDetails, authToken } = this.props.userstore;
    const HoldPoint=await AsyncStorage.getItem('holdPoints')
    this.setState({ userDetails: userDetails, authToken: authToken, HoldPoint })
    this.props.updateUserOnEditDispatch();
  };

  addToCart = async () => {
    const { userDetails, authToken, cartId, rewardPotint } = this.state;
    const sendBody = [];
    let body = {};
    body.CustomerId = userDetails.CustomerId;
    body.Email = userDetails.Email;
    body = rewardPotint
    sendBody.push(body)
    if (sendBody.length > 0) {
      await AsyncStorage.setItem('holdPoints',"75")
      const addCartResponse = await addCart(sendBody, authToken);
      this.props.navigation.navigate('revieworder');
    }
  }

  render() {
    const { userDetails } = this.props.userstore;
    const {HoldPoint} = this.state
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#793422', width: '100%', height: 260 }}>
          <View style={{height:30,width:30,margin: 10}}>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('account')}>
            <FastImage
              source={cross1}
              style={{ height: 30, width: 30, }}
            />
          </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 50,
              alignSelf: 'center',
              width: 100,
              height: 100,
              marginTop: 30,
            }}>
            <FastImage
              source={rewardIcon}
              style={{ height: 70, width: 70, margin: 15 }}
            />
          </View>
        </View>

        <View style={{ backgroundColor: '#F9F9F9', margin: 10 }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              marginTop: 20,
            }}>
            <Text style={{ fontSize: 24, fontFamily:'OpenSans-Bold', }}>Total Points</Text>
            <Text style={{ fontSize: 28, fontFamily:'OpenSans-Bold', }}>{userDetails.RewardPoints}</Text>
          </View>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              marginTop: 20,
            }}>
            <Text style={{ fontSize: 24, fontFamily:'OpenSans-Bold', }}>Used Points</Text>
            <Text style={{ fontSize: 28, fontFamily:'OpenSans-Bold', }}>{userDetails.UsedRewardPoints}</Text>
          </View>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              marginTop: 20,
            }}>
            <Text style={{ fontSize: 24, fontFamily:'OpenSans-Bold', }}>Hold Points</Text>
            <Text style={{ fontSize: 28, fontFamily:'OpenSans-Bold', }}>{HoldPoint}</Text>
          </View>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              marginTop: 20,
            }}>
            <Text style={{ fontSize: 24, fontFamily:'OpenSans-Bold', }}>Available Points</Text>
            <Text style={{ fontSize: 28, fontFamily:'OpenSans-Bold', }}>{userDetails.LeftRewardPoints}</Text>
          </View>
        </View>
        <View
          style={{
            alignSelf: 'flex-end',
            margin: 10,
            marginTop: 50,
          }}>
          <TouchableOpacity
            disabled={userDetails.LeftRewardPoints >= 75 && HoldPoint != 75 ? false : true}
            onPress={() => this.addToCart()}
            style={{
              backgroundColor: userDetails.LeftRewardPoints >= 75 ? '#793422' : '#696969',
              justifyContent: 'center',
              height: 42,
              width: 130,
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontFamily:'OpenSans-Bold',
                alignSelf: 'center',
              }}>
              Redeem Now
              </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userstore: state.userstore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserOnEditDispatch: () => {
      dispatch(updateUserOnEdit());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RewardsPoints);