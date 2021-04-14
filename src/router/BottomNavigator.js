import React, { Component, Fragment } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
AntDesign.loadFont();
import Home from '../assets/Deselect/Home.png'
import Gift from '../assets/Deselect/Gift.png'
import Contact from '../assets/Deselect/Contact.png'
import Order from '../assets/Deselect/Order.png'
import Status from '../assets/Deselect/Status.png'
import selectedHome from '../assets/Select/Home.png'
import selectedGift from '../assets/Select/Gift.png'
import selectedContact from '../assets/Select/Contact.png'
import selectedOrder from '../assets/Select/Order.png'
import selectedStatus from '../assets/Select/Status.png'
import { connect } from 'react-redux';
import { topLevelNavigate } from '@navigation/topLevelRef.js';
import FastImage from 'react-native-fast-image';

class BottomNavigator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { currentRoute, rootLevelNavigate } = this.props;
    const { isUserLoggedIn, loading } = this.props.userstore;
    return (
      <View>
        {/* <Fragment>{this.props.children}</Fragment> */}
        <View style={styles.TabNavigatorView}>

          <TouchableOpacity
            style={{ width: '20%' }}
            onPress={() => {
              if (currentRoute != 'Home') {
                rootLevelNavigate('Home');
              }
            }}>
            {currentRoute == 'Home' ? (
              <FastImage source={selectedHome} style={styles.routesImageView} />
            ) : (
              <FastImage source={Home} style={styles.routesImageView} />
            )}
            {currentRoute == 'Home' ? (
              <Text style={styles.selectedRouteTextView}>Home</Text>
            ) : (
              <Text style={styles.routeTextView}>Home</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: '20%' }}
            onPress={() => {
              if (currentRoute != 'Gift') {
                rootLevelNavigate('Gift');
                //this.props.navigation.navigate('Gift');
              }
            }}>
            {currentRoute == 'Gift' ? (
              <FastImage source={selectedGift} style={styles.routesImageView} />
            ) : (
              <FastImage source={Gift} style={styles.routesImageView} />
            )}
            {currentRoute == 'Gift' ? (
              <Text style={styles.selectedRouteTextView}>Gift</Text>
            ) : (
              <Text style={styles.routeTextView}>Gift</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: '20%' }}
            onPress={() => {
              if (currentRoute != 'Order') {
                if (isUserLoggedIn) {
                  rootLevelNavigate('Order');
                  //this.props.navigation.navigate('topNav');
                } else {
                  topLevelNavigate('login');
                  //this.props.navigation.navigate('login');
                }
              }
            }}>
            {currentRoute == 'Order' ? (
              <FastImage source={selectedOrder} style={styles.routesImageView} />
            ) : (
              <FastImage source={Order} style={styles.routesImageView} />
            )}
            {currentRoute == 'Order' ? (
              <Text style={styles.selectedRouteTextView}>Order</Text>
            ) : (
              <Text style={styles.routeTextView}>Order</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: '20%' }}
            onPress={() => {
              if (currentRoute != 'Status') {
                rootLevelNavigate('Status');
                //this.props.navigation.navigate('Status');
              }
            }}>
            {currentRoute == 'Status' ? (
              <FastImage source={selectedStatus} style={styles.routesImageView} />
            ) : (
              <FastImage source={Status} style={styles.routesImageView} />
            )}
            {currentRoute == 'Status' ? (
              <Text style={styles.selectedRouteTextView}>Status</Text>
            ) : (
              <Text style={styles.routeTextView}>Status</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: '20%' }}
            onPress={() => {
              if (currentRoute != 'Contact') {
                rootLevelNavigate('Contact');
                //this.props.navigation.navigate('Contact');
              }
            }}>
            {currentRoute == 'Contact' ? (
              <FastImage source={selectedContact} style={styles.routesImageView} />
            ) : (
              <FastImage source={Contact} style={styles.routesImageView} />
            )}
            {currentRoute == 'Contact' ? (
              <Text style={styles.selectedRouteTextView}>Contact</Text>
            ) : (
              <Text style={styles.routeTextView}>Contact</Text>
            )}
          </TouchableOpacity>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userstore: state.userstore,
    messageStore: state.messageStore,
  };
};

export default connect(mapStateToProps, null)(BottomNavigator);

const styles = StyleSheet.create({
  TabNavigatorView: {
    backgroundColor: '#FFFFFF',
    height: 70,
    borderTopColor: '#C4C4C4',
    borderTopWidth: 0.2,
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 5,
    marginBottom: -3
  },
  routesImageView: {
    alignSelf: 'center',
    height: 35,
    width: 35
  },
  routeTextView: {
    textAlign: 'center',
    fontSize: 12,

    color: '#696969',
    paddingTop: 5,
  },
  selectedRouteTextView: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#793422',
    paddingTop: 5,
  },
});