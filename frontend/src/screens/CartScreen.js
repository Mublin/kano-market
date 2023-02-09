import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";

function CartScreen(){
    const {state, dispatch: ctxdispatch} = useContext(Store)
    const {cart: {cartItems}, userInfo} = state
    // const item = async () =>{
    //     dispatch({type: "FETCH_REQUEST"})
    //     try {
    //         const { data } = await axios.get(`http://localhost:4550/api/featuredproduct`)
    //         dispatch({type: "FETCH_SUCCESS", payload: data})
    //     } catch (error) {
    //         dispatch({type: "FETCH_FAIL", payload: "Not reachable"})
    //     }
    // }
    // fetchFProducts()
    const navigate = useNavigate()
    const updateCartHandler = async (item, quantity) =>{
    const {data} = await axios.get(`http://localhost:4550/api/product/${item._id}`)
    if(data.inStock < quantity){
        toast.error("Sorry, Product is out of stock")
        return;
    }
    ctxdispatch({type: "CART_ADD_ITEM", payload: {...item, quantity}})
    }
    const removeItemHandler = (item) =>{
        ctxdispatch({type: "CART_DELETE_ITEM", payload: item})
    }
    const checkOutHandler = () =>{
        if (userInfo){
            navigate("/shipping")
        } else{
            navigate("/signin?redirect=/shipping")
        }
    }
    return(
        <section>
            <div className="container-cart">
                <div className="cart-header">
                    <h2>Cart Items</h2>
                </div>
                { cartItems.length > 0 ? (
                <div className="cart-info">
                    <div className="cart-items">
                        { cartItems.map((item)=>{
                            return (<div className="cart-detail" key={item._id}>
                                <div className="item-detail">
                                    <div className="item-img">
                                        <img src={item.img} alt="item img" />
                                    </div>
                                    <div className="detail">
                                        <Link to={`/product/${item._id}`}><h5>{item.name}</h5></Link>
                                    </div>
                                </div>
                                <div className="add-subt">
                                    {item.quantity === 1 ? <i className="fas fa-minus-circle grey"></i>: <i className="fas fa-minus-circle" onClick={()=>updateCartHandler(item, item.quantity - 1)}></i>}
                                    <h5>{item.quantity}</h5>
                                    {item.quantity === item.inStock ? <i className="fas fa-plus-circle grey"></i>: <i className="fas fa-plus-circle" onClick={()=>updateCartHandler(item, item.quantity + 1)}></i>}
                                </div>
                                <div>
                                    <h4>NGN{item.price}</h4>
                                </div>
                                <div className="remove-cart">
                                    <i className="fas fa-trash" onClick={()=>removeItemHandler(item)}></i>
                                </div>                       
                            </div>  )
                        })
                        }
                    </div>
                    <div className="cart-subtotal">
                        <h4>Number of items: {cartItems.reduce((a,c)=> a+ c.quantity, 0)}</h4>
                        <h4>Note transport fee not included</h4>
                        <h4>Subtotal: NGN{cartItems.reduce((a,c)=> a + c.quantity *  Number(c.price), 0).toFixed(2)}</h4>
                    </div>
                </div>): (<div className="cart-empty">
                    <p>Cart is empty <Link to={"/"} className="empty-cart">Go Shopping</Link></p>
                </div>)}
                { cartItems.length === 0 ? ('') : <div className="item-confirmed">
                    <button className="button action" onClick={checkOutHandler}>Confirm Items</button>
                </div>}
            </div>
        </section>
    )
}

export default CartScreen;