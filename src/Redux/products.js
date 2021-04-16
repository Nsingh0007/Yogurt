import { GetFlavors, GetToppings } from "@api";
import { initSixPack } from "./sixPack";

const FETCH_PRODUCT_REQUEST = "FETCH_PRODUCT_REQUEST";
const FETCH_PRODUCT_SUCCESS = "FETCH_PRODUCT_SUCCESS";
const FETCH_PRODUCT_ERROR = "FETCH_PRODUCT_ERROR";

const MUTATE_FLAVORS = "MUTATE_FLAVORS";

const MUTATE_TOP_FlOVORS = "MUTATE_TOP_FlOVORS";
const MUTATE_BOTTOM_FlOVORS = "MUTATE_BOTTOM_FlOVORS";
const MUTATE_MIDDLE_FlOVORS = "MUTATE_MIDDLE_FlOVORS";

const MUTATE_TOPPINGS = "MUTATE_TOPPINGS";
const MUTATE_TOP_TOPINGS = "MUTATE_TOP_TOPINGS";
const MUTATE_BOTTOM_TOPINGS = "MUTATE_BOTTOM_TOPINGS";
const MUTATE_MIDDLE_TOPINGS = "MUTATE_MIDDLE_TOPINGS";
const MUTATE_SIDE_TOPINGS = "MUTATE_SIDE_TOPINGS";
const READY_SELECTED_PRODUCT_DATA = "READY_SELECTED_PRODUCT_DATA";
const RESET_PRODUCT_RECIEPE = "RESET_PRODUCT_RECIEPE";

const UPDATE_FLAVOR = "UPDATE_FLAVOR";
const UPDATE_TOPPING = "UPDATE_TOPPING";
const intialState = {
  loader: false,
  flavorData: [],
  toppingsData: [],
  error: false,

  selectedProductData: [],
};

const fetchProductRequest = () => {
  return {
    type: FETCH_PRODUCT_REQUEST,
  };
};

const fetchProductSuccess = (flavorData, toppingsData) => {
  return {
    type: FETCH_PRODUCT_SUCCESS,
    flavorData,
    toppingsData,
  };
};
const fetchProductError = () => {
  return {
    type: FETCH_PRODUCT_ERROR,
  };
};

export const resetProductReciepe = (selectedProductData) => {
  return {
    type: RESET_PRODUCT_RECIEPE,
    data: {
      selectedProductData,
    },
  };
};
const productReducer = (state = intialState, action) => {
  switch (action.type) {
    case UPDATE_FLAVOR:
      return { ...state, flavorData: action.payload }
    case UPDATE_TOPPING:
      return { ...state, toppingsData: action.payload }
    case "MUTATE_PRODUCTSTORE_ROOT":
      return { ...state, ...action.payload };
    case "CUPAUTOPOPULATE":
      return { ...state, ...action.data };
    case RESET_PRODUCT_RECIEPE:
      return { ...state, ...action.data };
    case FETCH_PRODUCT_REQUEST:
      return {
        ...state,
        loader: true,
        error: false,
        selectedFlavor: [],
      };
    case FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        flavorData: action.flavorData,
        toppingsData: action.toppingsData,
        loader: false,
      };
    case FETCH_PRODUCT_ERROR:
      return {
        ...state,
        loader: false,
        error: true,
      };
    case READY_SELECTED_PRODUCT_DATA:
      return {
        ...state,
        selectedProductData: action.payload,
      };

    case MUTATE_FLAVORS:
      let whichCatUpdate = state.selectedProductData;
      if (action.currentSelectedCategory.isSubCategory) {
        whichCatUpdate = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              let updatedSubCategoryDataInner = singleSelectedProduct.subCategoryData.map(
                (singleSubCatMap) => {
                  if (
                    singleSubCatMap.SubCategoryId ==
                    action.currentSelectedCategory.subCategory.SubCategoryId
                  ) {
                    if (action.actionType === "ADD") {
                      return {
                        ...singleSubCatMap,
                        flavours: [
                          ...singleSubCatMap.flavours,
                          action.productData,
                        ],
                      };
                    } else {
                      let updatedFlavours = singleSubCatMap.flavours.filter(
                        (singleFilter) => {
                          return (
                            singleFilter.FlavorId !==
                            action.productData.FlavorId
                          );
                        }
                      );
                      return {
                        ...singleSubCatMap,
                        flavours: updatedFlavours,
                      };
                    }
                  } else {
                    return singleSubCatMap;
                  }
                }
              );

              return {
                ...singleSelectedProduct,
                subCategoryData: updatedSubCategoryDataInner,
              };
            } else {
              return singleSelectedProduct;
            }
          }
        );
      } else {
        whichCatUpdate = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              if (action.actionType === "ADD") {
                return {
                  ...singleSelectedProduct,
                  flavours: [
                    ...singleSelectedProduct.flavours,
                    action.productData,
                  ],
                };
              } else {
                let updatedFlavours = singleSelectedProduct.flavours.filter(
                  (singleFilter) => {
                    return (
                      singleFilter.FlavorId !== action.productData.FlavorId
                    );
                  }
                );
                return {
                  ...singleSelectedProduct,
                  flavours: updatedFlavours,
                };
              }
            } else {
              return singleSelectedProduct;
            }
          }
        );
      }
      return {
        ...state,
        selectedProductData: whichCatUpdate,
      };

    case MUTATE_BOTTOM_FlOVORS:
      let mutateBottomFlavor = state.selectedProductData;
      if (action.currentSelectedCategory.isSubCategory) {
        mutateBottomFlavor = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              let updatedSubCategoryDataInner = singleSelectedProduct.subCategoryData.map(
                (singleSubCatMap) => {
                  if (
                    singleSubCatMap.SubCategoryId ==
                    action.currentSelectedCategory.subCategory.SubCategoryId
                  ) {
                    if (action.actionType === "ADD") {
                      return {
                        ...singleSubCatMap,
                        bottomflavours: [
                          ...singleSubCatMap.bottomflavours,
                          action.productData,
                        ],
                      };
                    } else {
                      let updatedbottomflavours = singleSubCatMap.bottomflavours.filter(
                        (singleFilter) => {
                          return (
                            singleFilter.FlavorId !==
                            action.productData.FlavorId
                          );
                        }
                      );
                      return {
                        ...singleSubCatMap,
                        bottomflavours: updatedbottomflavours,
                      };
                    }
                  } else {
                    return singleSubCatMap;
                  }
                }
              );

              return {
                ...singleSelectedProduct,
                subCategoryData: updatedSubCategoryDataInner,
              };
            } else {
              return singleSelectedProduct;
            }
          }
        );
      } else {
        mutateBottomFlavor = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              if (action.actionType === "ADD") {
                return {
                  ...singleSelectedProduct,
                  bottomflavours: [
                    ...singleSelectedProduct.bottomflavours,
                    action.productData,
                  ],
                };
              } else {
                let updatedbottomflavours = singleSelectedProduct.bottomflavours.filter(
                  (singleFilter) => {
                    return (
                      singleFilter.FlavorId !== action.productData.FlavorId
                    );
                  }
                );
                return {
                  ...singleSelectedProduct,
                  bottomflavours: updatedbottomflavours,
                };
              }
            } else {
              return singleSelectedProduct;
            }
          }
        );
      }
      return {
        ...state,
        selectedProductData: mutateBottomFlavor,
      };

    case MUTATE_MIDDLE_FlOVORS:
      let mutateMiddleFlavor = state.selectedProductData;
      if (action.currentSelectedCategory.isSubCategory) {
        mutateMiddleFlavor = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              let updatedSubCategoryDataInner = singleSelectedProduct.subCategoryData.map(
                (singleSubCatMap) => {
                  if (
                    singleSubCatMap.SubCategoryId ==
                    action.currentSelectedCategory.subCategory.SubCategoryId
                  ) {
                    if (action.actionType === "ADD") {
                      return {
                        ...singleSubCatMap,
                        middleflavours: [
                          ...singleSubCatMap.middleflavours,
                          action.productData,
                        ],
                      };
                    } else {
                      let updatedmiddleflavours = singleSubCatMap.middleflavours.filter(
                        (singleFilter) => {
                          return (
                            singleFilter.FlavorId !==
                            action.productData.FlavorId
                          );
                        }
                      );
                      return {
                        ...singleSubCatMap,
                        middleflavours: updatedmiddleflavours,
                      };
                    }
                  } else {
                    return singleSubCatMap;
                  }
                }
              );

              return {
                ...singleSelectedProduct,
                subCategoryData: updatedSubCategoryDataInner,
              };
            } else {
              return singleSelectedProduct;
            }
          }
        );
      } else {
        mutateMiddleFlavor = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              if (action.actionType === "ADD") {
                return {
                  ...singleSelectedProduct,
                  middleflavours: [
                    ...singleSelectedProduct.middleflavours,
                    action.productData,
                  ],
                };
              } else {
                let updatedmiddleflavours = singleSelectedProduct.middleflavours.filter(
                  (singleFilter) => {
                    return (
                      singleFilter.FlavorId !== action.productData.FlavorId
                    );
                  }
                );
                return {
                  ...singleSelectedProduct,
                  middleflavours: updatedmiddleflavours,
                };
              }
            } else {
              return singleSelectedProduct;
            }
          }
        );
      }
      return {
        ...state,
        selectedProductData: mutateMiddleFlavor,
      };

    case MUTATE_TOP_FlOVORS:
      let mutateTopFlavor = state.selectedProductData;
      if (action.currentSelectedCategory.isSubCategory) {
        mutateTopFlavor = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              let updatedSubCategoryDataInner = singleSelectedProduct.subCategoryData.map(
                (singleSubCatMap) => {
                  if (
                    singleSubCatMap.SubCategoryId ==
                    action.currentSelectedCategory.subCategory.SubCategoryId
                  ) {
                    if (action.actionType === "ADD") {
                      return {
                        ...singleSubCatMap,
                        topflavours: [
                          ...singleSubCatMap.topflavours,
                          action.productData,
                        ],
                      };
                    } else {
                      let updatedtopflavours = singleSubCatMap.topflavours.filter(
                        (singleFilter) => {
                          return (
                            singleFilter.FlavorId !==
                            action.productData.FlavorId
                          );
                        }
                      );
                      return {
                        ...singleSubCatMap,
                        topflavours: updatedtopflavours,
                      };
                    }
                  } else {
                    return singleSubCatMap;
                  }
                }
              );

              return {
                ...singleSelectedProduct,
                subCategoryData: updatedSubCategoryDataInner,
              };
            } else {
              return singleSelectedProduct;
            }
          }
        );
      } else {
        mutateTopFlavor = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              if (action.actionType === "ADD") {
                return {
                  ...singleSelectedProduct,
                  topflavours: [
                    ...singleSelectedProduct.topflavours,
                    action.productData,
                  ],
                };
              } else {
                let updatedtopflavours = singleSelectedProduct.topflavours.filter(
                  (singleFilter) => {
                    return (
                      singleFilter.FlavorId !== action.productData.FlavorId
                    );
                  }
                );
                return {
                  ...singleSelectedProduct,
                  topflavours: updatedtopflavours,
                };
              }
            } else {
              return singleSelectedProduct;
            }
          }
        );
      }
      return {
        ...state,
        selectedProductData: mutateTopFlavor,
      };

    case MUTATE_TOPPINGS:
      let mutateToppings = state.selectedProductData;
      if (action.currentSelectedCategory.isSubCategory) {
        mutateToppings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              let updatedSubCategoryDataInner = singleSelectedProduct.subCategoryData.map(
                (singleSubCatMap) => {
                  if (
                    singleSubCatMap.SubCategoryId ==
                    action.currentSelectedCategory.subCategory.SubCategoryId
                  ) {
                    if (action.actionType === "ADD") {
                      return {
                        ...singleSubCatMap,
                        toppings: [
                          ...singleSubCatMap.toppings,
                          action.productData,
                        ],
                      };
                    } else {
                      let updateSingleToppings = singleSubCatMap.toppings.filter(
                        (singleFilter) => {
                          return (
                            singleFilter.ToppingId !==
                            action.productData.ToppingId
                          );
                        }
                      );
                      return {
                        ...singleSubCatMap,
                        toppings: updateSingleToppings,
                      };
                    }
                  } else {
                    return singleSubCatMap;
                  }
                }
              );

              return {
                ...singleSelectedProduct,
                subCategoryData: updatedSubCategoryDataInner,
              };
            } else {
              return singleSelectedProduct;
            }
          }
        );
      } else {
        mutateToppings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              if (action.actionType === "ADD") {
                return {
                  ...singleSelectedProduct,
                  toppings: [
                    ...singleSelectedProduct.toppings,
                    action.productData,
                  ],
                };
              } else {
                let updatedToppingsData = singleSelectedProduct.toppings.filter(
                  (singleFilter) => {
                    return (
                      singleFilter.ToppingId !== action.productData.ToppingId
                    );
                  }
                );
                return {
                  ...singleSelectedProduct,
                  toppings: updatedToppingsData,
                };
              }
            } else {
              return singleSelectedProduct;
            }
          }
        );
      }
      return {
        ...state,
        selectedProductData: mutateToppings,
      };

    case MUTATE_TOP_TOPINGS:
      let mutateTopTopings = state.selectedProductData;
      if (action.currentSelectedCategory.isSubCategory) {
        mutateTopTopings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              let updatedSubCategoryDataInner = singleSelectedProduct.subCategoryData.map(
                (singleSubCatMap) => {
                  if (
                    singleSubCatMap.SubCategoryId ==
                    action.currentSelectedCategory.subCategory.SubCategoryId
                  ) {
                    if (action.actionType === "ADD") {
                      return {
                        ...singleSubCatMap,
                        topTopping: [
                          ...singleSubCatMap.topTopping,
                          action.productData,
                        ],
                      };
                    } else {
                      let updatedToppings = singleSubCatMap.topTopping.filter(
                        (singleFilter) => {
                          return (
                            singleFilter.ToppingId !==
                            action.productData.ToppingId
                          );
                        }
                      );
                      return {
                        ...singleSubCatMap,
                        topTopping: updatedToppings,
                      };
                    }
                  } else {
                    return singleSubCatMap;
                  }
                }
              );

              return {
                ...singleSelectedProduct,
                subCategoryData: updatedSubCategoryDataInner,
              };
            } else {
              return singleSelectedProduct;
            }
          }
        );
      } else {
        mutateTopTopings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              if (action.actionType === "ADD") {
                return {
                  ...singleSelectedProduct,
                  topTopping: [
                    ...singleSelectedProduct.topTopping,
                    action.productData,
                  ],
                };
              } else {
                let updatedToppingsData = singleSelectedProduct.topTopping.filter(
                  (singleFilter) => {
                    return (
                      singleFilter.ToppingId !== action.productData.ToppingId
                    );
                  }
                );
                return {
                  ...singleSelectedProduct,
                  topTopping: updatedToppingsData,
                };
              }
            } else {
              return singleSelectedProduct;
            }
          }
        );
      }
      return {
        ...state,
        selectedProductData: mutateTopTopings,
      };
    case MUTATE_BOTTOM_TOPINGS:
      let mutateBottomToppings = state.selectedProductData;
      if (action.currentSelectedCategory.isSubCategory) {
        mutateBottomToppings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              let updatedSubCategoryDataInner = singleSelectedProduct.subCategoryData.map(
                (singleSubCatMap) => {
                  if (
                    singleSubCatMap.SubCategoryId ==
                    action.currentSelectedCategory.subCategory.SubCategoryId
                  ) {
                    if (action.actionType === "ADD") {
                      return {
                        ...singleSubCatMap,
                        bottomTopping: [
                          ...singleSubCatMap.bottomTopping,
                          action.productData,
                        ],
                      };
                    } else {
                      let updateToppings = singleSubCatMap.bottomTopping.filter(
                        (singleFilter) => {
                          return (
                            singleFilter.ToppingId !==
                            action.productData.ToppingId
                          );
                        }
                      );
                      return {
                        ...singleSubCatMap,
                        bottomTopping: updateToppings,
                      };
                    }
                  } else {
                    return singleSubCatMap;
                  }
                }
              );

              return {
                ...singleSelectedProduct,
                subCategoryData: updatedSubCategoryDataInner,
              };
            } else {
              return singleSelectedProduct;
            }
          }
        );
      } else {
        mutateBottomToppings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              if (action.actionType === "ADD") {
                return {
                  ...singleSelectedProduct,
                  bottomTopping: [
                    ...singleSelectedProduct.bottomTopping,
                    action.productData,
                  ],
                };
              } else {
                let updatedToppingsData = singleSelectedProduct.bottomTopping.filter(
                  (singleFilter) => {
                    return (
                      singleFilter.ToppingId !== action.productData.ToppingId
                    );
                  }
                );
                return {
                  ...singleSelectedProduct,
                  bottomTopping: updatedToppingsData,
                };
              }
            } else {
              return singleSelectedProduct;
            }
          }
        );
      }
      return {
        ...state,
        selectedProductData: mutateBottomToppings,
      };
    case MUTATE_MIDDLE_TOPINGS:
      let mutateMiddleToppings = state.selectedProductData;
      if (action.currentSelectedCategory.isSubCategory) {
        mutateMiddleToppings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              let updatedSubCategoryDataInner = singleSelectedProduct.subCategoryData.map(
                (singleSubCatMap) => {
                  if (
                    singleSubCatMap.SubCategoryId ==
                    action.currentSelectedCategory.subCategory.SubCategoryId
                  ) {
                    if (action.actionType === "ADD") {
                      return {
                        ...singleSubCatMap,
                        middleTopping: [
                          ...singleSubCatMap.middleTopping,
                          action.productData,
                        ],
                      };
                    } else {
                      let updateMiddleToppings = singleSubCatMap.middleTopping.filter(
                        (singleFilter) => {
                          return (
                            singleFilter.ToppingId !==
                            action.productData.ToppingId
                          );
                        }
                      );
                      return {
                        ...singleSubCatMap,
                        middleTopping: updateMiddleToppings,
                      };
                    }
                  } else {
                    return singleSubCatMap;
                  }
                }
              );

              return {
                ...singleSelectedProduct,
                subCategoryData: updatedSubCategoryDataInner,
              };
            } else {
              return singleSelectedProduct;
            }
          }
        );
      } else {
        mutateMiddleToppings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              if (action.actionType === "ADD") {
                return {
                  ...singleSelectedProduct,
                  middleTopping: [
                    ...singleSelectedProduct.middleTopping,
                    action.productData,
                  ],
                };
              } else {
                let updatedToppingsData = singleSelectedProduct.middleTopping.filter(
                  (singleFilter) => {
                    return (
                      singleFilter.ToppingId !== action.productData.ToppingId
                    );
                  }
                );
                return {
                  ...singleSelectedProduct,
                  middleTopping: updatedToppingsData,
                };
              }
            } else {
              return singleSelectedProduct;
            }
          }
        );
      }
      return {
        ...state,
        selectedProductData: mutateMiddleToppings,
      };
    case MUTATE_SIDE_TOPINGS:
      let mutateSideToppings = state.selectedProductData;
      if (action.currentSelectedCategory.isSubCategory) {
        mutateSideToppings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              let updatedSubCategoryDataInner = singleSelectedProduct.subCategoryData.map(
                (singleSubCatMap) => {
                  if (
                    singleSubCatMap.SubCategoryId ==
                    action.currentSelectedCategory.subCategory.SubCategoryId
                  ) {
                    if (action.actionType === "ADD") {
                      return {
                        ...singleSubCatMap,
                        sideTopping: [
                          ...singleSubCatMap.sideTopping,
                          action.productData,
                        ],
                      };
                    } else {
                      let updateMiddleToppings = singleSubCatMap.sideTopping.filter(
                        (singleFilter) => {
                          return (
                            singleFilter.ToppingId !==
                            action.productData.ToppingId
                          );
                        }
                      );
                      return {
                        ...singleSubCatMap,
                        sideTopping: updateMiddleToppings,
                      };
                    }
                  } else {
                    return singleSubCatMap;
                  }
                }
              );

              return {
                ...singleSelectedProduct,
                subCategoryData: updatedSubCategoryDataInner,
              };
            } else {
              return singleSelectedProduct;
            }
          }
        );
      } else {
        mutateSideToppings = state.selectedProductData.map(
          (singleSelectedProduct) => {
            if (
              singleSelectedProduct.CategoryId ===
              action.currentSelectedCategory.category.CategoryId
            ) {
              if (action.actionType === "ADD") {
                return {
                  ...singleSelectedProduct,
                  sideTopping: [
                    ...singleSelectedProduct.sideTopping,
                    action.productData,
                  ],
                };
              } else {
                let updatedToppingsData = singleSelectedProduct.sideTopping.filter(
                  (singleFilter) => {
                    return (
                      singleFilter.ToppingId !== action.productData.ToppingId
                    );
                  }
                );
                return {
                  ...singleSelectedProduct,
                  sideTopping: updatedToppingsData,
                };
              }
            } else {
              return singleSelectedProduct;
            }
          }
        );
      }
      return {
        ...state,
        selectedProductData: mutateSideToppings,
      };
    default:
      return state;
  }
};

export const readyProduct = () => async (dispatch) => {
  try {
    dispatch(fetchProductRequest());
    const flavorRes = await GetFlavors();
    const toppingsRes = await GetToppings();
    dispatch(fetchProductSuccess(flavorRes.response, toppingsRes.response));
  } catch (error) {
    console.log("Error on readyProduct - ", error);
    dispatch(fetchProductError());
  }
};

export const mutateProducts = (
  currentSelectedCategory,
  productData,
  productType,
  productAction
) => (dispath) => {
  let type = "";
  if (productType === "FLAVORS") {
    type = MUTATE_FLAVORS;
  } else if (productType === "TOPFLAVORS") {
    type = MUTATE_TOP_FlOVORS;
  } else if (productType === "MIDDLEFLAVORS") {
    type = MUTATE_MIDDLE_FlOVORS;
  } else if (productType === "BOTTOMFLAVORS") {
    type = MUTATE_BOTTOM_FlOVORS;
  } else if (productType === "TOPINGS") {
    type = MUTATE_TOPPINGS;
  } else if (productType === "TOPTOPINGS") {
    type = MUTATE_TOP_TOPINGS;
  } else if (productType === "BOTTOMTOPPINGS") {
    type = MUTATE_BOTTOM_TOPINGS;
  } else if (productType === "MIDDLETOPPINGS") {
    type = MUTATE_MIDDLE_TOPINGS;
  } else {
    type = MUTATE_SIDE_TOPINGS;
  }

  dispath({
    type,
    actionType: productAction,
    productData,
    currentSelectedCategory,
  });
};

export const initialSelectedProductData = (categoryData) => (dispatch) => {
  let updatedCategoryData = categoryData.map((singleCategory) => {
    if (
      singleCategory.SubCategoryInfolst != null &&
      singleCategory.SubCategoryInfolst.length > 1
    ) {
      let updatedSubCategory = singleCategory.SubCategoryInfolst.map(
        (singleSubCategory) => {
          return {
            SubCategoryId: singleSubCategory.SubCategoryId,
            isEditMode: false,
            flavours: [],
            bottomflavours: [],
            middleflavours: [],
            topflavours: [],

            toppings: [],
            bottomTopping: [],
            middleTopping: [],
            topTopping: [],
            sideTopping: [],
          };
        }
      );
      return {
        CategoryId: singleCategory.CategoryId,
        isSubCategory: true,
        subCategoryData: updatedSubCategory,
      };
    } else {
      return {
        CategoryId: singleCategory.CategoryId,
        isEditMode: false,
        isSubCategory: false,
        flavours: [],
        bottomflavours: [],
        middleflavours: [],
        topflavours: [],

        toppings: [],
        bottomTopping: [],
        middleTopping: [],
        topTopping: [],
        sideTopping: [],
      };
    }
  });

  //Initialize Six Pack Logic here
  // if(singleSubCategory.SubCategoryName === "Six Pack"){
  //   dispatch(initSixPack(singleCategory,singleSubCategory));
  // }

  dispatch(initSixPack(categoryData));
  dispatch({ type: READY_SELECTED_PRODUCT_DATA, payload: updatedCategoryData });
};


export const updateFlavorTree = (newFlavor) => {
  return {
    type: UPDATE_FLAVOR,
    payload: newFlavor
  }
}
export const updateToppingTree = (newTopping) => {
  return {
    type: UPDATE_TOPPING,
    payload: newTopping
  }
}
export default productReducer;
