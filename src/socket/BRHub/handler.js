import chalk from 'chalk';
import SocketMutations from '../../Redux/socketMutations';

class BRHubHandler {
    
    eventRecieved = (eventName, ...params) => {
        console.log(chalk.green('EVENT_RECIEVED - '+eventName), params);
    }
    broadcast = (arg) => {
        this.eventRecieved('broadcast', arg);
    } 
    BrCategoryAdd = (msg, newCategoryAdded) => {
        this.eventRecieved('BrCategoryAdd',msg,newCategoryAdded);
        let newCategoryAddedParse = JSON.parse(newCategoryAdded);
        SocketMutations.newCategoryAdd(newCategoryAddedParse);
        
    }
    BrCategoryUpdate = (msg, updatedCategory) => {
        this.eventRecieved('BrCategoryUpdate', msg, updatedCategory);
        let updatedCategoryParse = JSON.parse(updatedCategory);
        SocketMutations.onCategoryUpdate(updatedCategoryParse);
    }
    BrCategoryStatus = (msg, updatedCategory) => {
        this.eventRecieved('BrCategoryStatus', msg, updatedCategory);
        let updatedCategoryParse = JSON.parse(updatedCategory);
        SocketMutations.onCategoryUpdate(updatedCategoryParse);
    }
    BrCategoryDelete = (msg, updatedCategory) => {
        this.eventRecieved('BrCategoryDelete', msg, updatedCategory);
        let updatedCategoryParse = JSON.parse(updatedCategory);
        SocketMutations.onCategoryDelete(updatedCategoryParse);
    }

    BrSubCategoryAdd = (msg, newSubCategory) => {
        this.eventRecieved('BrSubCategoryAdd', msg, newSubCategory);
    }
    BrSubCategoryStatus = (msg, updatedSubCategory) => {
        this.eventRecieved('BrSubCategoryStatus', msg, updatedSubCategory);
    }
    BrSubCategoryUpdate = (msg, updatedSubCategory) => {
        this.eventRecieved('BrSubCategoryUpdate', msg, updatedSubCategory);
    }

    
}
export default BRHubHandler;