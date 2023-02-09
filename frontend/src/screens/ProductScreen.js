import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify"
import { Link } from "react-router-dom";
import { Ratings } from "../components/Ratings";
import { Store } from "../Store";

const reducer = (state, action)=>{
    switch (action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, loading: false, products: action.payload}
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}
        default:
            return state;
    }
}

function ProductScreen (){
    const [{loading, products, error}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        products: []
    })
    useEffect(()=>{
        const fetchProducts = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const {data} = await axios.get(`http://localhost:4550/api/allproducts`)
                dispatch({type: "FETCH_SUCCESS", payload: data})
            } catch (error) {
                dispatch({type: "FETCH_FAIL", payload: error.message})
            }
        }
        fetchProducts()
    },[])
    const {state, dispatch: ctxDispatch} = useContext(Store)
    const { cart } = state
    const addToCartHandler = async (item)=>{
        const existItem = cart.cartItems.find((x)=> x._id == item._id)
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`http://localhost:4550/api/product/${item._id}`)
        if(data.inStock < quantity){
            toast.error("Sorry, Product is out of stock")
            return;
        }
        ctxDispatch({type: "CART_ADD_ITEM", payload: {...item, quantity}})
    }
    const outStockHandler = () =>{
        toast.error("Sorry, Product is out of stock")
        return;
    }
  return(
    <div>
        <section></section>
        <section className="featured">
            <h3>All Products</h3>
            <div className="f-product">
            {
                products.map(item =>{
                    return (
                            <div className="product" key={item._id}>
                                <Link to={`/product/${item._id}`} className="product-link">
                                <div className="p-img">
                                    <img src={item.img} alt="item picture" />
                                </div>
                                <div>
                                    <h3>{item.name}</h3>
                                    <p className="price">NGN{item.price}</p>
                                    <p><span>{item.ratings}</span></p>
                                    <p className="brand">{item.name}</p>
                                    <Ratings ratings={item.ratings}></Ratings>
                                </div>
                                </Link>
                                <div className="cart-add">
                                {item.inStock === 0 ? <button className="action" onClick={outStockHandler}>Out Of Stock</button> : <button className="action" onClick={()=>addToCartHandler(item)}>Add to Cart</button>}
                                </div>
                            </div>
                    )
                }
                )
            }
            </div>
        </section>
    </div>
  )  
}


export default ProductScreen;