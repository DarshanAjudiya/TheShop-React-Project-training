import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, Button, Alert, View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import ProductItem from '../../components/ProductItem';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../../constants/Colors';
import * as productsActions from '../../../store/actions/productsActions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const UserProductScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const [deleteError, setDeleteError] = useState();
    const [deletingId, setdeletingId] = useState(null);

    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const deleteHandler = async (id) => {
        setDeleteError(null);
        setdeletingId(id);
        Alert.alert('Are you sure?', 'Do you really want to delete?', [

            { text: 'No', style: 'default' },
            {
                text: 'Yes', style: 'destructive',
                onPress: async () => {

                    setIsLoading(true);
                    try {
                        await dispatch(productsActions.deleteProduct(id));
                    }
                    catch (err) {
                        setDeleteError(err);
                    }
                    setIsLoading(false);
                }
            }
        ]);
    }
    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setError]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadProducts);
        return () => {
            unsubscribe();
        };
    }, [loadProducts]);

    useEffect(() => {
        if (deleteError) {
            Alert.alert('Error occured', error, [{
                text: 'Ok',
                onPress: () => { setDeleteError(null); }
            }]);
        }
    }, [deleteError]);

    if (error) {
        return <View style={styles.centered}>
            <Text>{error}</Text>
            <Button title='Try Again' color={Colors.primary} />
        </View>
    }

    if (userProducts.length === 0) {
        return (<View style={styles.centered}>
            <Text style={styles.text}>No Products available</Text>
            <Text style={styles.text}>Try adding some</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProduct')}>
                <View style={{ alignItems: 'center' }}>
                    <Ionicons name={Platform.OS === 'android' ? 'md-create' : 'ios-create'} size={24} color={Colors.primary} />
                    <Text style={{ color: Colors.primary }}>Add New Product</Text>
                </View>
            </TouchableOpacity>
        </View>
        );
    }


    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <ProductItem
                    image={item.imageUrl}
                    title={item.title}
                    price={item.price}
                    onSelect={() => { navigation.navigate('EditProduct', { pid: item.id }); }}
                >
                    <Button color={Colors.primary} title="Edit" onPress={() => { navigation.navigate('EditProduct', { pid: item.id }); }} />
                    {isLoading && item.id === deletingId ?
                        <ActivityIndicator size='small' color={Colors.primary} /> :
                        <Button
                            color={Colors.primary}
                            title="Delete"
                            onPress={deleteHandler.bind(this, item.id)}
                        />
                    }
                </ProductItem>
            )}
        />
    );
};

export const UserProductScreenOptions = ({ navigation }) => {
    return {
        headerTitle: 'Your Products',
        headerLeft: () => {
            return <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => { navigation.toggleDrawer(); }} />
            </HeaderButtons>
        },
        headerRight: () => {
            return <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Add"
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {
                        navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        }
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'open-sans',
        fontSize: 18
    }
});


export default UserProductScreen;
