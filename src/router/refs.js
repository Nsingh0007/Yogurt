import { NavigationActions } from 'react-navigation';

let navigationRef = null;

export const setTabRef = (nav) => {
    navigationRef = nav;
}

export const navigateTabRef = (routeName, params = {}) => {

    navigationRef.dispatch(
        NavigationActions.navigate({
            routeName, params
        })
    );
}