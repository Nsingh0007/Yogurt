
class EventsList {

    broadcast = 'broadcast';
    
    Category = {
        BrCategoryAdd: 'BrCategoryAdd',
        BrCategoryUpdate: 'BrCategoryUpdate',
        BrCategoryStatus: 'BrCategoryStatus',
        BrCategoryDelete: 'BrCategoryDelete'
    }

    SubCategory = {
        BrSubCategoryAdd: 'BrSubCategoryAdd',
        BrSubCategoryUpdate: 'BrSubCategoryUpdate',
        BrSubCategoryStatus: 'BrSubCategoryStatus',
        BrSubCategoryDelete: 'BrSubCategoryDelete'
    }

    Flavor = {
        BrFlavorAdd: 'BrFlavorAdd',
        BrFlavorUpdate: 'BrFlavorUpdate',
        BrFlavorStatus: 'BrFlavorStatus',
        BrFlavorDelete: 'BrFlavorDelete'
    }

    Topping = {
        BrToppingAdd: 'BrToppingAdd',
        BrToppingUpdate: 'BrToppingUpdate',
        BrToppingStatus: 'BrToppingStatus',
        BrToppingDelete: 'BrToppingDelete'
    }

    Feature = {
        BrFeatureAdd: 'BrFeatureAdd',
        BrFeatureUpdate: 'BrFeatureUpdate',
        BrFeatureStatus: 'BrFeatureStatus',
        BrFeatureDelete: 'BrFeatureDelete'
    }
}

export default new EventsList();