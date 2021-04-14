
import SocketMutation from './SocketMutation.js';
import SocketHandler from './SocketHandler'; 
import signalr from 'react-native-signalr';

class Socket {
    mutations;
    socketHandler;
    constructor() {
        this.mutations = new SocketMutation(this);
        this.socketHandler = new SocketHandler(this);
    }
    initialize = () => {

        const connection = signalr.hubConnection('https://yogurtapp.moreyeahs.in/signalR/myHub');

        connection.logging = true;

        const proxy = connection.createHubProxy('myHub');
        proxy.on('broadcast', (argOne) => {
            console.log('ARG_ONE1 - ', argOne);
        })
        connection.start().done(() => {
            
            console.log('Now connected, connection ID=' + connection.id);
             
        }).fail(() => {
            console.log("CONNECTION_FAILED")
        });


        //connection-handling
        connection.connectionSlow(() => {
            console.log('We are currently experiencing difficulties with the connection.')
        });

        connection.error((error) => {
            const errorMessage = error.message;
            let detailedError = '';
            if (error.source && error.source._response) {
                detailedError = error.source._response;
            }
            if (detailedError === 'An SSL error has occurred and a secure connection to the server cannot be made.') {
                console.log('When using react-native-signalr on ios with http remember to enable http in App Transport Security https://github.com/olofd/react-native-signalr/issues/14')
            }
            console.debug('SignalR error: ' + errorMessage, detailedError)
        });
    }
}

export default new Socket();