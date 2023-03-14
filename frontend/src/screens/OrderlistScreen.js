import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";



const reducer = (state, action)=>{
    switch (action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}
        case "FETCH_SUCCESS":
            return {...state, loading: false, orders: action.payload.orders, page: action.payload.page, pages: action.payload.pages}
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}    
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
                };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };

        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state
    }
}
function OrderListScreen() {
    const [{loading, error, orders, pages, loadingDelete, successDelete}, dispatch ] = useReducer(reducer, {
        loading: true,
        error: "",
        orders: []
    })
    const navigate = useNavigate(   )
    const {state} = useContext(Store)
    const {userInfo} = state
    const {search, pathname} = useLocation()
    const sp = new URLSearchParams(search)
    const page = sp.get("page") || 1 
    useEffect(()=>{
        const fetchData = async ()=>{
            dispatch({type: "FETCH_REQUEST"})
            try {
                const {data} = await axios.get(`/api/orders/admin?page=${page}`, {
                    headers : {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                })
                dispatch({type: "FETCH_SUCCESS", payload: data})
            } catch (error) {
                dispatch({type: "FETCH_FAIL", payload: getError(error)})
            }
        }
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
          } else {
            fetchData();
          }
    },[page, userInfo, successDelete])

    const deleteHandler = async (order) => {
        if (window.confirm('Are you sure to delete?')) {
          try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`/api/orders/${order._id}`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            toast.success('order deleted successfully');
            dispatch({ type: 'DELETE_SUCCESS' });
          } catch (err) {
            toast.error(getError(error));
            dispatch({
              type: 'DELETE_FAIL',
            });
          }
        }
      };



    return(
        <section>
            <div className="small">
                <div>
                    <h2>Orders</h2>
                    <button className="action" onClick={()=>{ navigate("/")}}>Create Order</button>
                </div>
                <div>
                {loading ? <div>loading...</div> :(
                    <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((x)=>(
                            <tr key={x._id}>
                                <td>{x._id}</td>
                                <td>{x.user ? x.user.name : "DELETED USER"}</td>
                                <td>{x.createdAt.substring(0, 10)}</td>
                                <td>{x.totalPrice.toFixed(2)}</td>
                                <td>{x.isPaid ? x.paidAt.substring(0, 10) : 'No'}</td>
                                <td>
                                {x.isDelivered
                                    ? x.deliveredAt.substring(0, 10)
                                    : 'No'}
                                </td>
                                <td><button className="action" onClick={()=>{ navigate(`/order/${x._id}`)}}>Edit</button><button className="action" onClick={()=>{ deleteHandler(x)}}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )
                }
                {[...Array(pages).keys()].map((x)=>(
                    <Link
                    className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
                    key={x + 1}
                    to={`/admin/orders?page=${x + 1}`}>{x + 1}</Link>
                ))}
            </div>
            </div>
        </section>
    )
}


export default OrderListScreen;