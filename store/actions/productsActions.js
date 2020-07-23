import Product from "../../models/Product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const uid = getState().auth.userId;


        const response = await fetch(`https://the-shop-react-native.firebaseio.com/products.json?auth=${token}`);

        const resData = await response.json();
        if (!response.ok) {
            throw new Error('something is wrong!!');

        }
        let loadedProducts = [];
        for (let key in resData) {
            loadedProducts.push(
                new Product(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imgUrl,
                    resData[key].description,
                    resData[key].price
                )
            );
        }
        dispatch({
            type: SET_PRODUCTS,
            products: loadedProducts,
            userProducts: loadedProducts.filter(prod => prod.ownerId === uid)
        });

    }
};

export const deleteProduct = (pid) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://the-shop-react-native.firebaseio.com/products/${pid}.json?auth=${token}`,
            {
                method: 'DELETE'
            }
        );
        if (!response.ok) {
            throw new Error('something is wrong!!');

        }
        dispatch({ type: DELETE_PRODUCT, pid });
    }
};

export const editProduct = (pid, title, imgUrl, description) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://the-shop-react-native.firebaseio.com/products/${pid}.json?auth=${token}`,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    imgUrl,
                })
            });
        if (!response.ok) {
            throw new Error('something is wrong!!');

        }
        dispatch({
            type: EDIT_PRODUCT,
            product: {
                pid, title, description, imgUrl
            }
        });

    };
};

export const addProduct = (title, imgUrl, description, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const uid = getState().auth.userId;
        const response = await fetch(`https://the-shop-react-native.firebaseio.com/products.json?auth=${token}`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    imgUrl,
                    price,
                    ownerId: uid
                })
            });

        const data = await response.json();

        dispatch({
            type: ADD_PRODUCT,
            product: {
                id: data.name,
                title,
                description,
                imgUrl,
                price
            }
        });
    }
};