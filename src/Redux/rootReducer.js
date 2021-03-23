import { combineReducers } from "redux";
import UserReducer from "./user";
import CategoryReducer from "./category";
import ProductReducer from "./products";
import MessageReducer from "./inbox";
import { SixPackReducer } from "./sixPack";
import { getCartReducer } from './getcart';
export default combineReducers({
  userstore: UserReducer,
  productstore: ProductReducer,
  categoryStore: CategoryReducer,
  messageStore: MessageReducer,
  sixPackStore: SixPackReducer,
  getCartStore: getCartReducer
});
