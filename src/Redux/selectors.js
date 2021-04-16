import Store from './store';

class Selectors {
    store;
    constructor() {
        this.store = Store;
    }
    getCategoryData = () => {
        return [...this.store.getState().categoryStore.categoryData];
    }
    getFlavourData = () => {
        return [...this.store.getState().productstore.flavorData];
    }
}

export default new Selectors();