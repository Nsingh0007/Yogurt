import chalk from 'chalk';
import SocketMutations from '../../Redux/socketMutations';

class BRHubHandler {
    
    eventRecieved = (eventName, ...params) => {
        console.log(chalk.green('EVENT_RECIEVED - '+eventName), params);
    }
    broadcast = (arg) => {
        this.eventRecieved('broadcast', arg);
    } 

    //Category Mutations
    BrCategoryAdd = (msg, newCategoryAdded) => {
        this.eventRecieved('BrCategoryAdd',msg,newCategoryAdded);
        let newCategoryAddedParse = JSON.parse(newCategoryAdded);
        SocketMutations.category.newCategoryAdd(newCategoryAddedParse);
        
    }
    BrCategoryUpdate = (msg, updatedCategory) => {
        this.eventRecieved('BrCategoryUpdate', msg, updatedCategory);
        let updatedCategoryParse = JSON.parse(updatedCategory);
        SocketMutations.category.onCategoryUpdate(updatedCategoryParse);
    }
    BrCategoryStatus = (msg, updatedCategory) => {
        this.eventRecieved('BrCategoryStatus', msg, updatedCategory);
        let updatedCategoryParse = JSON.parse(updatedCategory);
        SocketMutations.category.onCategoryUpdate(updatedCategoryParse);
    }
    BrCategoryDelete = (msg, updatedCategory) => {
        this.eventRecieved('BrCategoryDelete', msg, updatedCategory);
        let updatedCategoryParse = JSON.parse(updatedCategory);
        SocketMutations.category.onCategoryDelete(updatedCategoryParse);
    }

    //Subacategory Mutations
    BrSubCategoryAdd = (msg, newSubCategory) => {
        this.eventRecieved('BrSubCategoryAdd', msg, newSubCategory);
        SocketMutations.subCategory.onSubCategoryAdd(JSON.parse(newSubCategory));
    }
    BrSubCategoryStatus = (msg, updatedSubCategory) => {
        this.eventRecieved('BrSubCategoryStatus', msg, updatedSubCategory);
        SocketMutations.subCategory.onSubCategoryUpdate(JSON.parse(updatedSubCategory));
    }
    BrSubCategoryUpdate = (msg, updatedSubCategory) => {
        this.eventRecieved('BrSubCategoryUpdate', msg, updatedSubCategory);
        SocketMutations.subCategory.onSubCategoryUpdate(JSON.parse(updatedSubCategory));
    }
    BrSubCategoryDelete = (msg, deletedSubCategory) => {
        this.eventRecieved('BrSubCategoryDelete', msg, deletedSubCategory);
        SocketMutations.subCategory.onSubCategoryDelete(JSON.parse(deletedSubCategory));
    }

    //Flavour Mutations
    BrFlavorAdd = (msg, newAddedFlavor) => {
        this.eventRecieved('BrFlavorAdd', msg, newAddedFlavor);
        SocketMutations.flavor.onNewFlavorAdd(newAddedFlavor);
    }
    BrFlavorUpdate = (msg, updatedFlavor) => {
        this.eventRecieved('BrSubCategoryUpdate', msg, updatedFlavor);
        SocketMutations.flavor.onFlavorUpdate(updatedFlavor);
    }
    BrFlavorStatus = (msg, updatedFlavor) => {
        this.eventRecieved('BrFlavorStatus', msg, updatedFlavor);
        SocketMutations.flavor.onFlavorUpdate(JSON.parse(updatedFlavor));
    }
    BrFlavorDelete = (msg, deletedFlavor) => {
        this.eventRecieved('BrFlavorDelete', msg, deletedFlavor);
        SocketMutations.flavor.onFlavorDelete(JSON.parse(deletedFlavor));
    }
    
    //Toppings Mutations
    BrToppingAdd = (msg, newAddedTopping) => {
        this.eventRecieved('BrToppingAdd', msg, newAddedTopping); 
    }
    BrToppingUpdate = (msg, updatedTopping) => {
        this.eventRecieved('BrToppingUpdate', msg, updatedTopping);
        SocketMutations.topping.onToppingUpdate(JSON.parse(updatedTopping));
    }
    BrToppingStatus = (msg, updatedToping) => {
        this.eventRecieved('BrToppingStatus', msg, updatedToping); 
    }
    BrToppingDelete = (msg, deletedTopping) => {
        this.eventRecieved('BrToppingDelete', msg, deletedTopping); 
        SocketMutations.topping.onToppingDelete(JSON.parse(deletedTopping));
    }

    // Featured Mutations

    //Toppings Mutations
    BrFeatureAdd = (msg, newFeature) => {
        this.eventRecieved('BrFeatureAdd', msg, newFeature); 
        SocketMutations.featured.onFeatureAdd(JSON.parse(newFeature));
    }
    BrFeatureUpdate = (msg, featureUpdate) => {
        this.eventRecieved('BrFeatureUpdate', msg, featureUpdate); 
        SocketMutations.featured.onFeatureUpdate(JSON.parse(featureUpdate));
    }
    BrFeatureStatus = (msg, featureUpdate) => {
        this.eventRecieved('BrFeatureStatus', msg, featureUpdate); 
        SocketMutations.featured.onFeatureUpdate(JSON.parse(featureUpdate));
    }
    BrFeatureDelete = (msg, deletedFeature) => {
        this.eventRecieved('BrFeatureDelete', msg, deletedFeature);
        SocketMutations.featured.onFeaturedDelete(JSON.parse(deletedFeature));  
    }
    BANewOrderRecieved = (msg, newOrder) => {
        this.eventRecieved('BANewOrderRecieved', msg, newOrder);
    }
    BrOfferBannersAdd = (msg, newBanner) => {
        this.eventRecieved('BrOfferBannersAdd', msg, newBanner);
        SocketMutations.banner.updateBanner();
    }
    BrOfferBannersUpdate = (msg, updatedBanner) => {
        this.eventRecieved('BrOfferBannersUpdate', msg, updatedBanner);
        SocketMutations.banner.updateBanner();
    }

    BrOfferBannersStatus = (msg, bannerStatus) => {
        this.eventRecieved('BrOfferBannersStatus', msg, bannerStatus);
        SocketMutations.banner.updateBanner();
    }

    BrOfferBannersDelete = (msg, bannerDelete) => {
        this.eventRecieved('BrOfferBannersDelete', msg, bannerDelete);
        SocketMutations.banner.updateBanner();
    }
}
export default BRHubHandler;