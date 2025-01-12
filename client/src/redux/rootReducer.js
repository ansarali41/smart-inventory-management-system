const initialState = {
    loading: false,
    cartItems: [],
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_LOADING':
            return {
                ...state,
                loading: true,
            };
        case 'HIDE_LOADING':
            return {
                ...state,
                loading: false,
            };
        case 'ADD_TO_CART':
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            if (existingItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(item => (item._id === action.payload._id ? { ...item, quantity: item.quantity + 1 } : item)),
                };
            }
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload],
            };
        case 'UPDATE_CART':
            return {
                ...state,
                cartItems: state.cartItems.map(product => (product._id === action.payload._id ? { ...product, quantity: action.payload.quantity } : product)),
            };
        case 'DELETE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(product => product._id !== action.payload._id),
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cartItems: [],
            };
        default:
            return state;
    }
};
