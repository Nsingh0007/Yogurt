import React, { Fragment, Component } from 'react';
import { Platform, BackHandler } from 'react-native';


const withBackHandler = (Component) => {


    class WithBackHandlerImplementation extends Component {
        backAction = () => {
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
                <Component {...this.props} />
            );
        }
    }
    return WithBackHandlerImplementation;
}
export default withBackHandler;