import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import BottomNavigator from '../../../router/BottomNavLayout';
import Home from '../Home';
import Gift from '../Gift';
import Status from '../Status';
import TopNav from '../TopNavigator';
import Contact from '../Contact';

import { createAppContainer, NavigationActions } from 'react-navigation';
const RootHomeNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false,
        },
    },
    Gift: {
        screen: Gift,
        navigationOptions: {
            headerShown: false,
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
        },
    },
    Contact: {
        screen: Contact,
        navigationOptions: {
            headerShown: false,
        },
    },
});
const RootHomeNavigatorR = createAppContainer(RootHomeNavigator);
const RootHome = (props) => {
    const rootHomeNavRef = useRef();
    const [routeName, setRouteName] = useState('Home');
    const rootLevelNavigate = (routeName, params = {}) => {
        setRouteName(routeName);
        rootHomeNavRef.current.dispatch(
            NavigationActions.navigate({
                routeName, params
            })
        );
    }
    if (rootHomeNavRef.current?.state) {

        console.log("TEST_NAME_CHECK5 - ", [...Object.keys(rootHomeNavRef?.current?.state.nav.routes)]);
    }
    return (
        <Fragment>

            <RootHomeNavigatorR ref={rootHomeNavRef} />

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