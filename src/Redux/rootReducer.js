import {combineReducers} from 'redux';
import UserReducer from './user';
import CategoryReducer from './category';
import ProductReducer from './products';
import MessageReducer from './inbox';
import {SixPackReducer} from './sixPack';
import {getCartReducer} from './getcart';
import orderReducer from './order';
import FeatureStore from './featured';
import bannerReducer from './offerbanner';

export default combineReducers({
  userstore: UserReducer,
  productstore: ProductReducer,
  categoryStore: CategoryReducer,
  messageStore: MessageReducer,
  sixPackStore: SixPackReducer,
  getCartStore: getCartReducer,
  orderStore: orderReducer,
  featureStore: FeatureStore.featureReducer,
  bannerStore: bannerReducer,
});
