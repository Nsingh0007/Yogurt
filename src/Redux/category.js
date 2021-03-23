import {GetItemPrice, GetCategory} from '@api';

import {initialSelectedProductData} from './products';
const FETCH_CATEGORY_REQUEST = 'FETCH_CATEGORY_REQUEST';
const FETCH_CATEGORY_SUCCESS = 'FETCH_CATEGORY_SUCCESS';
const FETCH_CATEGORY_ERROR = 'FETCH_CATEGORY_ERROR';
const CATEGORY_COLLAPSE_PROCESS = 'CATEGORY_COLLAPSE_PROCESS';
const SET_CURRENT_CATEGORY = 'SET_CURRENT_CATEGORY';

const CategoryIntialState = {
  loader: true,
  categoryData: [],
  error: false,

  selectedCategory: {},
};

const categoryRequestProcess = () => {
  return {
    type: FETCH_CATEGORY_REQUEST,
  };
};

const categoryRequestFail = () => {
  return {
    type: FETCH_CATEGORY_ERROR,
  };
};

const categoryRequestSuccess = (payload) => {
  return {
    type: FETCH_CATEGORY_SUCCESS,
    payload,
  };
};
const categoryCollapseProcess = (id) => {
  return {
    type: CATEGORY_COLLAPSE_PROCESS,
    payload: id,
  };
};
const categoryReducer = (intialState = CategoryIntialState, action) => {
  const {type} = action;
  switch (type) {
    case FETCH_CATEGORY_REQUEST:
      return {
        categoryData: [],
        loader: true,
        error: false,
      };
    case FETCH_CATEGORY_ERROR:
      return {
        categoryData: [],
        loader: false,
        error: true,
      };
    case FETCH_CATEGORY_SUCCESS:
      return {
        categoryData: action.payload,
        loader: false,
        error: false,
      };
    case CATEGORY_COLLAPSE_PROCESS:
      let updatedCategory = intialState.categoryData.map((singleCategory) => {
        if (singleCategory.CategoryId === action.payload) {
          return {...singleCategory, collapse: !singleCategory.collapse};
        } else {
          return {...singleCategory, collapse: true};
        }
      });
      return {
        ...intialState,
        categoryData: updatedCategory,
      };
    case SET_CURRENT_CATEGORY:
      return {
        ...intialState,
        selectedCategory: action.payload,
      };
    default:
      return intialState;
  }
};

export const getCategoryData = () => async (dispatch) => {
  dispatch(categoryRequestProcess());

  const categoryDetails = await GetCategory();
  const priceDetails = await GetItemPrice();
  if (categoryDetails.result && priceDetails.result) {
    let updatedResponse = categoryDetails.response.map((singleResponse) => {
      let categoryPrice = priceDetails.response.find(
        (singlePrice) => singlePrice.CategoryId === singleResponse.CategoryId,
      ); 
      return {
        ...singleResponse,
        priceDetails: categoryPrice != undefined ? categoryPrice.FlavorTypeInfolst : [],
        collapse: true,
      };
    });
    dispatch(initialSelectedProductData(updatedResponse));
    dispatch(categoryRequestSuccess(updatedResponse));
  } else {
    dispatch(categoryRequestFail());
  }
};

export const handleCollapse = (id) => (dispatch) => {
  dispatch(categoryCollapseProcess(id));
};

export const setCurrentSelectedCategory = (categoryData) => {
  console.log('here - ', categoryData);
  return {
    type: SET_CURRENT_CATEGORY,
    payload: categoryData,
  };
};
export default categoryReducer;