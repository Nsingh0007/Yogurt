import React, { Component, Fragment } from 'react';
import { rootLevelBackFunction } from '@appHoc';
const BackHoc = (WrappedComponent) => {
    return class EnhancedComponent extends Component {
        componentDidMount() {
            this._subscribe = this.props.navigation.addListener('didFocus', () => {
                rootLevelBackFunction.func = () => {
                    this.props.navigation.goBack();
                }
            });

        }
        componentWillUnmount() {
            //this._subscribe();
        }
        render() {
            return <WrappedComponent {...this.props} />
        }
    }

}

export default BackHoc;