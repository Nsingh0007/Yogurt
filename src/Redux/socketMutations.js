import {categoryRequestSuccess} from './category';
import selectors from './selectors';
import Store from './store';
import {
    updateFlavorTree,
    updateToppingTree
} from './products';    
class CategoryMutations {
    selectors;
    constructor(selectors) {
        this.selectors = selectors;
    }
    setCategoryData = (newCategoryData) => { 
        return Store.dispatch(categoryRequestSuccess(newCategoryData));
    }
    onCategoryUpdate = (updatedCategoyData) => {
        let updateCategoryId = updatedCategoyData.CategoryId;
        let previousCategoryData = this.selectors.getCategoryData();
        let nextCategoryData = previousCategoryData.map((pCategory) => {
            if(pCategory.CategoryId != updateCategoryId) {
                return { ...pCategory };
            }
            return {
                ...pCategory,
                ...updatedCategoyData
            }
        });
        this.setCategoryData(nextCategoryData);
    }
    newCategoryAdd = (newCategoryData) => {
        let nextCategory = this.selectors.getCategoryData();
        nextCategory.push(newCategoryData);
        this.setCategoryData(nextCategory);
    }
    onCategoryDelete = (newCategoryData) => {
        let previousCategory = this.selectors.getCategoryData();
        let nextCategory = previousCategory.filter(i => i.CategoryId != newCategoryData.CategoryId);
        this.setCategoryData(nextCategory);
    }

}

class FlavorMutations {
    selectors;
    constructor(selectors){
        this.selectors = selectors;
    }
    setFlavor = (nextFlavor) => { 
        return Store.dispatch(updateFlavorTree(nextFlavor));
    }
    onFlavorUpdate = (updatedFlavor) => {
        let previousFlavour = this.selectors.getFlavourData();
        let nextFlavour = previousFlavour.map((pF) => {
            if (pF.FlavorId != updatedFlavor.FlavorId) {
                return {...pF};
            }
            return {
                ...pF,
                ...updatedFlavor
            }
        });
        this.setFlavor(nextFlavour);
    }
    onNewFlavorAdd = (newFlavor) => {
        let nextFlavor = this.selectors.getFlavourData();
        nextFlavor.push(newFlavor);
        this.setFlavor(nextFlavor);
    }
    onFlavorDelete = (deletedFlavor) => {
        let deletedFlavorId = deletedFlavor.FlavorId;
        console.log("FLAVOR_DELETE_SOCKET - ", deletedFlavorId);
        let previousFlavor = this.selectors.getFlavourData();
        let nextFlavor = previousFlavor.filter(f => f.FlavorId != deletedFlavorId);
        return this.setFlavor(nextFlavor);
    }
} 

class SubCategoryMutations {
    selectors;
    constructor(selectors){
        this.selectors = selectors;
    }
    setCategoryData = (newCategoryData) => { 
        return Store.dispatch(categoryRequestSuccess(newCategoryData));
    }
    onSubCategoryUpdate = (updatedSubCategory) => {
        console.log('UPDATE_CAT_SO - ', updatedSubCategory);
        let previousCategory = this.selectors.getCategoryData();
        let nextCategory = previousCategory.map((category) => {
            if(updatedSubCategory.CategoryId != category.CategoryId) {
                return {...category};
            }
            let newSubCategoryInfolst = category.SubCategoryInfolst.map((subCategory)=>{
                if(subCategory.SubCategoryId != updatedSubCategory.SubCategoryInfolst[0].SubCategoryId) {
                    return { ...subCategory };
                } 
                return {
                    ...subCategory,
                    ...updatedSubCategory.SubCategoryInfolst[0]
                }  
            });
            return {
                ...category,
                SubCategoryInfolst: newSubCategoryInfolst
            }
        });
        this.setCategoryData(nextCategory);
    }
}
class SocketMutations {

    selectors;
    category;
    subCategory;
    flavor;
    constructor() {
        this.selectors = selectors;
        this.category = new CategoryMutations(this.selectors);
        this.subCategory = new SubCategoryMutations(this.selectors);
        this.flavor = new FlavorMutations(this.selectors);
    }
    
}

export default new SocketMutations();