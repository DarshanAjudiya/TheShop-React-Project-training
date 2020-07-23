import React, { useRef, useEffect } from 'react';
import MainNavigator from './MainNavigator';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

const NavigationContainer = () => {
    const myref = useRef();
    const isAuth = useSelector(state => !!state.auth.token);
    useEffect(() => {
        if (!isAuth) {
            myref.current.dispatch(NavigationActions.navigate({ routeName: 'Auth' }));
        }

    }, [isAuth])
    return <MainNavigator ref={myref} />
};

export default NavigationContainer;