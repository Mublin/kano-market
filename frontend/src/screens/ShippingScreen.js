import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutSteps } from "../components/CheckoutSteps";
import { Store } from "../Store";

function ShippingScreen(){
    const navigate = useNavigate()
    const {state, dispatch: ctxdispatch} = useContext(Store)
    const { userInfo, cart: {shippingAddress},} = state
    useEffect(()=>{
        if (!userInfo){
            navigate("/signin?redirect=/shipping")
        }
    },[userInfo, navigate])
    const [fullName, setFullName] = useState(shippingAddress.fullName || "");
    const [city, setCity] = useState("KANO");
    const [address, setAddress] = useState(shippingAddress.address || "");
    const submitHandler = (e) =>{
        e.preventDefault();
        ctxdispatch({type: "SAVE_SHIPPING_ADDRESS",
        payload: {
            fullName,
            city,
            address
        }})
        localStorage.setItem("shippingAddress",
        JSON.stringify({
            fullName,
            address,
            city
        }))
        navigate("/payment");    
    }
    return(
        <section>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <div className="container">
                <div className="forms">    
                    <form onSubmit={submitHandler}>
                    <h2>Shipping Address</h2>
                        <div className="inputs">
                            <label>Full Name:</label>
                            <input required name="fullName" type="text" value={fullName} aria-required onChange={(e)=> setFullName(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >City:</label>
                            <input required name="city" type="text" value={city} aria-required onChange={(e)=> setCity(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >Address:</label>
                            <input required name="address" type="text" aria-required value={address} onChange={(e)=> setAddress(e.target.value)} />
                        </div>
                        <button type="submit">Next</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ShippingScreen;