import Store from './store';

class Selectors {
    store;
    constructor() {
        this.store = Store;
    }
    getCategoryData = () => {
        return [...this.store.getState().categoryStore.categoryData];
    }
}

export default new Selectors();