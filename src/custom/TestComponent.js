import React, { useEffect, useState } from 'react';
import {Text,View,} from 'react-native';
import Socket from '../socket';

const TestComponent = () => {
    const [ counter, setCounter ] = useState(0);
     
    return(
        <Text>TEXT - {counter}</Text>
    );
}

export default TestComponent;