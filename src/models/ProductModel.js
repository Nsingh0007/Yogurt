
class ProductModel {

    categoryData = null;
    subCategoryData = null;

    constructor(categoryData = null, subCategoryData = null) {
        this.categoryData = categoryData;
        this.subCategoryData = subCategoryData;
    }
    init = () => {
        let returnValue = {};
        if (this.categoryData.IsSubCategory) {
            let subCategoryData; 
            if (this.categoryData.SubCategoryInfolst == null ){
                subCategoryData = [];
            }else {
                subCategoryData = this.categoryData.SubCategoryInfolst.map((subCategory) => {
                    return {
                        SubCategoryId: subCategory.SubCategoryId,
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
                });
            }
            
            returnValue = {
                CategoryId: this.categoryData.CategoryId,
                isSubCategory: true,
                subCategoryData: subCategoryData,
            };
        } else {
            returnValue = {
                CategoryId: this.categoryData.CategoryId,
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
        return returnValue;
    }
    initSubCategory = () => {
        return {
            SubCategoryId: this.subCategoryData.SubCategoryId,
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
}

export default ProductModel;