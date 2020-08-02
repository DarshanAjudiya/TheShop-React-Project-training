import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';
import Colors from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/authActions';

const SplashScreen = ({ navigation }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userCredentials');
            if (!userData) {
                // navigation.navigate('Auth');
                dispatch(authActions.setDidTryAl());
                return;
            }
            const transformedData = JSON.parse(userData);
            const { token, userId, expirationDate } = transformedData;
            const expiration = new Date(expirationDate);
            const currentDate = new Date();
            if (expiration <= currentDate || !token || !userId )
            {
                // navigation.navigate('Auth');
                dispatch(authActions.setDidTryAl());
                return;
            }
            const expirationTime = expiration.getTime() - currentDate.getTime();
            // navigation.navigate('Shop'); 

            dispatch(authActions.authenticate(token,userId,expirationTime));
            
        };
        tryLogin();
    }, []);

    return (
        <View style = {styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center'
    }
});
export default SplashScreen;