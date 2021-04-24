import {removeDuplicateFromArr, sortArrayAlphabatically} from '../utils';
import {createFilter} from 'react-native-search-filter';

const KEYS_TO_FILTERS = ['ToppingName'];
const transformTopping = (toppingData, isSearchMode, searchKey) => {
  let toppingTypesName = [];
  toppingData.map(topping => {
    if (topping.ToppingTypeId && topping.ToppingTypeName) {
      toppingTypesName.push({
        ToppingTypeId: topping.ToppingTypeId,
        ToppingTypeName: topping.ToppingTypeName,
      });
    }
  });
  let uniqueToppingTypesName = removeDuplicateFromArr(
    toppingTypesName,
    'ToppingTypeName',
  );
  let finalSort = sortArrayAlphabatically(
    uniqueToppingTypesName,
    'ToppingTypeId',
  );

  let transformedTopping = [];
  finalSort.map(sorted => {
    toppings = toppingData.filter(topping => {
      return topping.ToppingTypeId == sorted.ToppingTypeId;
    });
    if (isSearchMode) {
      toppings = toppings.filter(createFilter(searchKey, KEYS_TO_FILTERS));
    }
    transformedTopping.push({
      ...sorted,
      toppings: toppings.filter(i => i.Status == 'Active')
    });
  });
  return transformedTopping;
};

export default transformTopping;
