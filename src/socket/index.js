import signalr from 'react-native-signalr'; 
import { SOCKETURL } from '../Constants';
import chalk from 'chalk';
import BRHub from './BRHub';
class Socket {

    //socket level variables
    connection;
    BRHub; 

    constructor() {
        this.BRHub = new BRHub(this); 
    }
    init = () => {
        this.connection = signalr.hubConnection(SOCKETURL.endPoint);
        this.connection.logging = true;

        // Creating BRHubs
        const BRHubProxy = this.connection.createHubProxy(this.BRHub.hubName);
        this.BRHub.setHubProxy(BRHubProxy);
        this.BRHub.listen();

        
        this.connection.start().done(() => {
            console.log(chalk.bgGreen('SOCKET_CONNECTED - '), this.connection.id);
        }).fail(() => {
            console.log(chalk.bold.bgRed('SOCKET_ERROR - '));
        });


        this.connectionHandling();
    }
    connectionHandling = () => {
        //connection-handling
        this.connection.connectionSlow(() => {
            console.log(chalk.bgCyan('SOCKET_CONNECTION_SLOW'));
        });

        this.connection.error((error) => {
            const errorMessage = error.message;
            let detailedError = '';
            if (error.source && error.source._response) {
                detailedError = error.source._response;
            }
            if (detailedError === 'An SSL error has occurred and a secure connection to the server cannot be made.') {
                //console.log('When using react-native-signalr on ios with http remember to enable http in App Transport Security https://github.com/olofd/react-native-signalr/issues/14')
            }
            //console.debug('SignalR error: ' + errorMessage, detailedError)
            console.log(chalk.bold.red('SIGNALR_ERROR - '), errorMessage, detailedError);
        });
    }
}

export default new Socket();