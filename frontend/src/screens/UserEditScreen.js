import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (action, state) =>{
    switch (action.type) {
        case 'FETCH_REQUEST':
          return { ...state, loading: true };
        case 'FETCH_SUCCESS':
          return { ...state, loading: false };
        case 'FETCH_FAIL':
          return { ...state, loading: false, error: action.payload };
        case "UPDATE_REQUEST":
            return {...state, loadingUpdate: true}
        case "UPDATE_SUCCESS":
            return {...state, loadingUpdate: false}
        case "UPDATE_FAIL":
            return {...state, loadingUpdate: false}
        default:
            return state;
    }
}
function UserEditScreen() {
    const { id: userId } = useParams()
    const navigate = useNavigate()
    const {state} = useContext(Store)
    const {userInfo} = state
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [isAdmin, setIsAdmin] = useState(false)
    


    const [{loading, error, loadingUpdate}, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })



    useEffect(()=>{
        const fetchData = async () =>{
            try {
                dispatch({type: "FETCH_REQUEST"})
                const {data} = await axios.get(`/api/users/admin/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                })
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin)
                dispatch({type: "FETCH_SUCCESS"})
            } catch (error) {
                toast.error(getError(error))
                dispatch({type: "FETCH_FAIL", payload: getError(error)})
            }
        }
        fetchData()
    },[userId, userInfo])
    const submitHandler = async (e)=>{
        e.preventDefault();
        try {
            dispatch({type: "UPDATE_REQUEST"})
            const {data} = await axios.put(`/api/users/admin/user/${userId}`, {
                name,
                email,
                isAdmin
            }, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch({
                type: 'UPDATE_SUCCESS',
              });
            toast.success(data.message)
            navigate('/admin/users');
        } catch (error) {
            toast.error(getError(error))
            dispatch({type: "UPDATE_FAIL"})
        }
    }
    return(
        <section>
            <div>
            {loading ? <div className="forms">loading...</div> :(
                    <div className="forms">
                    <form onSubmit={submitHandler}>
                        <h2>User Update</h2>
                        <div className="inputs">
                            <label>Name:</label>
                            <input required name="name" id="name" type="text" value={name} onChange={(e)=> setName(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >Email:</label>
                            <input required name="email" type="email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >isAdmin:</label>
                            <input name="isAdmin" type="checkbox" checked={isAdmin} onChange={(e)=> setIsAdmin(e.target.checked)} />
                        </div>
                        {!loadingUpdate && <button type="submit">Update Details</button>}
                    </form>
                </div>
                )}
            </div>
        </section>
    )
}



export default UserEditScreen;