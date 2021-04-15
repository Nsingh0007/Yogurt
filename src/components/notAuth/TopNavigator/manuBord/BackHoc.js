import React, { Component, Fragment } from 'react';
import { rootLevelBackFunction } from '@appHoc';
const BackHoc = (WrappedComponent) => {
    return class EnhancedComponent extends Component {
        componentDidMount() {
            rootLevelBackFunction.func = () => {
                this.props.navigation.goBack();
            }
        }
        render() {
            return <WrappedComponent {...this.props} />
        }
    }
     
}

export default BackHoc;