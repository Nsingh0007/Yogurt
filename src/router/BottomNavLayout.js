import React, { Component } from "react";
import { StyleSheet, View, ScrollView, BackHandler, Alert, SafeAreaView, StatusBar } from "react-native";
import BottomNavigator from "./BottomNavigator";

class BottomNavLayout extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let { currentRoute } = this.props;
    return (
      <React.Fragment>
        <ScrollView bounces={false} style={{ backgroundColor: '#f1f3f5' }}>{this.props.children}</ScrollView>
        <BottomNavigator currentRoute={currentRoute}
          navigation={this.props.navigation} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: "#F8F9FA"
  }
});

export default BottomNavLayout
