import React,{Component, Fragment} from 'react';
import { Text } from 'react-native';

const withToppingFlavor = (OriginalComponent) => {

    class EnhancedComponent extends Component {

        render() {
            return(
                <Text>Hello</Text>
            );
        };
    }
    return EnhancedComponent;
}

export default withToppingFlavor;