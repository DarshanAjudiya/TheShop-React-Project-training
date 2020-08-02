import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, Platform, Button, View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/ProductItem';
import * as cartActions from '../../../store/actions/cartActions';
import * as productsActions from '../../../store/actions/productsActions';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const ProductOverviewScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const onSelectHandler = (id, title) => {
    navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true)
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProducts);
    return () => {
      unsubscribe();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() =>
      setIsLoading(false));

  }, [dispatch, loadProducts]);


  if (error) {
    return <View style={styles.centered}>
      <Text>{error}</Text>
      <Button title='Try Again' color={Colors.primary} />
    </View>
  }

  if (isLoading) {
    return <View style={styles.centered}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  }

  if (products.length === 0) {
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
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ProductItem
          image={item.imageUrl}
          title={item.title}
          price={item.price}
          onSelect={() => onSelectHandler(item.id, item.title)}
        >

          <Button color={Colors.primary} title="Show details" onPress={() => onSelectHandler(item.id, item.title)} />
          <Button
            color={Colors.primary}
            title="Add To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

export const productOverviewScreenOptions = ({ navigation }) => {
  return {
    headerTitle: 'All Products',
    headerRight: () => {
      return <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Cart' iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} onPress={() => { navigation.navigate('Cart'); }} />
      </HeaderButtons>
    },
    headerLeft: () => {
      return <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => { navigation.toggleDrawer(); }} />
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

export default ProductOverviewScreen;
