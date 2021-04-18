import { NavigationActions } from 'react-navigation';
import { Subject } from 'rxjs';

let rootBottomTabRef = null;
export const currentBottomTabSubject = new Subject();
export const setRootBottomTabRef = (nav) => {
    rootBottomTabRef = nav;
}

export const navigateRootBottomTab = (routeName, params = {}) => {
    currentBottomTabSubject.next(routeName);
    rootBottomTabRef.dispatch(
        NavigationActions.navigate({
            routeName, params
        })
    );
}