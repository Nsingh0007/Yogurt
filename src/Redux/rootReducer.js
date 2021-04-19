import {combineReducers} from 'redux';
import UserReducer from './user';
import CategoryReducer from './category';
import ProductReducer from './products';
import MessageReducer from './inbox';
import {SixPackReducer} from './sixPack';
import {getCartReducer} from './getcart';
import {getOrderReducer} from './previousOrder';
import FeatureStore from './featured';
import BannerStore from './offerbanner';

export default combineReducers({
  userstore: UserReducer,
  productstore: ProductReducer,
  categoryStore: CategoryReducer,
  messageStore: MessageReducer,
  sixPackStore: SixPackReducer,
  getCartStore: getCartReducer,
  getOrderStore: getOrderReducer,
  featureStore: FeatureStore.featureReducer,
  bannerStore: BannerStore.bannerReducer
});
