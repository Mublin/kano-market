import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import Chart from 'react-google-charts';
import { getError } from "../utils";

const reducer = (state, action) =>{
    switch (action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}
        case "FETCH_SUCCESS":
            return {...state, loading: false, summary: action.payload}
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}
        default:
            return state
    }
}
function DashboardScreen() {
    const [{loading, error, summary}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    })
    const {state} = useContext(Store);
    const {userInfo} = state;
    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                dispatch({type: "FETCH_REQUEST"})
                const {data} = await axios.get(`/api/orders/summary`, {
                    headers: {Authorization: `Bearer ${userInfo.token}`}
                })
                dispatch({type: "FETCH_SUCCESS", payload : data})
                // console.log(data)
            } catch (error) {
                dispatch({type: "FETCH_FAIL", payload: getError(error)})
            }
        }
        fetchData()
    },[userInfo])
    console.log(summary)
    return (
        <section>
            <h2>Dashboard</h2>
            {loading ? <div>loading...</div> : error ? <div></div> : (
                <div>
                <div className="dashboard-cont">
                    <div>
                        {loading ? <div>loading....</div> : error ? <div>{error.message}</div> : (
                            <div className="dash tuser">
                            <h3> {summary.users && summary.users[0]
                      ? summary.users[0].numUser
                      : 0}</h3>
                            <p> Users</p>
                        </div>
                        )}
                        
                        {loading ? <div>loading....</div> : error ? <div>{error.message}</div> : (
                            <div className="dash tuser">
                            <h3> {summary.dailyOrders && summary.dailyOrders[0]
                      ? summary.dailyOrders[0].orders
                      : 0}</h3>
                            <p> Orders</p>
                        </div>
                        )}
                        {loading ? <div>loading....</div> : error ? <div>{error.message}</div> : (
                            <div className="dash tuser">
                            <h3>NGN{summary.dailyOrders && summary.dailyOrders[0]
                      ? summary.dailyOrders[0].sales
                      : 0}</h3>
                            <p> Total Cost</p>
                        </div>
                        )}
                    </div>
                </div>
                <div className="sales-cont">
                    <h2>Sales</h2>
                    {summary.dailyOrders.length === 0 ? (
              <h2>No Sale</h2>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>)}
                </div>
                <div className="categories-cont">
                    <h2>Categories</h2>
                    {summary.productCategories.length === 0 ? (
              <h2>No Category</h2>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
                </div>
            </div>
            )}
        </section>
    )
}
export default DashboardScreen;