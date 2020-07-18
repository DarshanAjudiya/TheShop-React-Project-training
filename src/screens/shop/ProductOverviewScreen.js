import React from 'react';
import { FlatList, Platform, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/ProductItem';
import * as cartActions from '../../../store/actions/cartActions';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import Colors from '../../../constants/Colors';

const ProductOverviewScreen = ({ navigation }) => {

  const products = useSelector(state => state.products.availableProducts);
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const onSelectHandler = (id, title) => {
    navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };
  return (
    <FlatList
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

ProductOverviewScreen.navigationOptions = ({ navigation }) => {
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

export default ProductOverviewScreen;
