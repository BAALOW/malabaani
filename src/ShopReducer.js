export const intialState = {
    products: [],
    total: 0
};
const ShopReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case "ADD_TO_CART":
            return {
                ...state,
                products: payload.products,
                
            };
        case "REMOVE_FROM_CART":
            return {
                ...state,
                products: payload.products,
            };
        case "CALCULATE_TOTAL_PRICE":
            return {
                ...state,
                total: payload
            };
        default:
            return new Error("unknown action type");
    }
};
export default ShopReducer;