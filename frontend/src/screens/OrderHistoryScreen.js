import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../utils";
function reducer(action, state) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}
        case "FETCH_SUCCESS":
            return {...state, loading: false, orders: action.payload}
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}
        default:
            return state
    }
}

function OrderHistoryScreen() {
    const {state} = useContext(Store)
    const {userInfo} = state;
    const navigate = useNavigate()

    const [{loading, error, orders}, dispatch] = useReducer(reducer,{
        loading: true,
        orders: [],
        error: ''
    })
    useEffect(()=>{
        const fetchData = async () =>{
            dispatch({ type: "FETCH_REQUEST"})
            try {
                const {data} = await axios.get(`/api/orders/mine`, {
                    headers : { Authorization: `Bearer ${userInfo.token}`}
                })
                dispatch({ type: `FETCH_SUCCESS`, payload: data})
            } catch (error) {
                dispatch({
                    type: `FETCH_FAIL`,
                    payload: getError(error)
                })
            }
        }
        fetchData()
    },[userInfo])
    return(
        <section>
            <div className="small">
                <h2>Order History</h2>
                {loading ? <div>loading...</div> :(
                    <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
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
                                <td>{x.createdAt.substring(0, 10)}</td>
                                <td>NGN{x.totalPrice.toFixed(2)}</td>
                                <td>{x.isPaid ? x.paidAt.substring(0, 10) : 'No'}</td>
                                <td>{x.isDelivered ? x.deliveredAt.substring(0, 10) : 'No'}</td>
                                <td><button className="action" onClick={()=>{ navigate(`/order/${x._id}`)}}>Details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )
                }
                
            </div>
        </section>
    )
}

export default OrderHistoryScreen;