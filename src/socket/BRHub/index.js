import BRHandlers from './handler';
import EventsList from './eventsList';

class BRHub extends BRHandlers {
    hubName = 'BRHub';
    socketRoot;
    hubProxy;

    events = [];
    constructor(socket) {
        super();
        this.socketRoot = socket;
        this.configureBRHubListeners();
    }
    setHubProxy = (hubProxy) => {
        this.hubProxy = hubProxy;
    }
    listen = () => { 
        this.events.map((events) => {
            this.hubProxy.on(events.name, events.handler);
        });
    } 
    configureBRHubListeners = () => {
        this.events.push(
            {
                name: EventsList.broadcast,
                handler: this.broadcast
            },
            {
                name: EventsList.Category.BrCategoryAdd,
                handler: this.BrCategoryAdd
            }, 
            {
                name: EventsList.Category.BrCategoryUpdate,
                handler: this.BrCategoryUpdate
            },
            {   
                name: EventsList.Category.BrCategoryStatus,
                handler: this.BrCategoryStatus
            },
            {
                name: EventsList.Category.BrCategoryDelete,
                handler: this.BrCategoryDelete
            },
            {
                name: EventsList.SubCategory.BrSubCategoryStatus,
                handler: this.BrSubCategoryStatus
            },
            {
                name: EventsList.SubCategory.BrSubCategoryUpdate,
                handler: this.BrSubCategoryUpdate
            },
            {
                name: EventsList.SubCategory.BrSubCategoryAdd,
                handler: this.BrSubCategoryAdd
            }
        );
    }
    
}

export default BRHub;  