import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import BottomNavigator from '../../../router/BottomNavLayout';
import Home from '../Home';
import Gift from '../Gift';
import Status from '../Status';
import TopNav from '../TopNavigator';
import Contact from '../Contact';
import { setRootBottomTabRef, navigateRootBottomTab } from '../../../router/rootBottomTabRef';
import { createAppContainer } from 'react-navigation';
const RootHomeNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false,
            gestureEnabled: false
        },
    },
    Gift: {
        screen: Gift,
        navigationOptions: {
            headerShown: false,
            gestureEnabled: false
        },
    },
    Status: {
        screen: Status,
        navigationOptions: {
            headerShown: false,
            gestureEnabled: false
        },
    },
    Order: {
        screen: TopNav,
        navigationOptions: {
            headerShown: false,
            gestureEnabled: false
        },
    },
    Contact: {
        screen: Contact,
        navigationOptions: {
            headerShown: false,
            gestureEnabled: false
        },
    },
});
const RootHomeNavigatorR = createAppContainer(RootHomeNavigator);
const RootHome = (props) => { 
    const [routeName, setRouteName] = useState('Home');
    const rootLevelNavigate = (routeName, params = {}) => {
        setRouteName(routeName);
        navigateRootBottomTab(routeName);
    } 
    return (
        <Fragment>

            <RootHomeNavigatorR ref={setRootBottomTabRef} />

            <BottomNavigator
                currentRoute={routeName}
                navigation={props.navigation}
                rootLevelNavigate={rootLevelNavigate}
            >

            </BottomNavigator>
        </Fragment>
    );
}

export default RootHome;