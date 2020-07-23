import { ADD_NEW_ORDER, SET_ORDERS } from '../actions/orderActions';
import Order from '../../models/Order';

const initialState = {
    orders: []
};

export default (state = initialState, action) => {
    switch (action.type) {

        case SET_ORDERS:
            return {
                orders: action.orders
            };

        case ADD_NEW_ORDER:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items,
                action.orderData.totalAmount,
                action.orderData.date
            );
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            };
        default:
            return state;
    }
};