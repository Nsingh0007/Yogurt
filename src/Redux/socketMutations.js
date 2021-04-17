import { categoryRequestSuccess } from './category';
import selectors from './selectors';
import Store from './store';
import {
    updateFlavorTree,
    updateToppingTree
} from './products';
import FeaturedStore from './featured';

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
            if (pCategory.CategoryId != updateCategoryId) {
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
    constructor(selectors) {
        this.selectors = selectors;
    }
    setFlavor = (nextFlavor) => {
        return Store.dispatch(updateFlavorTree(nextFlavor));
    }
    onFlavorUpdate = (updatedFlavor) => {
        let previousFlavour = this.selectors.getFlavourData();
        let nextFlavour = previousFlavour.map((pF) => {
            if (pF.FlavorId != updatedFlavor.FlavorId) {
                return { ...pF };
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

class ToppingMutations {
    selectors;
    constructor(selectors) {
        this.selectors = selectors;
    }
    setTopping = (nextTopping) => {
        return Store.dispatch(updateToppingTree(nextTopping));
    }
    onToppingUpdate = (updatedTopping) => {
        let previousTopping = this.selectors.getToppingdata();
        let nextTopping = previousTopping.map((tP) => {
            if (tP.ToppingId != updatedTopping.ToppingId) {
                return { ...tP };
            }
            return {
                ...tP,
                ...updatedTopping
            }
        });
        this.setTopping(nextTopping);
    }
    onNewFlavorAdd = (newFlavor) => {
        let nextFlavor = this.selectors.getFlavourData();
        nextFlavor.push(newFlavor);
        this.setFlavor(nextFlavor);
    }
    onToppingDelete = (deletedTopping) => {
        let deletedToppingId = deletedTopping.ToppingId;
        console.log("TOPPING_DELETE_SOCKET - ", deletedToppingId);
        let previousTopping = this.selectors.getToppingdata();
        let nextTopping = previousTopping.filter(t => t.ToppingId != deletedToppingId);
        return this.setTopping(nextTopping);
    }
}
class SubCategoryMutations {
    selectors;
    constructor(selectors) {
        this.selectors = selectors;
    }
    setCategoryData = (newCategoryData) => {
        return Store.dispatch(categoryRequestSuccess(newCategoryData));
    }
    onSubCategoryUpdate = (updatedSubCategory) => {
        //console.log('UPDATE_CAT_SO - ', updatedSubCategory);
        let previousCategory = this.selectors.getCategoryData();
        let nextCategory = previousCategory.map((category) => {
            if (updatedSubCategory.CategoryId != category.CategoryId) {
                return { ...category };
            }
            let newSubCategoryInfolst = category.SubCategoryInfolst.map((subCategory) => {
                if (subCategory.SubCategoryId != updatedSubCategory.SubCategoryInfolst[0].SubCategoryId) {
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
    onSubCategoryDelete = (updatedSubCategory) => {
        //console.log('UPDATE_CAT_SO - ', updatedSubCategory);
        let previousCategory = this.selectors.getCategoryData();
        let nextCategory = [];
        previousCategory.filter((category) => {
            if (updatedSubCategory.CategoryId != category.CategoryId) {
                nextCategory.push({ ...category });
                return
            }
            let newSubCategoryInfolst = category.SubCategoryInfolst.filter((subCategory) => {
                if (subCategory.SubCategoryId != updatedSubCategory.SubCategoryInfolst[0].SubCategoryId) {
                    return true;
                }
                return false;
            });
            return nextCategory.push({
                ...category,
                SubCategoryInfolst: newSubCategoryInfolst
            });
        });
        this.setCategoryData(nextCategory);
    }
    onSubCategoryAdd = (newSubCategory) => {
        let nextCategory = this.selectors.getCategoryData();
        let catIndex = nextCategory.findIndex(cat => cat.CategoryId == newSubCategory.CategoryId);
        nextCategory[catIndex].SubCategoryInfolst.push(newSubCategory);
        this.setCategoryData(nextCategory);
    }
}

class FeaturedMutations {
    selectors;
    constructor(selectors) {
        this.selectors = selectors;
    }
    setFeature = (nextFeatured) => {
        return Store.dispatch(FeaturedStore.actionFetchFeatureSuccess(nextFeatured));
    }
    onFeatureUpdate = (updatedFeatured) => {
        return Store.dispatch(FeaturedStore.fetchFeaturesRequest());
        let previousFeature = this.selectors.getFeaturedData();
        let nextFeature = [...previousFeature];
        let updateIndex = previousFeature.findIndex(pF => pF.FeatureId == updatedFeatured.FeatureId);
        if (updateIndex > -1) {
            nextFeature[updateIndex] = {
                ...nextFeature[updateIndex],
                ...updatedFeatured
            }
        } else {
            nextFeature.push(updatedFeatured);
        }
        return this.setFeature(nextFeature);

    }
    onFeatureAdd = (newFeature) => {
        return Store.dispatch(FeaturedStore.fetchFeaturesRequest());
        let nextFeatured = this.selectors.getFeaturedData();
        nextFeatured.push(newFeature);
        return this.setFeature(nextFeatured);
    }
    onFeaturedDelete = (deletedFeature) => {
        return Store.dispatch(FeaturedStore.fetchFeaturesRequest());
        let previousFeatured = this.selectors.getFeaturedData();
        let nextFeatured = previousFeatured.filter((featured) => {
            return featured.FeatureId != deletedFeature.FeatureId;
        });
        return this.setFeature(nextFeatured);
    }
}
class SocketMutations {

    selectors;
    category;
    subCategory;
    flavor;
    topping;
    constructor() {
        this.selectors = selectors;
        this.category = new CategoryMutations(this.selectors);
        this.subCategory = new SubCategoryMutations(this.selectors);
        this.flavor = new FlavorMutations(this.selectors);
        this.topping = new ToppingMutations(this.selectors);
        this.featured = new FeaturedMutations(this.selectors);
    }

}

export default new SocketMutations();