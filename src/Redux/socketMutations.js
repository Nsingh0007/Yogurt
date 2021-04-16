import {categoryRequestSuccess} from './category';
import selectors from './selectors';
import Store from './store';

class SocketMutations {

    selectors
    constructor() {
        this.selectors = selectors;
    }
    setCategoryData = (newCategoryData) => {
        console.log("NEW_CAT_UPDATED - ", JSON.stringify(newCategoryData));
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

export default new SocketMutations();