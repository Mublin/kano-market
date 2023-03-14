import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutSteps } from "../components/CheckoutSteps";
import { Store } from "../Store";

function PaymentMethodScreen() {
    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {
        cart: {
            shippingAddress, paymentMethod, cartItems
        }
    } = state
    const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || "Paypal")
    const navigate = useNavigate()
    useEffect(()=>{
      if (!shippingAddress.address || !cartItems.length){
        navigate("/shipping");
      }
    },[shippingAddress, navigate])
    const submitHandler = (e)=>{
        e.preventDefault();
        ctxDispatch({type: "SAVE_PAYMENT_METHOD",
        payload: paymentMethodName    
        });
        localStorage.setItem("paymentMethod", paymentMethodName);
        navigate("/placeorder")
    }
    return (
        <section>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <div>
                <title>Payment Method</title>
            </div>
            <div>
                <h2>Payment Method</h2>
                <form onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="Paypal">
                            <input type={"radio"} name="options" id="Paypal"  value={"Paypal"} checked={paymentMethodName === "Paypal"} onChange={(e)=> setPaymentMethod(e.currentTarget.value)} /> Paypal
                        </label>
                    </div>
                    <div>
                        <label htmlFor="Stripe">
                            <input type={"radio"} name="options" id="Stripe" value={"Stripe"} checked={paymentMethodName === "Stripe"} onChange={(e)=> setPaymentMethod(e.currentTarget.value)} /> Stripe
                        </label>
                    </div>
                    <button type="submit">confirm</button>
                </form>
            </div>
        </section>
    )
}

export default PaymentMethodScreen;