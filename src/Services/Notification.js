import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import firebase from 'react-native-firebase';

class NotificationService {
    init = false;
    token = '';
    hasToken = false;
    hasPermission = false;
    constructor() {

    }
    init = () => {
        this.init = true;
        this.checkPermission();
        this.messageListener();
    }
    getToken = () => {
        return this.token;
    }
    tokenAssignment = async () => {
        let token = await this.getFcmToken();
        if (token) {
            this.token = token;
            this.hasToken = true;
            this.hasPermission = true;
        }
    }
    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.tokenAssignment();
        } else {
            let askForPermission = await this.requestPermission();
            if (askForPermission) {
                this.tokenAssignment();
            }
        }
    };

    getFcmToken = async () => {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            return fcmToken;
        } else {
            return null;
        }
    };

    requestPermission = async () => {
        try {
            let permission = await firebase.messaging().requestPermission();
            this.hasPermission = true;
            return true;
        } catch (error) {
            this.hasPermission = false;
            return false;
        }
    };

    messageListener = async () => {
        if (Platform.OS === 'ios') {
            const forgraoundNotificationListener = firebase
                .notifications()
                .onNotification((notification) => {
                    console.log('Notification forground----- ', notification);
                    new firebase.notifications().displayNotification(notification);
                });
        } else {
            const messageListener = firebase.messaging().onMessage((message) => {
                PushNotification.localNotification({
                    smallIcon: 'ic_notification',
                    message,
                });
            });
        }
    };

}

export default new NotificationService();