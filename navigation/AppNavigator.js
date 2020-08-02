import React from 'react';
//import MainNavigator from './MainNavigator';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ShopNavigator, AuthNavigator } from './MainNavigator'
import SplashScreen from '../src/screens/SplashScreen';

const AppNavigator = () => {

    const isAuth = useSelector(state => !!state.auth.token);
    const didTryLogin = useSelector(state => state.auth.didTryAutoLogin);
    console.log(didTryLogin);
    return (
        <NavigationContainer>
            {isAuth && <ShopNavigator />}
            {didTryLogin && !isAuth && <AuthNavigator />}
            {!didTryLogin && <SplashScreen />}
        </NavigationContainer>
    );
};

export default AppNavigator;