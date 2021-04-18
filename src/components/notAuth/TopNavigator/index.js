 
import React, { Fragment,useEffect } from 'react';
 
import { View, Text, Platform, TouchableOpacity } from 'react-native';
 
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
 

import Menu from './Menu';
import Featured from './Flavours';
import Previous from './Previous';
import Favorites from './Favorites';

import { setTopTabRef } from '../../../router/topTabRef';
import BottomCartCountView from './BotomCartCountView';
import { withBackHandler } from '@appHoc';

const TabScreen = createMaterialTopTabNavigator(
  {
    Menu: { screen: Menu, },
    Featured: { screen: Featured },
    Previous: { screen: Previous },
    Favorites: { screen: Favorites },
  },
  {
    initialRouteName: 'Featured',
    tabBarOptions: {
      activeTintColor: '#414040',
      inactiveTintColor: '#696969',

      style: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        allowFontScaling: false
      },
      bounces: '#414040',
      allowFontScaling: false,
      labelStyle: {
        //scrollEnabled: true,
        textAlign: 'center',
        textTransform: 'capitalize',
        fontFamily: 'OpenSans-Bold',
        fontSize: Platform.OS == 'ios' ? 14 : 13,
      },
      indicatorStyle: {
        borderBottomColor: '#793422',
        borderBottomWidth: 3,
      },
    },
  }
);
const TabScreenNavigator = createAppContainer(TabScreen);
class CustomTabScreen extends React.Component {

  render() {
    return (
      <Fragment>
        <TabScreenNavigator ref={setTopTabRef} />

        <BottomCartCountView toRoute={'RootHome'} />
      </Fragment>
    );
  };
} 
//making a StackNavigator to export as default
const App = createStackNavigator({

  TabScreen: {
    screen: withBackHandler(CustomTabScreen, true, 'RootHome'),
    //screen: CustomTabScreen,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#FFF',
        height: 80,
      },
      headerBackTitleVisible: false,
      headerTintColor: '#414040',
      title: 'Order',
      headerTitleAlign: 'left',
      headerTitleAllowFontScaling: false,
      headerTitleStyle: { color: '#222624', fontFamily: 'OpenSans-Bold', fontSize: 24, paddingStart: 5, marginTop: 20, },
      headerLeft: () =>  null
    },
  },
});
 
let AppWithCreateAppContainer = createAppContainer(App);
const MapScreen = (props) => {
  useEffect(() => {
     
  }, []);
  return (
    <Fragment>
      <AppWithCreateAppContainer />
    </Fragment>
  );
}
export default MapScreen;