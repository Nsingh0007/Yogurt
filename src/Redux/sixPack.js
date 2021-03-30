const INIT = "INIT";

const initialState = {
  ready: false,
  sixPackData: [],
};
const init = (sixPackData) => {
  return {
    type: INIT,
    data: {
      ready: true,
      sixPackData,
    },
  };
};

export const SixPackReducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case INIT:
      return { ...state, ...data };
    case "MUTATE":
      console.log('MUTATE_SIX_PACK_REDUCER_1 - ', JSON.stringify(data));
      return { ...state, ...data };
    default:
      return state;
  }
};

const getCommonArray = (productType = "Nipper",totalNippers = 6) => {
  let arr = [];
  for (let i = 0; i < totalNippers; i++) {
    arr.push({
      type: `${productType} ${i + 1}`,
      products: [],
    });
  }
  return arr;
};

export const initSixPack = (categoryData) => (dispatch) => {
  let sixPackData = [];
  let initSixPackVar = categoryData.map((singleCategory) => {
    if (
      singleCategory.SubCategoryInfolst != null &&
      singleCategory.SubCategoryInfolst.length > 1
    ) {
      let singleSubCategoryParent;
      let updatedSubCategory = singleCategory.SubCategoryInfolst.map(
        (singleSubCategory) => {
          if (
            singleSubCategory.SubCategoryName == "Six Pack" ||
            singleSubCategory.SubCategoryName == "Saucers with toppings" ||
            singleSubCategory.SubCategoryName == "Saucers without toppings"
          ) {
            let productType = singleSubCategory.SubCategoryName == "Six Pack" ? "Nipper" : "Saucer";
            singleSubCategoryParent = singleSubCategory;
            sixPackData.push({
              Category: singleCategory,
              SubCategory: singleSubCategoryParent,
              Products: {
                flavours: [...getCommonArray(productType)],
                bottomFlavor: [...getCommonArray(productType)],
                middleFlavor: [...getCommonArray(productType)],
                topFlavor: [...getCommonArray(productType)],

                toppings: [...getCommonArray(productType)],
                bottomTopping: [...getCommonArray(productType)],
                middleTopping: [...getCommonArray(productType)],
                topTopping: [...getCommonArray(productType)],
                sideTopping: [...getCommonArray(productType)],
              },
            });
          }
        }
      );
    }
  });
  dispatch(init(sixPackData));
};

//Object Bluepring
/*
        flavours: [],      
        bottomflavours: [],
        middleflavours: [],
        topflavours: [],

        toppings:[],
        bottomTopping: [],
        middleTopping: [],
        topTopping: [],
        sideTopping: [],

        sixPackData: [
            {
                ..categoryData,
                ...subcategoryData,
                flavours: [
                    {
                        type: "1",
                        products: []
                    }
                ]
            }
        ]
    */
