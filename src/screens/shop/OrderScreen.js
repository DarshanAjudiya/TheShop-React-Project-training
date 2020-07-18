import React from 'react';
import { Platform, FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import { useSelector } from 'react-redux';
import OrderItem from '../../components/OrderItem';

const OrderScreen = ({ navigation }) => {

    const orders = useSelector(state => state.order.orders);

    return (
        <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <OrderItem
            amount={item.totalAmount}
            date={item.readableDate}
            items={item.items}
          />
        )}
      />
    );
};

OrderScreen.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => {
            return <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => { navigation.toggleDrawer(); }} />
            </HeaderButtons>
        }
    };
};

export default OrderScreen;
