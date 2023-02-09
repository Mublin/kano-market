import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";

function SignInScreen(){
    const navigate = useNavigate()
    const {search} = useLocation()
    const redirectUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectUrl ? redirectUrl : '/'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {state, dispatch: ctxdispatch} = useContext(Store)
    const {userInfo} = state
    const submitHandler = async(e) =>{
        e.preventDefault();
        try {
            const {data} = await axios.post(`http://localhost:4550/api/users/signin`, {
                email,
                password
            })
            ctxdispatch({type: "SIGNIN_SUCCESS", payload: data})
            localStorage.setItem("userInfo", JSON.stringify(data))
            navigate(redirect || '/')
        } catch (error) {
            toast.error(getError(error))
        }
    }
    
    useEffect(()=>{
        if(userInfo){
            navigate("/")
        }
    },[navigate, userInfo, redirect])
    return(
        <section>
            <div className="container">
                <div className="forms">
                    <form onSubmit={submitHandler}>
                        <div className="inputs">
                            <label>Email:</label>
                            <input required name="email" type="email" autoComplete="" onChange={(e)=> setEmail(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >Password:</label>
                            <input required name="password" type="password" onChange={(e)=> setPassword(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <p>New Customer? <Link to={`/register?redirect=${redirect}`}>Register here</Link></p>
                        </div>
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default SignInScreen;