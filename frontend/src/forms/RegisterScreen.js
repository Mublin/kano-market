import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";

function RegisterScreen(){
    const {search} = useLocation()
    const redirectUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectUrl ? redirectUrl : '/'
    const {state, dispatch: ctxDispatch} = useContext(Store)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [cPassword, setCPassword] = useState('')
    const navigate = useNavigate()
    const submitHandler = async (e) =>{
        e.preventDefault()
        if (password.length > 3 && password === cPassword) {
            try {
                const {data} = await axios.post(`/api/users/register`, {
                    name,
                    email,
                    password
                })
                ctxDispatch({type: "SIGNIN_SUCCESS", payload: data})
                localStorage.setItem("userInfo", JSON.stringify(data))
                navigate(redirect)
            } catch (error) {
                toast.error(getError(error.message))
            }
        } else {
            toast.error("password are not the same")
        }
        
    }
    return(
        <section>
            <div className="container">
                <div className="forms">
                    <form onSubmit={submitHandler}>
                        <div className="inputs">
                            <label>Name:</label>
                            <input aria-required name="name" type="text" onChange={(e)=>{setName(e.target.value)}}/>
                        </div>
                        <div className="inputs">
                            <label >Email:</label>
                            <input aria-required name="email" type="email" onChange={(e)=>{setEmail(e.target.value)}}/>
                        </div>
                        <div className="inputs">
                            <label >Password:</label>
                            <input aria-required name="password" type="password" onChange={(e)=>{setPassword(e.target.value)}}/>
                        </div>
                        <div className="inputs">
                            <label >Confirm Password:</label>
                            <input aria-required name="c-password" type="password" onChange={(e)=>{setCPassword(e.target.value)}}/>
                        </div>
                        <button type="submit">Register</button>
                        <div className="inputs">
                            <p>Already a Customer? <Link to={"/signin"}>Sign-In</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default RegisterScreen;