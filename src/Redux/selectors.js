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
    getToppingdata = () => {
        return [...this.store.getState().productstore.toppingsData];
    }
    getFeaturedData = () => {
        return [
            ...this.store.getState().featureStore.features
        ]
    }
}

export default new Selectors();