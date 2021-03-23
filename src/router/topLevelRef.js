import { NavigationActions } from 'react-navigation';

let topLevelnavigationRef = null;

export const setTopLevelNav = (nav) => {
    topLevelnavigationRef = nav;
}

export const topLevelNavigate = (routeName, params = {}) => {

    topLevelnavigationRef.dispatch(
        NavigationActions.navigate({
            routeName, params
        })
    );
}