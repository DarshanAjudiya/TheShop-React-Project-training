export const DELETE_PRODUCT = 'DELETE_PRODUCT';

export const deleteProduct = (pid) => {
    return { type: DELETE_PRODUCT, pid };
};