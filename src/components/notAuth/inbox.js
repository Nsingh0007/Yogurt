import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import cross from '../../assets/icon/icons8-back-26.png';
import {ScrollView} from 'react-native-gesture-handler';
import No_Message_icon from '../../assets/icon/No_Message_icon.png';
import {connect} from 'react-redux';

import {
  RemoveAllMessage,
  RemoveSingleMessage,
  UpdateAllMessageStatus,
  HostURL
} from '@api';

import {
  getMessageData,
  validateIsUserLoggedIn,
  messageDataReset,
  messageCountReset,
  messageSingleDataReset,
} from '@redux';

import FastImage from 'react-native-fast-image';

Text.defaultProps={
  allowFontScaling:false,
  fontScale:1
}

class inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      inboxData: [],
    };
  }

  trigurRemoveAllMessage = async () => {
    const messageDataResetDetails = await RemoveAllMessage();
    if (messageDataResetDetails.result === true) {
      Alert.alert('Message', 'All message remove successfully', [
        {
          text: 'Okay',
          onPress: () => {
            this.props.messageDataResetDispatch();
          },
        },
      ]);
    } else {
      Alert.alert('Error', 'Try Again');
    }
  };

  trigurRemoveSigleMessage = async (singleMessage) => {
    const removeSingleMessageDetails = await RemoveSingleMessage(
      singleMessage.InboxNumber,
    );
    if (removeSingleMessageDetails.result === true) {
      this.props.singleInboxRemoveDispatch(singleMessage.InboxNumber);
      Alert.alert('Message', 'Message remove successfully');
    } else {
      Alert.alert('Error', 'Try Again');
    }
  };

  triggerallMessageStatus = async () => {
    const updateAllMessageStatus = await UpdateAllMessageStatus();
    if (updateAllMessageStatus.result === true) {
    } else {
      console.log('Error in update status', 'Try Again');
    }
  };

  fetchGetMessage = async () => {
    this.props.fetchMessageData();
  };
  componentDidMount = async () => {
    this.fetchGetMessage();
    this.props.isUserLoggedIn();
    setTimeout(() => {
      this.triggerallMessageStatus();
    }, 5000);
    this.props.messageCountResetDispatch();
  };

  render() {
    const {messageStore} = this.props;
    const {inboxData, loader} = messageStore;
    const {isUserLoggedIn} = this.props.userstore;

    return (
      <View style={styles.container}>
        {/* <Spinner visible={loader}  /> */}
        <View>
          <View style={styles.header}>
            <View style={styles.headerView}>
              <View style={{width: 35, height: 35,}}>
                <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}>
                  <FastImage
                  source={cross}
                  style={{width: 35, height: 35, }}
                />
              </TouchableOpacity>
              </View>
              
              <Text style={styles.headerText}>Inbox</Text>
            </View>
          </View>
          <View
            style={{borderBottomWidth: 0.3, width: '100%', borderBottomColor: '#414040',}}
          />
         
          <ScrollView style={{marginBottom:120}} showsVerticalScrollIndicator={false}>
          <View style={{width:'97%', margin:5}}>
            {isUserLoggedIn != null &&
            isUserLoggedIn == true &&
            inboxData.length > 0 ? (
              <View >
                {inboxData.map((singleMessage) => {
                  return (                 
                    <View
                  style={{
                    height: 350,
                    width: '100%',
                    borderColor: 'red',
                    borderWidth: 0,
                    marginTop: 9,
                    alignSelf: 'center',
                    backgroundColor: '#F9F9F9',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                    borderRadius: 7
                  }}>
                  <View>
                    <FastImage
                      resizeMode="stretch"
                      source={{
                        uri: `${HostURL}${singleMessage.Pic}`,
                      }}
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        height: 200,
                        borderTopLeftRadius: 7,
                        borderTopRightRadius: 7
                      }}
                    />
                  </View>
                  <View>
                    <Text
                    numberOfLines={1}
                      style={{
                        fontSize: 19,
                        color: '#222624',
                        marginTop: 15,
                        marginStart: 15,
                        marginEnd: 8,
                        fontFamily: 'OpenSans-Bold'
                      }}>
                      {singleMessage.InboxTitle}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 13,
                        fontFamily: 'OpenSans-SemiBold',
                        color: '#262A29',
                        marginTop: 8,
                        marginStart: 15,
                        marginEnd: 8,
                      }}>
                      {singleMessage.Description}
                    </Text>
                    <TouchableOpacity
                          onPress={() =>
                            this.trigurRemoveSigleMessage(singleMessage)
                          }
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 20,
                            height: 34,
                            width: 90,
                            alignSelf: 'flex-start',
                            marginLeft:13,
                            marginTop:18,
                            borderColor: '#793422',
                            borderWidth: 0.5,
                            justifyContent:'center'
                          }}>
                          <Text
                            style={{
                              color: '#793422',
                              fontSize: 16,
                              textAlign:'center',
                              fontFamily:'OpenSans-Bold',
                            }}>
                            Remove
                          </Text>
                        </TouchableOpacity>
                  </View>
                </View> 
                  );
                })}
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 20,
                  marginBottom: 50,
                }}>
                <FastImage
                  source={No_Message_icon}
                  style={{height: 100, width: 100}}
                />
                <View style={{alignSelf:'center',}}>
                  <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    color: '#414040',
                    fontFamily:'OpenSans-Bold',
                    textAlign:'center'
                  }}>
                  No message right now
                </Text>
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 14,
                    fontFamily:'OpenSans-Regular',
                    color: '#2D0400',
                    marginTop: 10,
                    marginBottom: 10,
                    textAlign:'center',
                    width:230
                  }}>
                  Check back for seasonal offers, new menu items and promotions.
                </Text>
              </View>
            )}
             </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomColor: '#414040',
  },
  headerView: {
    margin: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    margin: 10,
    color: '#222624',
    fontFamily:'OpenSans-SemiBold',
  },
  headerImageView: {
    height: 50,
    margin: 10,
    padding: 5,
    marginBottom: 30,
    paddingBottom: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardParentView: {
    backgroundColor: '#FFF',
    width: '94%',
    height: 200,
    margin: 10,
    borderColor: 'red',
    borderWidth: 0,
  },
  cardParentView2: {
    backgroundColor: '#FFF',
    width: '94%',

    margin: 10,
    borderColor: 'red',
    borderWidth: 0,
  },
  cardImage: {
    width: '94%',
    margin: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitleText: {
    fontSize: 20,
    color: '#000',
    fontFamily:'OpenSans-Bold',
    margin: 5,
  },
  cardSubtitleText: {
    fontSize: 16,
    color: '#2D0400',
    paddingStart: 0,
    paddingEnd: 10,
    fontFamily:'OpenSans-Bold',
    margin: 1,
    width: '90%',
    flexDirection: 'column',
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMessageData: () => {
      dispatch(getMessageData());
    },
    isUserLoggedIn: () => {
      dispatch(validateIsUserLoggedIn());
    },
    messageDataResetDispatch: () => {
      dispatch(messageDataReset());
    },
    messageCountResetDispatch: () => {
      dispatch(messageCountReset());
    },
    singleInboxRemoveDispatch: (InboxNumber) => {
      dispatch(messageSingleDataReset(InboxNumber));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    messageStore: state.messageStore,
    userstore: state.userstore,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(inbox);
