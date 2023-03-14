import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";

function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return {...state, loading: true, error: '' };
      case 'FETCH_SUCCESS':
        return {...state, loading: false, order: action.payload, error: '' };
      case 'FETCH_FAIL':
        return {...state, loading: false, error: action.payload };   
        case 'PAY_REQUEST':
          return {...state, loadingPay: true};
        case 'PAY_SUCCESS':
          return {...state, loadingPay: false, successPay: action.payload, error: '' };
        case 'PAY_FAIL':
          return {...state, loadingPay: false};
        case "PAY_RESET":
          return {...state, loadingPay: false, successPay: false}   
        default:
            return state;
        }
}
function OrderScreen() {
    const { state } = useContext(Store)
    const { userInfo } = state;
    const params = useParams();
    const {id : orderId } = params
    // console.log(orderId)
    const navigate = useNavigate()
    const [
        {
          loading,
          error,
          order,
          successPay,
          loadingPay
        },
        dispatch,
      ] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false
      });
      const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
      // console.log(order)

      function createOrder(data, actions) {
        return actions.order
        .create({
          purchase_units:[
            {
              amount: { value: order.totalPrice}
            }
          ]
        })
        .then((orderID)=>{
          return orderID;
        })
      }

      function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
         try {
          dispatch({type:"PAY_REQUEST"})
          const {data} = await axios.put(`/api/orders/${order._id}/pay`, details, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          })
          dispatch({type: "PAY_SUCCESS", payload: data})
          toast.success("Order is paid")
         } catch (error) {
          dispatch({type: "PAY_FAIL", payload: getError(error)})
         } 
        })
      }
      function onError(error) {
        toast.error(getError(error))
      }



    useEffect(() => {
        const fetchOrder = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/orders/${orderId}`, {
              headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
          }
        };
    
        if (!userInfo) {
          return navigate('/login');
        }
        if (
          !order._id || successPay ||
          (order._id && order._id !== orderId)
        ) {
          fetchOrder();
          if (successPay) {
            dispatch({ type: "PAY_RESET"})
          }
        } else{
          const loadPaypalScript = async () =>{
          const {data : clientId } = await axios.get(`/api/keys/paypal`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          paypalDispatch({
            type: 'resetOptions',
            value:{
              'client-id': clientId,
              currency: "USD"
            },
          })
          paypalDispatch({type: "setLoadingStatus", value: "pending"})
        }
        loadPaypalScript()
      }
      }, [
        order,
        navigate,
        userInfo,
        orderId,
        paypalDispatch,
        successPay
      ]);
      // console.log(order)
    return (
      <section>
            <div>
               {
                  loading ? 
                    <div>loading</div> : ( <div className="placeorder">
                      <div><div className="preview ship">
                        <h3>Shipping</h3>
                        <div>
                            <p><strong>Name: </strong>{order.shippingAddress.fullName}</p>
                            <p><strong>Address: </strong>{order.shippingAddress.address}</p>
                        </div>
                        <div>
                        {order.deliveredAt ? <button>Paid At: {order.deliveredAt}</button>: <button>Not Delivered</button>}
                        </div>
                    </div>
                    <div className="preview pay">
                        <h3>Payment</h3>
                        <div>
                        <p><strong>Method: </strong>{order.paymentMethod}</p>
                        </div>
                        <div>
                        {order.isPaid ? <button>Paid At: {order.paidAt}</button>: <button>Not Paid</button>}
                        </div>
                    </div>
                    <div className="preview items">
                        <h3>Items</h3>
                        <div className="cart-info">
                            <div className="cart-items">
                                {order.orderItems.map((item)=>{
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
                                            <h4>NGN{item.price}</h4>
                                        </div>                      
                                    </div>  )
                                })
                                }
                            </div>
                        </div>
                        </div>
                  </div>
                  <div>
                <div className="cart-subtotal preview order">
                        <h4>Number of items: {order.orderItems.reduce((a,c)=> a+ c.quantity, 0)}</h4>
                        <h4>Number of items: NGN{order.itemsPrice}</h4>
                        <h4>Shipping: NGN{order.shippingPrice}</h4>
                        <h4>Tax Price: NGN{order.taxPrice}</h4>
                        <h4>Total: NGN{order.totalPrice}</h4>
                        <div>
                          <button>SIUUUUUUUUUUUUUUUUUUUUUUUUU</button>
                        </div>
                    </div>
                      {!order.isPaid && (<div>
                        { isPending ? (
                          <div>loading...</div>
                        ) : (
                          <div>
                            <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}></PayPalButtons>
                          </div>
                        )}
                        {loadingPay && <p>loading...</p>}
                      </div>
                      )} 

                </div>
                </div>)}
            </div>
        </section>
    )
}

export default OrderScreen