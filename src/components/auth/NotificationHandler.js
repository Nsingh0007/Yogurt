import firebase from 'react-native-firebase';

export async function checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        const Token = getFcmToken();
        return Token
    } else {
        requestPermission();
    }
}

export async function getFcmToken() {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
        console.log('FCM Token from handler ========', fcmToken);
    } else {
        console.log('FCM Token ========', 'No token received');
        return null
    }
    return fcmToken
}

export async function requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
    } catch (error) {
        // User has rejected permissions
    }
}

export async function messageListener () {
    const notificationListener = firebase.notifications().onNotification((notification) => {
        firebase.notifications().displayNotification(notification)
    });

    const messageListener = firebase.messaging().onMessage((message) => {
        console.log(JSON.stringify(message));
    });
}
