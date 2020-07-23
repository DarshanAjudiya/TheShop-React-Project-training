import Order from '../../models/Order';

export const ADD_NEW_ORDER = 'ADD_NEW_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async (dispatch,getState) => {
        const token = getState().auth.token;
        const uid = getState().auth.userId;
        
        const response = await fetch(`https://the-shop-react-native.firebaseio.com/orders/${uid}.json?auth=${token}`);
        const resData = await response.json();

        if (!response.ok) {
            throw new Error('something is wrong!!');

        }
        let loadedData = [];
        for (let key in resData) {
            loadedData.push(
                new Order(
                    key,
                    resData[key].items,
                    resData[key].totalAmount,
                    new Date(resData[key].date)
                )
            );
        }
        dispatch({ type: SET_ORDERS, orders: loadedData });

    }
}

export const addNewOrder = (items, totalAmount) => {
    return async (dispatch,getState) => {
        const token = getState().auth.token;
        const uid = getState().auth.userId;


        const date = new Date();

        const response = await fetch(`https://the-shop-react-native.firebaseio.com/orders/${uid}.json?auth=${token}`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    items,
                    totalAmount,
                    date: date.toUTCString()
                })
            });
            const data = await response.json();

        if (!response.ok) {
            throw new Error('something went Wrong ! try Again!');
        }

        dispatch({ type: ADD_NEW_ORDER, orderData: { id: data.name, items, totalAmount, date } });

    };
};