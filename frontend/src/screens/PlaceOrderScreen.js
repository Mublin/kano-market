import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckoutSteps } from "../components/CheckoutSteps";
import { Store } from "../Store";
import { getError } from "../utils";


const reducer = (state, action) => {
    switch (action.type) {
      case 'CREATE_REQUEST':
        return { ...state, loading: true };
      case 'CREATE_SUCCESS':
        return { ...state, loading: false };
      case 'CREATE_FAIL':
        return { ...state, loading: false };
      default:
        return state;
    }
  };
function PlaceOrderScreen() {
    const navigate = useNavigate()
    const [{loading}, dispatch] = useReducer(reducer, {
        loading: false,
    })


    const {state, dispatch: ctxDispatch} = useContext(Store)
    const { cart, userInfo } = state


    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.45678 => 123.46
    cart.itemsPrice = cart.cartItems.reduce((a, c)=> a + (Number(c.price) * c.quantity), 0)
    cart.shippingPrice = cart.itemsPrice > 60000 ? round2(700) : round2(2000);
    cart.taxPrice = round2(0.15 * cart.itemsPrice)
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice 


    const placeOrderHandler = async () =>{
        console.log(cart.itemsPrice)
         try {
            dispatch({type: "CREATE_REQUEST"})
            const {data} = await axios.post(`http://localhost:4550/api/orders`, {
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            },
            {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            ctxDispatch({ type: "CART_CLEAR"})
            dispatch({ type: "CREATE_SUCCESS"})
            localStorage.removeItem("cartItems");
            navigate(`/order/${data.order._id}`)
         } catch (error) {
            dispatch({ type: "CREATE_FAIL"})
            toast.error(getError(error))
         }
    }
    console.log({loading})
    useEffect(()=>{
        if (!cart.paymentMethod || cart.cartItems.length === 0 || cart.shippingAddress === {}){
            navigate("/payment")
        }
    },[cart, navigate])
    return(
        <section>
             <div>
                <title>Place Order</title>
                <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            </div>
            <div className="placeorder">
                <div>
                    <div className="preview ship">
                        <h3>Shipping</h3>
                        <div>
                            <p><strong>Name: </strong>{cart.shippingAddress.fullName}</p>
                            <p><strong>Address: </strong>{cart.shippingAddress.address}</p>
                        </div>
                        <div>
                            <h4><Link to={"/shipping"}>Edit</Link></h4>
                        </div>
                    </div>
                    <div className="preview pay">
                        <h3>Payment</h3>
                        <div>
                        <p><strong>Method: </strong>{cart.paymentMethod}</p>
                        </div>
                        <div>
                            <h4><Link to={"/payment"}>Edit</Link></h4>
                        </div>
                    </div>
                    <div className="preview items">
                        <h3>Items</h3>
                        <div className="cart-info">
                            <div className="cart-items">
                                {cart.cartItems.map((item)=>{
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
                                            <h4>{item.quantity}</h4>
                                        </div>
                                        <div>
                                            <h4>{item.price}</h4>
                                        </div>                      
                                    </div>  )
                                })
                                }
                            </div>
                        </div>
                        <h4><Link to={"/products/cart"}>Edit</Link></h4>
                        </div>
                </div>
                <div>
                <div className="cart-subtotal preview order">
                        <h4>Number of items: {cart.cartItems.reduce((a,c)=> a+ c.quantity, 0)}</h4>
                        <h4>Items-subtotal: NGN{cart.itemsPrice.toFixed(2)}</h4>
                        <h4>Shipping: NGN{cart.shippingPrice.toFixed(2)}</h4>
                        <h4>Tax Price: NGN{cart.taxPrice.toFixed(2)}</h4>
                        <h4>Total: NGN{cart.totalPrice.toFixed(2)}</h4>
                    </div>
                    <div className="order-button">
                <button className="action" onClick={placeOrderHandler}>Place Order</button>
            </div>
                </div>
            </div>
           
        </section>
    )
}

export default PlaceOrderScreen;