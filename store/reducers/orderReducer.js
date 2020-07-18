import { ADD_NEW_ORDER } from '../actions/orderActions';
import Order from '../../models/Order';

const initialState = {
    orders: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_NEW_ORDER:
            const newOrder = new Order(
                new Date().toString(),
                action.orderData.items,
                action.orderData.totalAmount,
                new Date()
            );
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            };
        default:
            return state;
    }
};