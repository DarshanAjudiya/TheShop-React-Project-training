import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, FlatList, Platform, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../../components/CartItem';
import Colors from '../../../constants/Colors';
import * as cartActions from '../../../store/actions/cartActions';
import * as orderActions from '../../../store/actions/orderActions';
import Card from '../../components/UI/Card';

const CartScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            });
        }
        return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
    });

    const dispatch = useDispatch();

    const orderHandler = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await dispatch(orderActions.addNewOrder(cartItems, cartTotalAmount));
        }
        catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    },
        [dispatch, setError, setIsLoading, cartItems, cartTotalAmount]
    )

    useEffect(() => {
        if (error) {
            Alert.alert('error Occured:', error, [{
                text: 'Ok', style: 'default',
                onPress: () => {setError(null);}
            }]);
        }
    }, [error]);



    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total:{' '}
                    <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
                </Text>
                {isLoading ?
                    <ActivityIndicator size='large' color={Colors.primary} /> :
                    <Button
                        color={Platform.OS === 'ios' ? Colors.accent : Colors.secondary}
                        title="Order Now"
                        disabled={cartItems.length === 0}
                        onPress={orderHandler}
                    />
                }
            </Card>

            <FlatList
                data={cartItems}
                keyExtractor={item => item.productId}
                renderItem={({ item }) => (
                    <CartItem
                        quantity={item.quantity}
                        title={item.productTitle}
                        amount={item.sum}
                        deletable
                        onRemove={() => { dispatch(cartActions.removeFromCart(item.productId)); }}
                    />
                )}
            />
        </View>
    );
};

export const cartScreenOptions = {
    headerTitle: 'Cart'
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default CartScreen;
