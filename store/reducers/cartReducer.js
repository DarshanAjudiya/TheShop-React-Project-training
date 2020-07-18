import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cartActions';
import { ADD_NEW_ORDER } from '../actions/orderActions';
import { DELETE_PRODUCT } from '../actions/productsActions';
import CartItem from '../../models/CartItem';

const initialState = {
  items: {},
  totalAmount: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        // already have the item in the cart
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }

      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + prodPrice
      };

    case REMOVE_FROM_CART:
      const productId = action.productId;
      const product = state.items[productId];

      let updatedCartItems;
      if (product.quantity === 1) {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[productId];

      }
      else {

        const updatedCartItem = new CartItem(
          product.quantity - 1,
          product.productPrice,
          product.productTitle,
          product.sum - product.productPrice
        );

        updatedCartItems = { ...state.items, [productId]: updatedCartItem };

      }
      let amount = state.totalAmount - product.productPrice;
      if (amount < 0) { amount = 0 }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: amount
      };

    case ADD_NEW_ORDER:
      return initialState;

    case DELETE_PRODUCT:
      const sum = state.items[action.pid].sum;
      const updatedItems = state.items;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - sum
      }
    default:
      return state;
  }
};
