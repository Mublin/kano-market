import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";


export default function ProtectedRoute({children}){
    const {state} = useContext(Store)
    const {userInfo} = state
    const navigate = useNavigate()
    return userInfo ? children : navigate("/signin")
}