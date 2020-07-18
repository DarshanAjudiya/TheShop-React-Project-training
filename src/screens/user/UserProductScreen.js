import React from 'react';
import { FlatList, Button } from 'react-native';
import ProductItem from '../../components/ProductItem';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../../constants/Colors';
import * as productsActions from '../../../store/actions/productsActions';

const UserProductScreen = ({ navigation }) => {

    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();
    return (
        <FlatList
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
                <ProductItem
                    image={item.imageUrl}
                    title={item.title}
                    price={item.price}
                    onSelect={() => { }}
                >
                    <Button color={Colors.primary} title="Edit" onPress={() => { }} />
                    <Button
                        color={Colors.primary}
                        title="Delete"
                        onPress={() => {
                            dispatch(productsActions.deleteProduct(item.id));
                        }}
                    />
                </ProductItem>
            )}
        />
    );
};

UserProductScreen.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Your Products',
        headerLeft: () => {
            return <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => { navigation.toggleDrawer(); }} />
            </HeaderButtons>
        }
    };
};


export default UserProductScreen;
