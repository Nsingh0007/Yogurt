import { removeDuplicateFromArr, sortArrayAlphabatically } from '../utils';
const transformFlavor = (flavorData) => {
    let flavorTypeNames = [];
    flavorData.map((flavor) => {
        if (flavor.FlavorTypeId && flavor.FlavorTypeName) {
            flavorTypeNames.push({
                FlavorTypeId: flavor.FlavorTypeId,
                FlavorTypeName: flavor.FlavorTypeName,
            });
        }
    });
    let uniqueFlavorTypeNames = removeDuplicateFromArr(flavorTypeNames, 'FlavorTypeName');
    let finalSort = sortArrayAlphabatically(uniqueFlavorTypeNames, 'FlavorTypeId');
    let transformedFlavor = [];
    finalSort.map((sorted) => {
        flavours = flavorData.filter((flavor) => {
            return flavor.FlavorTypeId == sorted.FlavorTypeId;
        });
        transformedFlavor.push({
            ...sorted,
            flavours: flavours.filter(i => i.Status == "Active")
        })
    });
    console.log('FINALOUTPUTS = ', JSON.stringify(transformedFlavor));
    return transformedFlavor;
}

export default transformFlavor;