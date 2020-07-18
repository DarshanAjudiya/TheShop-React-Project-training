import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ProductOverviewScreen from '../src/screens/shop/ProductOverviewScreen';
import ProductDetailScreen from '../src/screens/shop/ProductDetailScreen';
import OrderScreen from '../src/screens/shop/OrderScreen';
import CartScreen from '../src/screens/shop/CartScreen';
import { Platform } from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from 'react-navigation-drawer';
import UserProductScreen from '../src/screens/user/UserProductScreen';

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
        UserProduct: UserProductScreen
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

const shopNavigator = createDrawerNavigator(
    {
        Products: productStack,
        Orders: orderScreen,
        UserProduct: userProductScreen
    },
    {
        contentOptions: {
            activeTintColor: Colors.secondary 
        }
    }
);

export default createAppContainer(shopNavigator);
