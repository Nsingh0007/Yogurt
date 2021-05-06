import React from 'react';
import {SafeAreaView, Text, Alert} from 'react-native';
import {ReduxStore} from '@redux';
import {Provider} from 'react-redux';
import Appcontainer from './src/router/index';
import {setJSExceptionHandler} from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import {setTopLevelNav} from '@navigation/topLevelRef.js';

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};

class App extends React.Component {
  jsExceptionHandler = (e, isFatal) => {
    if (isFatal) {
      Alert.alert(
        'Unexpected error occurred',
        `Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}
            We will need to restart the app.`,
        [
          {
            text: 'Restart',
            onPress: () => {
              RNRestart.Restart();
            },
          },
        ],
      );
    } else {
      //console.log("--------------------------", e, "isfatal:", isFatal);
    }
  };

  componentDidMount() {
    setJSExceptionHandler((error, isFatal) => {
      this.jsExceptionHandler(error, isFatal);
    }, true);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Provider store={ReduxStore}>
          <Appcontainer ref={setTopLevelNav} />
        </Provider>
      </SafeAreaView>
    );
  }
}
export default App;
