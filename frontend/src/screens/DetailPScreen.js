import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify"
import { Ratings } from "../components/Ratings";
import { Store } from "../Store";

const reducer = (state, action)=>{
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true}
        case "FETCH_SUCCESS":
            return {...state, loading: false, product: action.payload}
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}
        default:
            return state;
    }
}
function DetailPscreen (){
    const [{loading, product, error}, dispatch] = useReducer(reducer, {
        loading: true,
        product: {},
        error: ''
    })
    const { _id } = useParams()
    useEffect(()=>{
        const fetchProduct = async ()=>{
            dispatch({type: "FETCH_REQUEST"})
            try {
                const { data } = await axios.get(`http://localhost:4550/api/product/${_id}`);
                dispatch({type: "FETCH_SUCCESS", payload: data})
            } catch (error) {
                dispatch({type: "FETCH_FAIL", payload: error.message})
            }
        }
        fetchProduct();
    },[product._id])
    const {state, dispatch: ctxDispatch} = useContext(Store)
    const { cart } = state
    const addToCartHandler = async ()=>{
        const existItem = cart.cartItems.find((x)=> x._id == product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`http://localhost:4550/api/produc/${product._id}`)
        if (data.inStock < quantity) {
            toast.error("Product Out Of Stock")
            return;
        }
        ctxDispatch({type: "CART_ADD_ITEM", payload: {...product, quantity}})
    }
    const outStockHandler = () =>{
        toast.error("Sorry, Product is out of stock")
        return;
    }
  return(
    <div>
        <section></section>
        <section className="featured">
            <div className="f-product">
                            <div className="product">
                                <div className="p-img">
                                    <img src={product.img} alt="item picture" />
                                </div>
                                <div>
                                    <h3>{product.name}</h3>
                                    <p className="price">NGN{product.price}</p>
                                    <p><span>{product.ratings}</span></p>
                                    <p className="brand">{product.name}</p>
                                    <Ratings ratings={product.ratings}></Ratings>
                                </div>
                                <div className="cart-add">
                                {product.inStock === 0 ? <button className="action" onClick={outStockHandler}>Out Of Stock</button> : <button className="action" onClick={addToCartHandler}>Add to Cart</button>}
                                </div>
                            </div>
            </div>
        </section>
    </div>
  )  
}


export default DetailPscreen;