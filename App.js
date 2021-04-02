import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, Alert, View, Button } from 'react-native';
import { ReduxStore } from '@redux';
import { Provider } from 'react-redux';
import Appcontainer from './src/router/index';
import { setJSExceptionHandler } from "react-native-exception-handler";
import RNRestart from "react-native-restart";
import { setTopLevelNav } from '@navigation/topLevelRef.js';
import { Component } from 'react';
Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1
}

class App extends React.Component {

  jsExceptionHandler = (e, isFatal) => {
    //console.log("JS Error ", e, "isfatal:", isFatal);
    //crashlytics().log(e);
    if (isFatal) {
      Alert.alert(
        "Unexpected error occurred",
        `Error: ${isFatal ? "Fatal:" : ""} ${e.name} ${e.message}
            We will need to restart the app.`,
        [
          {
            text: "Restart",
            onPress: () => {
              RNRestart.Restart();
            },
          },
        ]
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
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={ReduxStore}>
          <Appcontainer ref={setTopLevelNav} />
        </Provider>
      </SafeAreaView>
    );
  }
}
export default App;
 