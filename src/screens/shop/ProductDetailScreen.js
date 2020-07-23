import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import * as cartActions from '../../../store/actions/cartActions';

const ProductDetailScreen = ({ navigation }) => {
    const productId = navigation.getParam('productId');
    const selectedProduct = useSelector(state => {
       return state.products.availableProducts.find(prod => prod.id === productId)
    });
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
            <View style={styles.actions}>
                <Button
                    color={Colors.primary}
                    title="Add to Cart"
                    onPress={() => {
                        dispatch(cartActions.addToCart(selectedProduct));
                    }}
                />
            </View>
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    );
};

ProductDetailScreen.navigationOptions = ({navigation}) => {
    return {
        headerTitle: navigation.getParam('productTitle'),
        headerRight: () => {
            return <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item title='Cart' iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} onPress={() => { navigation.navigate('Cart'); }} />
            </HeaderButtons>;
          }
    };
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center'
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'open-sans-bold'
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    }
});

export default ProductDetailScreen;
