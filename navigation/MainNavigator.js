import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';

import ProductOverviewScreen, { productOverviewScreenOptions } from '../src/screens/shop/ProductOverviewScreen';
import ProductDetailScreen, { productDetailScreenOptions } from '../src/screens/shop/ProductDetailScreen';
import OrderScreen, { orderScreenOptions } from '../src/screens/shop/OrderScreen';
import CartScreen, { cartScreenOptions } from '../src/screens/shop/CartScreen';
import UserProductScreen, { UserProductScreenOptions } from '../src/screens/user/UserProductScreen';
import EditProductScreen, { EditProductScreenOptions } from '../src/screens/user/EditProductScreen';
import AuthScreen, { AuthScreenOptions } from '../src/screens/user/AuthScreen';

import { Platform, Button, SafeAreaView } from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/authActions';

const defaultNavigationOption = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};


const ProductStack = createStackNavigator();
const productNavigator = () => {

    return (
        <ProductStack.Navigator screenOptions={defaultNavigationOption} >
            <ProductStack.Screen name='ProductOverview' component={ProductOverviewScreen} options={productOverviewScreenOptions} />
            <ProductStack.Screen name='ProductDetail' component={ProductDetailScreen} options={productDetailScreenOptions} />
            <ProductStack.Screen name='Cart' component={CartScreen} options={cartScreenOptions} />
        </ProductStack.Navigator>
    );
};

// const productStack = createStackNavigator(
//     {
//         ProductOverview: ProductOverviewScreen,
//         ProductDetail: ProductDetailScreen,
//         Cart: CartScreen,
//     },
//     {
//         navigationOptions: {
//             drawerIcon: drawerConfig => (
//                 <Ionicons name={Platform.os === 'android' ? 'md-cart' : 'ios-cart'} size={24} color={drawerConfig.tintColor} />
//             )
//         },
//         defaultNavigationOptions: defaultNavigationOption
//     }
// );


const OrderStack = createStackNavigator();

const orderNavigator = () => {
    return (
        <OrderStack.Navigator screenOptions={defaultNavigationOption}>
            <OrderStack.Screen name='Orders' component={OrderScreen} options={orderScreenOptions} />
        </OrderStack.Navigator>
    );
};

// const orderScreen = createStackNavigator(
//     {
//         Orders: OrderScreen
//     },
//     {
//         navigationOptions: {
//             drawerIcon: drawerConfig => (
//                 <Ionicons name={Platform.os === 'android' ? 'md-list' : 'ios-list'} size={24} color={drawerConfig.tintColor} />
//             )
//         },
//         defaultNavigationOptions: defaultNavigationOption
//     }
// );

const UserProductStack = createStackNavigator();
const UserProductNavigator = () => {
    return (
        <UserProductStack.Navigator screenOptions={defaultNavigationOption} >
            <UserProductStack.Screen name='UserProduct' component={UserProductScreen} options={UserProductScreenOptions} />
            <UserProductStack.Screen name='EditProduct' component={EditProductScreen} options={EditProductScreenOptions} />
        </UserProductStack.Navigator>
    );
};


// const userProductScreen = createStackNavigator(
//     {
//         UserProduct: UserProductScreen,
//         EditProduct: EditProductScreen
//     },
//     {
//         navigationOptions: {
//             drawerIcon: drawerConfig => (
//                 <Ionicons name={Platform.os === 'android' ? 'md-create' : 'ios-create'} size={24} color={drawerConfig.tintColor} />
//             )
//         },
//         defaultNavigationOptions: defaultNavigationOption
//     }
// );


const AuthStack = createStackNavigator();
export const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={defaultNavigationOption}>
            <AuthStack.Screen name='Auth' component={AuthScreen} options={AuthScreenOptions} />
        </AuthStack.Navigator>
    );
};

// const authNavigator = createStackNavigator(
//     {
//         Auth: AuthScreen
//     },
//     {
//         defaultNavigationOptions: defaultNavigationOption
//     }
// );

// const contentComponents = (props) => {
//     const dispatch = useDispatch();

//     return <SafeAreaView>
//         <DrawerItemList {...props} />
//         <Button title='Log Out' color={Colors.primary} style={{ margin: 10 }} onPress={() => {
//             dispatch(authActions.logout());
//         }} />
//     </SafeAreaView>
// };

const ShopDrawer = createDrawerNavigator();

export const ShopNavigator = () => {
    // const dispatch = useDispatch();
    return (
        <ShopDrawer.Navigator drawerContent={(props) => {

            return <SafeAreaView>
                <DrawerItemList {...props} />
                <Button title='Log Out' color={Colors.primary} style={{ margin: 10 }} onPress={() => {
                    dispatch(authActions.logout());
                }} />
            </SafeAreaView>
        }} drawerContentOptions={{ activeTintColor: Colors.secondary }} >
            < ShopDrawer.Screen
                name='Products'
                component={productNavigator}
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name={Platform.os === 'android' ? 'md-cart' : 'ios-cart'}
                            size={24}
                            color={props.color} />
                    )
                }}
            />
            <ShopDrawer.Screen
                name='Orders'
                component={orderNavigator}
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name={Platform.os === 'android' ? 'md-list' : 'ios-list'}
                            size={24}
                            color={props.color} />
                    )
                }}
            />
            <ShopDrawer.Screen
                name='userProduct'
                component={UserProductNavigator}
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name={Platform.os === 'android' ? 'md-create' : 'ios-create'}
                            size={24}
                            color={props.color}
                        />
                    )
                }}
            />
        </ShopDrawer.Navigator >
    );
};

// const shopNavigator = createDrawerNavigator(
//     {
//         Products: productStack,
//         Orders: orderScreen,
//         UserProduct: userProductScreen
//     },
//     {
//         contentOptions: {
//             activeTintColor: Colors.secondary
//         },
//         contentComponent: contentComponents
//     }
// );

// const mainNavigator = createSwitchNavigator(
//     {
//         Splash: SplashScreen,
//         Auth: authNavigator,
//         Shop: shopNavigator
//     }
// );


// export default createAppContainer(mainNavigator);
