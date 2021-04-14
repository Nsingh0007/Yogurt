//import liraries
import React, {Component, Fragment} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import rewards from '../assets/icon/snow.png';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
// create a component
const ProgressBar = (props) => {
   const {userDetails} = useSelector((state)=>state?.userstore);

  return (
    <Fragment>
      <View style={{width: '98%', alignSelf: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: 'OpenSans-Bold',
                marginStart: 6,
              }}>
              {userDetails?.LeftRewardPoints == null
                ? 0
                : userDetails?.LeftRewardPoints}
            </Text>
            <FastImage
              source={rewards}
              style={{
                width: 15,
                height: 15,
                margin: 12,
                marginLeft: 3,
                marginTop: 15,
              }}
            />
          </View>
          <View style={{alignSelf: 'flex-end', margin: 7}}>
            <Text style={styles.freeMiniText}>Yogurt & Such Rewards</Text>
            <Text style={styles.freeMiniText}>
              Free mini cup for every 75 flakes
            </Text>
          </View>
        </View>

        <View
          style={{
            marginVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '96%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.progressBarMainView}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressBarcompleted,
                        {width: props.data.progressBarcompleted1Data},
                      ]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.progressBarMainView}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={[styles.Circle, {backgroundColor: props.data.firstCircleColor}]}
                  />
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressBarcompleted,
                        {width: props.data.progressBarcompleted2Data},
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.barText}>75</Text>
              </View>

              <View style={styles.progressBarMainView}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={[
                      styles.Circle,
                      {backgroundColor: props.data.secondCircleColor},
                    ]}
                  />
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressBarcompleted,
                        {width: props.data.progressBarcompleted3Data},
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.barText2}>150</Text>
              </View>

              <View style={styles.progressBarMainView}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={[styles.Circle, {backgroundColor: props.data.thirdCircleColor}]}
                  />
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressBarcompleted,
                        {width: props.data.progressBarcompleted4Data},
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.barText2}>225</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            alignSelf: 'center',
            margin: 10,
          }}>
          <TouchableOpacity
            disabled={
                props.data.IsRedeem || userDetails.LeftRewardPoints < 75
                ? true
                : false
            }
            onPress={() => props.add()}
            style={{
              backgroundColor:
              props.data.IsRedeem || userDetails.LeftRewardPoints < 75
                  ? '#C4C4C4'
                  : 'lightblue',
              justifyContent: 'center',
              height: 42,
              width: 130,
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 15,
                fontFamily: 'OpenSans-Bold',
                alignSelf: 'center',
              }}>
              Redeem Now
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            fontWeight: '400',
            fontFamily: 'OpenSans-SemiBold',
            margin: 4,
          }}>
          Earn flakes
        </Text>

        <FastImage
          source={rewards}
          style={{width: 30, height: 30, alignSelf: 'center', margin: 4}}
        />

        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            fontWeight: '400',
            fontFamily: 'OpenSans-SemiBold',
            margin: 4,
          }}>
          For every dollar you spend
        </Text>
      </View>
    </Fragment>
  );
};

// define your styles
const styles = StyleSheet.create({
  barText: {
    marginLeft: -5,
  },
  barText2: {
    marginLeft: -10,
  },
  progressBarMainView: {
    flexDirection: 'column',
    width: '24%',
  },
  progressBar: {
    borderWidth: 1,
    width: '100%',
    height: 4,
    backgroundColor: '#E8E8E8',
    borderColor: '#E8E8E8',
    margin: 4,
    marginStart: -1,
    justifyContent: 'center',
  },
  progressBarcompleted: {
    height: 4,
    backgroundColor: 'lightblue',
  },
  Circle: {
    borderWidth: 1,
    width: 15,
    height: 15,
    borderColor: '#E8E8E8',
    borderRadius: 7.5,
    marginStart: -5,
  },
  freeMiniText: {
    flexWrap: 'wrap',
    fontWeight: '500',
    fontSize: 12,
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'right',
  },
});

//make this component available to the app
export default ProgressBar;
