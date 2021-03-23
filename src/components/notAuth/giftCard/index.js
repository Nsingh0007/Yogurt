import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LogBox
} from 'react-native';
LogBox.ignoreAllLogs()

import back from '../../../assets/icon/gift/back.png';
import FastImage from 'react-native-fast-image';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    let giftImage= this.props.navigation.getParam("giftImage")
    let giftImage2= this.props.navigation.getParam("giftImage2")      
    let headerView = this.props.navigation.getParam("headerView")
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
                style={{width: 40, height: 40, margin: 10}}
              />
            </TouchableOpacity>          
          </View>
            <Text style={{fontSize:24,fontFamily:'OpenSans-Bold',margin:10,marginStart:20}}>{headerView}</Text>
        </View>

        <ScrollView>
              <View style={styles.cardParentView}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                    
                  </View>
                  <View style={{borderWidth:1,width:'90%',borderColor:'#E5E5E5',alignSelf:'center'}} />
                  <View>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("sendegift",{giftImage})}>
                        <FastImage resizeMode="stretch" source={giftImage} style={{width:'98%',height:170,margin:10,alignSelf:'center'}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("sendegift",{giftImage:giftImage2})}>
                        <FastImage resizeMode="stretch" source={giftImage2} style={{width:'98%',height:170,margin:10,alignSelf:'center'}} />
                    </TouchableOpacity>
                  </View>
              </View>
        </ScrollView>
       
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
    fontFamily:'OpenSans-Bold',
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
    fontFamily:'OpenSans-Bold',
    color: '#000',
    margin: 5,
  },
  cardSubtitleText: {
    fontSize: 16,
    fontFamily:'OpenSans-Bold',
    color: '#2D0400',
    paddingStart: 10,
    paddingEnd: 10,
    margin: 1,
    width: '90%',
    flexDirection: 'column',
  },
});
