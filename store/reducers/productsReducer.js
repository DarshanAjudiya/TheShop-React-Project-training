import PRODUCTS from '../../data/dummy-data';
import { ADD_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS } from '../actions/productsActions';
import Product from '../../models/Product';

const initialState = {
    availableProducts: [],
    userProducts: []
};

export default (state = initialState, action) => {
    switch (action.type) {

        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            };

        case ADD_PRODUCT:
            const product = action.product;
            const newProduct = new Product(
                product.id,
                product.ownerId,
                product.title,
                product.imgUrl,
                product.description,
                product.price
            );
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            };
        case EDIT_PRODUCT:
            const detail = action.product;
            const index = state.userProducts.findIndex(product => product.id === detail.pid);

            const updatedProduct = new Product(
                detail.pid,
                state.userProducts[index].ownerId,
                detail.title,
                detail.imgUrl,
                detail.description,
                state.userProducts[index].price
            );
            const updatedUserProds = [...state.userProducts];
            updatedUserProds[index] = updatedProduct;
            const index2 = state.availableProducts.findIndex(product => product.id === detail.pid);
            const updatedAllProds = [...state.availableProducts];
            updatedAllProds[index2] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAllProds,
                userProducts: updatedUserProds,

            };

        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id != action.pid),
                availableProducts: state.availableProducts.filter(product => product.id != action.pid)
            };
        default:
            return state;
    }
};