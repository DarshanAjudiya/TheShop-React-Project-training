import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import ProductOverviewScreen from '../src/screens/shop/ProductOverviewScreen';
import ProductDetailScreen from '../src/screens/shop/ProductDetailScreen';
import OrderScreen from '../src/screens/shop/OrderScreen';
import CartScreen from '../src/screens/shop/CartScreen';
import UserProductScreen from '../src/screens/user/UserProductScreen';
import EditProductScreen from '../src/screens/user/EditProductScreen';

import AuthScreen from '../src/screens/user/AuthScreen';
import { Platform, Button, SafeAreaView } from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import SplashScreen from '../src/screens/SplashScreen';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/authActions';

const defaultNavigationOption = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const productStack = createStackNavigator(
    {
        ProductOverview: ProductOverviewScreen,
        ProductDetail: ProductDetailScreen,
        Cart: CartScreen,
        Order: OrderScreen
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons name={Platform.os === 'android' ? 'md-cart' : 'ios-cart'} size={24} color={drawerConfig.tintColor} />
            )
        },
        defaultNavigationOptions: defaultNavigationOption
    }
);

const orderScreen = createStackNavigator(
    {
        Orders: OrderScreen
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons name={Platform.os === 'android' ? 'md-list' : 'ios-list'} size={24} color={drawerConfig.tintColor} />
            )
        },
        defaultNavigationOptions: defaultNavigationOption
    }
);

const userProductScreen = createStackNavigator(
    {
        UserProduct: UserProductScreen,
        EditProduct: EditProductScreen
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons name={Platform.os === 'android' ? 'md-create' : 'ios-create'} size={24} color={drawerConfig.tintColor} />
            )
        },
        defaultNavigationOptions: defaultNavigationOption
    }
);

const authNavigator = createStackNavigator(
    {
        Auth: AuthScreen
    },
    {
        defaultNavigationOptions: defaultNavigationOption
    }
);

const contentComponents = (props) => {
    const dispatch = useDispatch();

    return <SafeAreaView>
        <DrawerItems {...props} />
        <Button title='Log Out' color={Colors.primary} style={{ margin: 10 }} onPress={() => {
            dispatch(authActions.logout());
        }} />
    </SafeAreaView>
};

const shopNavigator = createDrawerNavigator(
    {
        Products: productStack,
        Orders: orderScreen,
        UserProduct: userProductScreen
    },
    {
        contentOptions: {
            activeTintColor: Colors.secondary
        },
        contentComponent: contentComponents
    }
);

const mainNavigator = createSwitchNavigator(
    {
        Splash: SplashScreen,
        Auth: authNavigator,
        Shop: shopNavigator
    }
);


export default createAppContainer(mainNavigator);
