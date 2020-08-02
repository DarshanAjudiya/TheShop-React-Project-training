import React, { useState, useCallback, useEffect } from 'react';
import { Platform, FlatList, View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import OrderItem from '../../components/OrderItem';
import * as orderActions from '../../../store/actions/orderActions';
import Colors from '../../../constants/Colors';

const OrderScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsREfreshing] = useState(false);
  const [error, setError] = useState();

  const orders = useSelector(state => state.order.orders);

  const dispatch = useDispatch();

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsREfreshing(true);
    try {
      await dispatch(orderActions.fetchOrders());
    } catch (err) {
      setError(err.message);
    }
    setIsREfreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscriber = navigation.addListener('focus', loadOrders);
    return () => {
      unsubscriber();
    };
  }, [loadOrders]);

  useEffect(() => {
    setIsLoading(true);
    loadOrders().then(() => setIsLoading(false));
  }, [dispatch, loadOrders]);

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

  if (orders.length === 0) {
    return (<View style={styles.centered}>
      <Text style={styles.text}>No Orders Found</Text>
      <Text style={styles.text}>Try Ordering Some Products</Text>
    </View>
    );
  }


  return (
    <FlatList
      refreshing={isRefreshing}
      onRefresh={loadOrders}
      data={orders.reverse()}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <OrderItem
          amount={item.totalAmount}
          date={item.readableDate}
          items={item.items}
        />
      )}
    />
  );
};

export const orderScreenOptions = ({ navigation }) => {
  return {
    headerTitle: 'Your Orders',
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
  }
});

export default OrderScreen;
