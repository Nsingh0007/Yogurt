import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Auth component...
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import PersonalInfo from '../components/notAuth/PersonalInfo';
import EditProfile from '../components/notAuth/EditProfile';
import Splash from '../components/auth/Splash';

// Not Auth Component....
import RootHome from '../components/notAuth/RootHome';
import Home from '../components/notAuth/Home';
import Contact from '../components/notAuth/Contact';
import Gift from '../components/notAuth/Gift';
import Order from '../components/notAuth/Order';
import Status from '../components/notAuth/Status';
import ForgotPassword from '../components/auth/ForgotPassword';
import orderMenuIndex from '../components/notAuth/TopNavigator/manuBord/index';

import TopNav from '../components/notAuth/TopNavigator/index';
import Flavors from '../components/notAuth/TopNavigator/manuBord/Flavors';

import BottomFlavor from '../components/notAuth/TopNavigator/manuBord/BottomFlavor';
import MiddleFlavor from '../components/notAuth/TopNavigator/manuBord/MiddleFlavor';
import TopFlavor from '../components/notAuth/TopNavigator/manuBord/TopFlavor';

import menuToppings from '../components/notAuth/TopNavigator/manuBord/Toppings';
import menuBottomToppings from '../components/notAuth/TopNavigator/manuBord/BottomToppings';
import menuMiddleTopping from '../components/notAuth/TopNavigator/manuBord/MiddleToppings';
import menuTopTopping from '../components/notAuth/TopNavigator/manuBord/TopToppings';
import CreatePassword from '../components/auth/CreatePassword';
import menusidetoppings from '../components/notAuth/TopNavigator/manuBord/SideTopping';
import menuSixPack from '../components/notAuth/TopNavigator/manuBord/SixPack';
import ReviewOrder from '../components/notAuth/TopNavigator/manuBord/ReviewOrder';
import CheckoutScreen from '../components/notAuth/TopNavigator/manuBord/checkOut';
import OrderPlacedScreen from '../components/notAuth/TopNavigator/manuBord/OrderPlaced';
import inbox from '../components/notAuth/inbox';

import Account from '../components/notAuth/Account';
import Settings from '../components/notAuth/Settings';
import Menu from '../components/notAuth/TopNavigator/Menu';
import BottomNavLayout from './BottomNavLayout';

import giftIndex from '../components/notAuth/giftCard/index';
import sendeGift from '../components/notAuth/giftCard/sendeGift';
import RewardsPoints from '../components/notAuth/RewardsPoints';
import ViewPrevious from '../components/notAuth/TopNavigator/ViewPrevious';
import orderStatusDetails from '../components/orderStatusDetails';

const AppNavigator = createStackNavigator(
  {
    splash: {
      screen: Splash,
      navigationOptions: {
        headerShown: false,
      },
    },
    login: {
      screen: Login,
      navigationOptions: {
        headerShown: false,
      },
    },
    singup: {
      screen: SignUp,
      navigationOptions: {
        headerShown: false,
      },
    },
    account: {
      screen: Account,
      navigationOptions: {
        headerShown: false,
      },
    },
    settings: {
      screen: Settings,
      navigationOptions: {
        headerShown: false,
      },
    },
    forgotpassword: {
      screen: ForgotPassword,
      navigationOptions: {
        headerShown: false,
      },
    },
    createpassword: {
      screen: CreatePassword,
      navigationOptions: {
        headerShown: false,
      },
    },
    personalinfo: {
      screen: PersonalInfo,
      navigationOptions: {
        headerShown: false,
      },
    },
    editprofile: {
      screen: EditProfile,
      navigationOptions: {
        headerShown: false,
      },
    },
    RootHome: {
      screen: RootHome,
      navigationOptions: {
        headerShown: false,
      },
    },
    
    

    Order: {
      screen: Order,
      navigationOptions: {
        headerShown: false,
      },
    },
    
    menuIndex: {
      screen: orderMenuIndex,
      navigationOptions: {
        headerShown: false,
      },
    },
    menuFlavour: {
      screen: Flavors,
      navigationOptions: {
        headerShown: false,
      },
    },
    menuBottomFlavour: {
      screen: BottomFlavor,
      navigationOptions: {
        headerShown: false,
      },
    },
    menuMiddleFlavour: {
      screen: MiddleFlavor,
      navigationOptions: {
        headerShown: false,
      },
    },
    menuTopFlavour: {
      screen: TopFlavor,
      navigationOptions: {
        headerShown: false,
      },
    },
    menuBottomTopping: {
      screen: menuBottomToppings,
      navigationOptions: {
        headerShown: false,
      },
    },
    menuTopping: {
      screen: menuToppings,
      navigationOptions: {
        headerShown: false,
      },
    },
    orderstatusdetails: {
      screen: orderStatusDetails,
      navigationOptions: {
        headerShown: false,
      },
    },
    menuMiddleTopping: {
      screen: menuMiddleTopping,
      navigationOptions: {
        headerShown: false,
      },
    },
    menuTopTopping: {
      screen: menuTopTopping,
      navigationOptions: {
        headerShown: false,
      },
    },
    menusidetoppings: {
      screen: menusidetoppings,
      navigationOptions: {
        headerShown: false,
      },
    },
    menuSixPack: {
      screen: menuSixPack,
      navigationOptions: {
        headerShown: false,
      },
    },
    inbox: {
      screen: inbox,
      navigationOptions: {
        headerShown: false,
      },
    },
    revieworder: {
      screen: ReviewOrder,
      navigationOptions: {
        headerShown: false,
      },
    },
    menu: {
      screen: Menu,
      navigationOptions: {
        headerShown: false,
      },
    },
    giftIndex: {
      screen: giftIndex,
      navigationOptions: {
        headerShown: false,
      },
    },
    sendegift: {
      screen: sendeGift,
      navigationOptions: {
        headerShown: false,
      },
    },
    reward: {
      screen: RewardsPoints,
      navigationOptions: {
        headerShown: false,
      },
    },
    viewprevious: {
      screen: ViewPrevious,
      navigationOptions: {
        headerShown: false,
      },
    },
    BottomNavLayout: {
      screen: BottomNavLayout,
      navigationOptions: {
        headerShown: false,
      },
    },
    CheckoutScreen: {
      screen: CheckoutScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    OrderPlacedScreen: {
      screen: OrderPlacedScreen,
      navigationOptions: {
        headerShown: false,
        gestureEnabled: false
      },
    },
  },
  {
    unmountInactiveRoutes: true,
    initialRouteName: 'splash',
  },
);

export default createAppContainer(AppNavigator);
