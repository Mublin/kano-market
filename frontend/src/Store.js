import { createContext, useReducer } from "react";


export const Store = createContext()

const initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems") ? 
        JSON.parse(localStorage.getItem("cartItems")) : [],
        shippingAddress: localStorage.getItem("shippingAddress") ? 
        JSON.parse(localStorage.getItem("shippingAddress")) : {},
        paymentMethod: localStorage.getItem("paymentMethod") ? 
        localStorage.getItem("paymentMethod") : '',
    },
    userInfo: localStorage.getItem("userInfo") ?
        JSON.parse(localStorage.getItem("userInfo")) : null
}
const reducer = (state, action) => {
    switch (action.type){
        case "CART_ADD_ITEM":
            const newItem = action.payload
            const existItem = state.cart.cartItems.find((x)=>
                x._id === newItem._id
            )
            const cartItems = existItem ? state.cart.cartItems.map((item) =>
                item._id === existItem._id ? newItem : item
            ) : [...state.cart.cartItems, newItem]
            localStorage.setItem("cartItems", JSON.stringify(cartItems))
            return {...state, cart:{...state.cart, cartItems}}
        case "CART_DELETE_ITEM":{
            const cartItems = state.cart.cartItems.filter(
                (item)=> item._id !== action.payload._id
            );
            return {...state, cart:{...state.cart, cartItems }}
        };
        case "SIGNIN_SUCCESS":
            return {...state, userInfo: action.payload}
        case "SIGNOUT_SUCCESS":
            return {...state, userInfo: null,
            cart: {
                cartItems: [],
                shippingAddress: {},
                paymentMethod: ''
            }}
        case "SAVE_SHIPPING_ADDRESS":
            return {...state, cart: {...state.cart, shippingAddress: action.payload}}
        case "SAVE_PAYMENT_METHOD":
            return {...state, cart: {...state.cart, paymentMethod: action.payload}}
        case "CART_CLEAR":
            return {...state, cart: {...state.cart, cartItems: []}}
        default:
            return state
    }
}
export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const value = {state, dispatch}
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}