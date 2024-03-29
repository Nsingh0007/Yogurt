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
            // Category
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
            // SubCategory
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
            },
            {
                name: EventsList.SubCategory.BrSubCategoryDelete,
                handler: this.BrSubCategoryDelete
            },

            // Flavor
            {
                name: EventsList.Flavor.BrFlavorAdd,
                handler: this.BrFlavorAdd
            },
            {
                name: EventsList.Flavor.BrFlavorUpdate,
                handler: this.BrFlavorUpdate
            },
            {
                name: EventsList.Flavor.BrFlavorStatus,
                handler: this.BrFlavorStatus
            },
            {
                name: EventsList.Flavor.BrFlavorDelete,
                handler: this.BrFlavorDelete
            },

            // Toppings
            {
                name: EventsList.Topping.BrToppingAdd,
                handler: this.BrToppingAdd
            },
            {
                name: EventsList.Topping.BrToppingUpdate,
                handler: this.BrToppingUpdate
            },
            {
                name: EventsList.Topping.BrToppingStatus,
                handler: this.BrToppingStatus
            },
            {
                name: EventsList.Topping.BrToppingDelete,
                handler: this.BrToppingDelete
            },

            // Featured
            {
                name: EventsList.Feature.BrFeatureAdd,
                handler: this.BrFeatureAdd
            },
            {
                name: EventsList.Feature.BrFeatureUpdate,
                handler: this.BrFeatureUpdate
            },
            {
                name: EventsList.Feature.BrFeatureStatus,
                handler: this.BrFeatureStatus
            },
            {
                name: EventsList.Feature.BrFeatureDelete,
                handler: this.BrFeatureDelete
            },
            
            // Angular
            {
                name: EventsList.Angular.BANewOrderRecieved,
                handler: this.BANewOrderRecieved
            },

            // Banner
            {
                name: EventsList.BANNER.BrOfferBannersAdd,
                handler: this.BrOfferBannersAdd
            },
            {
                name: EventsList.BANNER.BrOfferBannersUpdate,
                handler: this.BrOfferBannersUpdate
            },
            {
                name: EventsList.BANNER.BrOfferBannersStatus,
                handler: this.BrOfferBannersStatus
            },
            {
                name: EventsList.BANNER.BrOfferBannersDelete,
                handler: this.BrOfferBannersDelete
            },
            //OrderStatus
            {
                name: EventsList.ORDERS.BrOrderStatus,
                handler: this.BrOrderStatus
            },
        );
    }
    
}

export default BRHub;  