import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";


export default function AdminRoute({children}){
    const {state} = useContext(Store)
    const {userInfo} = state
    const navigate = useNavigate()
    return userInfo && userInfo.isAdmin ? children : navigate("/signin")
}