import { NavigationActions } from 'react-navigation';

let navigationRef = null;

export const setTopTabRef = (nav) => {
    navigationRef = nav;
}

export const navigateTopTabRef = (routeName, params = {}) => {

    navigationRef.dispatch(
        NavigationActions.navigate({
            routeName, params
        })
    );
}