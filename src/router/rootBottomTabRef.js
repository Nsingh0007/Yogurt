import { NavigationActions } from 'react-navigation';

let rootBottomTabRef = null;

export const setRootBottomTabRef = (nav) => {
    rootBottomTabRef = nav;
}

export const navigateRootBottomTab = (routeName, params = {}) => {

    rootBottomTabRef.dispatch(
        NavigationActions.navigate({
            routeName, params
        })
    );
}