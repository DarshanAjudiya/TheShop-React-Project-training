import React from 'react';
import { View, StyleSheet, Text, Button, FlatList, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../../components/CartItem';
import Colors from '../../../constants/Colors';
import * as cartActions from '../../../store/actions/cartActions';
import * as orderActions from '../../../store/actions/orderActions';

const CartScreen = ({ navigation }) => {
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


    return (
        <View style={styles.screen}>
            <View style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total:{' '}
                    <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
                </Text>
                <Button
                    color={Platform.OS === 'ios' ? Colors.accent : Colors.secondary}
                    title="Order Now"
                    disabled={cartItems.length === 0}
                    onPress={() => { dispatch(orderActions.addNewOrder(cartItems, cartTotalAmount)); }}
                />
            </View>

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

CartScreen.navigationOptions = {
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
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    }
});

export default CartScreen;
