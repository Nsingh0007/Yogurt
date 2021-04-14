import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
  BackHandler,
  LogBox
} from 'react-native';
LogBox.ignoreAllLogs()

import back from '../../assets/icon/gift/back.png';

import gift1 from '../../assets/icon/gift/Image_1.png'
import gift2 from '../../assets/icon/gift/Image_7.png'
import gift3 from '../../assets/icon/gift/Image_2.png'
import gift4 from '../../assets/icon/gift/Image_4.png'
import gift5 from '../../assets/icon/gift/Image_5.png';

import Coming_Soon from '../../assets/icon/Coming_Soon.png'
import BottomNavigator from '../../router/BottomNavigator';
import BottomNavLayout from '../../router/BottomNavLayout';
import FastImage from 'react-native-fast-image';
import { withBackHandler } from '@appHoc';

Text.defaultProps={
  allowFontScaling:false,
  fontScale:1
}

class Gift extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  } 

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity 
              onPress={() => {
                this.props.navigation.goBack()
              }}
            >
              <FastImage
                source={back}
                style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: '#793422',
                fontSize: 16,
                margin: 20,
                fontFamily:'OpenSans-Bold',
              }}>
              Gift History
            </Text>
          </View>
          <Text style={{fontSize:24,fontFamily:'OpenSans-Bold',margin:10,marginStart:20}}>Gift</Text>
        </View>

        <ScrollView>
              {/* <View style={styles.cardParentView}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                    <Text style={{ color: '#414040',fontSize: 15,fontWeight:'bold'}}>Feature Collection</Text>
                   <TouchableOpacity onPress={()=> this.props.navigation.navigate("giftIndex",{ headerView: `Feature Collection`,giftImage:gift1})}>
                    <Text style={{ color: '#793422',fontSize: 15,fontWeight:'bold'}}>See all</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{borderWidth:1,width:'100%',borderColor:'#E5E5E5',alignSelf:'center'}} />
                  <View>
                    <FastImage resizeMode="stretch"  source={gift1} style={{width:'98%',height:170,margin:10,alignSelf:'center'}} />
                  </View>
              </View>


              <View style={styles.cardParentView}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                    <Text style={{ color: '#414040',fontSize: 15,fontWeight:'bold'}}>Anytime</Text>
                   <TouchableOpacity onPress={()=> this.props.navigation.navigate("giftIndex",{ headerView: `Anytime`,giftImage:gift4,giftImage2:gift5})}>
                    <Text style={{ color: '#793422',fontSize: 15,fontWeight:'bold'}}>See all</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{borderWidth:1,width:'100%',borderColor:'#E5E5E5',alignSelf:'center'}} />
                  <View style={{flexDirection:'row',justifyContent:'space-between'}} >
                    <FastImage resizeMode="stretch"  source={gift4} style={{width:'46%',height:170,margin:10,alignSelf:'center'}} />
                    <FastImage resizeMode="stretch"  source={gift5} style={{width:'46%',height:170,margin:10,alignSelf:'center'}} />
                  </View>
              </View>

              <View style={styles.cardParentView}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                    <Text style={{ color: '#414040',fontSize: 15,fontWeight:'bold'}}>Congratulation</Text>
                    <TouchableOpacity onPress={()=> this.props.navigation.navigate("giftIndex",{ headerView: `Congratulation`,giftImage:gift2})}>
                    <Text style={{ color: '#793422',fontSize: 15,fontWeight:'bold'}}>See all</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{borderWidth:1,width:'90%',borderColor:'#E5E5E5',alignSelf:'center'}} />
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <FastImage resizeMode="stretch" source={gift2} style={{width:'60%',height:160,margin:10,}} />                  
                  </View>
              </View>

              <View style={styles.cardParentView}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                    <Text style={{ color: '#414040',fontSize: 15,fontWeight:'bold'}}>Happy Birthday</Text>
                    <TouchableOpacity onPress={()=> this.props.navigation.navigate("giftIndex",{ headerView: `Happy Birthday`,giftImage:gift3,})}>
                    <Text style={{ color: '#793422',fontSize: 15,fontWeight:'bold'}}>See all</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{borderWidth:1,width:'90%',borderColor:'#E5E5E5',alignSelf:'center'}} />
                  <View>
                    <FastImage resizeMode="stretch" source={gift3} style={{width:'60%',height:160,margin:10,alignSelf:'flex-start'}} />
                  </View>
              </View>

              
              <View style={styles.cardParentView}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                    <Text style={{ color: '#414040',fontSize: 15,fontWeight:'bold'}}>Thank You</Text>                    
                  </View>
                  <View style={{borderWidth:1,width:'90%',borderColor:'#E5E5E5',alignSelf:'center'}} />
                  <View style={{alignItems:'center',justifyContent:'center'}}>
                  <Text style={{ color: '#414040',fontSize: 22,fontWeight:'bold',marginTop:77}}>No Result Available</Text>
                  </View>
              </View> */}
              <View style={{backgroundColor:'#EEDC9A'}}>
                <FastImage resizeMethod="scale" resizeMode="cover" source ={Coming_Soon} style={{width:'100%',height:300}} />
              </View>

        </ScrollView> 
      </View>
    );
  }
}
export default withBackHandler(Gift);
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
    width: '94%',
    height: 230,
    alignSelf:'center',
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