import React, { useContext, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { Ratings } from "../components/Ratings";
import { toast } from "react-toastify";
import project from "./project.png"

const reducer = (state, action) =>{
    switch (action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true}
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}
        case "FETCH_SUCCESS":
            return {...state, loading: false, products: action.payload}
        default:
            return state;
    }
}
function HomeScreen (){
    const [{loading, error, products}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        products: []
    })
    useEffect(()=>{
        const fetchFProducts= async () =>{
            dispatch({type: "FETCH_REQUEST"})
            try {
                const { data } = await axios.get(`/api/featuredproduct`)
                dispatch({type: "FETCH_SUCCESS", payload: data})
            } catch (error) {
                dispatch({type: "FETCH_FAIL", payload: "Not reachable"})
            }
        }
        fetchFProducts()
    },[])
    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {cart} = state
    const addToCartHandler = async (item)=>{
        const existItem = cart.cartItems.find((x)=> x._id == item._id)
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/product/${item._id}`)
        if(data.inStock < quantity){
            window.alert("Sorry, Product is out of stock")
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
            <section className="featured">
                <div className="banner-cont">
                    <img className="banner" src={project} alt="item picture" style={{  height: "90vh", width: "100vw"}}/>
                    <button className="action banner-action">Explore Now&#8594;</button>
                </div>
                <h3 className="head">Featured Products</h3>
                <div className="f-product">
                {
                    products.map(item =>{
                        return (
                                <div className="product" key={item._id}>
                                    <Link to={`/product/${item._id}`} className="product-link">
                                    <div className="p-img">
                                        <img src={item.img} alt="item picture" />
                                    </div>
                                    <div className="items">
                                        <h3>{item.name}</h3>
                                        <p><span>{item.ratings}</span></p>
                                        <p className="brand">{item.name}</p>
                                        <Ratings ratings={item.ratings}></Ratings>
                                    </div>
                                    </Link>
                                    <div className="cart-add">
                                        <p className="price">NGN{item.price}</p>
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


export default HomeScreen;