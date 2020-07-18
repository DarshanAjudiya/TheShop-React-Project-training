export const ADD_NEW_ORDER = 'ADD_NEW_ORDER';

export const addNewOrder = (items, totalAmount) => {
    return { type: ADD_NEW_ORDER, orderData: { items, totalAmount } };
};