import React, { Fragment, Component } from 'react';
import { Platform, BackHandler } from 'react-native';
import {topLevelNavigate} from '@navigation/topLevelRef.js';

const withBackHandler = (EncComponent, shouldCheckisFocus = false, routePName = '') => {
    class WithBackHandlerImplementation extends Component {

         
        backAction = () => {
            if(shouldCheckisFocus) {
                console.log('TEST_HOC_COC - ',this.props.navigation.isFocused());
                let isFocued = this.props.navigation.isFocused();
                if(isFocued) {
                    topLevelNavigate(routePName);
                    return true;
                }else {
                    return false;
                }
            }
            return true;
        };

        componentWillUnmount = () => {
            if (Platform.OS == 'android') {
                BackHandler.removeEventListener('hardwareBackPress', this.backAction);
            }
        }

        componentDidMount = async () => {
            if (Platform.OS == 'android') {
                BackHandler.addEventListener('hardwareBackPress', this.backAction);
            }
        };
        render() {
            return (
                <EncComponent {...this.props} />
            );
        }
    }
    return WithBackHandlerImplementation;
}
export default withBackHandler;