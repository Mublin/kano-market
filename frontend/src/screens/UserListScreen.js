import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logger from "use-reducer-logger";
import { Store } from "../Store";
import { getError } from "../utils";



const reducer = (state, action)=>{
    switch (action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}
        case "FETCH_SUCCESS":
            return {...state, loading: false, users: action.payload}
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}
        case "DELETE_REQUEST":
            return {...state, loadingDelete: true}
        case "DELETE_SUCCESS":
            return {...state, loadingDelete: false, successDelete: true}
        case "DELETE_FAIL":
            return {...state, loadingDelete: false, errorDelete: action.payload}
        case "DELETE_RESET":
            return {...state, loadingDelete: false, successDelete: false}              
        default:
            return state
    }
}
function UserListScreen() {
    const {state} = useContext(Store)
    const {userInfo} = state
    const navigate = useNavigate()
    const [{loading, error, users, loadingDelete, successDelete, errorDelete}, dispatch] = useReducer(logger(reducer), {
        loading: true,
        error: "",
        users: []
    })
    useEffect(()=>{
        const fetchData = async ()=>{
            dispatch({type: "FETCH_REQUEST"})
            try {
                const {data} = await axios.get(`http://localhost:4550/api/users`, {
                    headers : {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                })
                // console.log(data)
                dispatch({type: "FETCH_SUCCESS", payload: data})
            } catch (error) {
                toast.error(getError(error))
                dispatch({type: "FETCH_FAIL"})
            }
        }
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
          } else {
            fetchData();
          }
    },[userInfo, successDelete])

    const deleteHandler = async (user) => {
        if (window.confirm('Are you sure to delete?')) {
          try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`http://localhost:4550/api/users/${user._id}`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            toast.success('user deleted successfully');
            dispatch({ type: 'DELETE_SUCCESS' });
          } catch (error) {
            toast.error(getError(error));
            dispatch({
              type: 'DELETE_FAIL', payload: getError(error)
            });
          }
        }
      };


    return(
        <section>
            <div className="small">
                <h2>Users</h2>
                {loading ? <div>loading...</div> :(
                    <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>IS ADMIN</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((x)=>(
                            <tr key={x._id}>
                                <td>{x._id}</td>
                                <td>{x.name}</td>
                                <td>{x.email}</td>
                                <td>{x.isAdmin ? "YES" : "NO"}</td>
                                <td><button className="action" onClick={()=>{ navigate(`/admin/users/${x._id}`)}}>Edit</button><button className="action" onClick={()=>{deleteHandler(x)}}>Delete</button></td>
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


export default UserListScreen;