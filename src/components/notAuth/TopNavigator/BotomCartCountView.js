import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { topLevelNavigate } from '@navigation/topLevelRef.js';
import FastImage from "react-native-fast-image";
import cart1 from "../../../assets/icon/order/cart1.png";
import cart2 from "../../../assets/icon/order/cart2.png";

class BottomCartCountView extends Component {

    render() {
        const { getCartStore } = this.props;
        const { cartData } = getCartStore;
        return (
            <View
                style={{
                    height: 65,
                    backgroundColor: '#262A29',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                }}>
                <View style={{ width: '80%' }}>
                    <Text
                        style={[styles.subContent, { color: '#bfbfbf', marginStart: 0 }]}>
                        Pickup Store
            </Text>
                    <View
                        style={{ borderBottomWidth: 0.3, borderBottomColor: '#666666' }}>
                        <Text
                            style={[
                                styles.subContent,
                                { color: '#FFF', margin: 0, marginStart: 0 },
                            ]}>
                            Greenvale, NY 11548
              </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => topLevelNavigate('revieworder', {
                    toRoute: this.props.toRoute
                })}>
                    <View style={{ marginTop: -18 }}>
                        <View
                            style={{
                                zIndex: 10,
                                height: 28,
                                width: 27,
                                top: 40,
                                right: -9,
                            }}>
                            <Text
                                style={{
                                    color: '#FFF',
                                    fontSize: 18,
                                    fontFamily: 'OpenSans-SemiBold',
                                    textAlign: 'center',
                                }}>
                                {cartData.TotalQuantity}
                            </Text>
                        </View>
                        {cartData.TotalQuantity > 0 ? (
                            <FastImage
                                source={cart2}
                                style={{ width: 45, height: 45 }}
                                resizeMode="contain"
                            />
                        ) : (
                            <FastImage
                                source={cart1}
                                style={{ width: 45, height: 45 }}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        categoryStore: state.categoryStore,
        getCartStore: state.getCartStore
    };
};
export default connect(mapStateToProps, null)(BottomCartCountView);
const styles = StyleSheet.create({
    continer: {
        flex: 1,
        width: '100%',
    },
    img: {
        width: 30,
        height: 30,
        margin: 20,
    },
    txt: {
        fontSize: 18,
        fontFamily: 'OpenSans-Bold',
        alignSelf: 'center',
        marginTop: 100,
        color: '#696969',
    },
    subContent: {
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
        fontWeight: 'bold',
        margin: 5,
        marginStart: 20,
        color: '#414040',
    },
});