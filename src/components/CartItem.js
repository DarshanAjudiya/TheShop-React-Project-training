import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = props => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <View style={{ width: 25 }}>
          <Text style={styles.quantity}>{props.quantity}</Text>
        </View>
        <Text style={styles.mainText} numberOfLines = {1} >{props.title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.mainText} >${props.amount.toFixed(2)}</Text>
        {props.deletable && <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
          <Ionicons
            name={Platform.OS === 'android' ? 'md-remove-circle-outline' : 'ios-remove-circle-outline'}
            size={24}
            color="red"
          />
        </TouchableOpacity>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  itemData: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '50%'
  },
  quantity: {
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 16,
    alignSelf: 'flex-end',
    marginRight: 5

  },
  mainText: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,

  },
  deleteButton: {
    marginLeft: 20
  }
});

export default CartItem;
