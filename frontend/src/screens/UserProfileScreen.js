import axios from "axios";
import React, { useContext, useReducer, useState } from "react";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
const reducer = (state, action) =>{
    switch (action.type) {
        
        case "FETCH_REQUEST":
            return {...state, loadingUpdate: true}
            case "FETCH_FAIL":
                return {...state, loadingUpdate: false}
                case "FETCH_SUCCESS":
                    return {...state, loadingUpdate: false}
        default:
            return state
    }
}
function UserProfile(){
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state
    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState("")
    const [profile, setProfile] = useState("")
    const [cPassword, setCPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [{}, dispatch] = useReducer(reducer, {})
    const submitHandler = async (e) =>{
        e.preventDefault();
        try {
            dispatch({type:"FETCH_REQUEST"})
            if (newPassword !== cPassword) {
                return toast.error("New password does not match")
            }
            const {data} = await axios.put(`/api/users/profile`, {
                name,
                email,
                password,
                newPassword,
                profile
            },{
                headers : {Authorization: `Bearer ${userInfo.token}`}
            })
            dispatch({
                type: "FETCH_SUCCESS"
            })
            ctxDispatch({type: "USER_SIGNIN", payload: data})
            localStorage.setItem("userInfo", JSON.stringify(data))
            toast.success("User updated successful")
        } catch (error) {
            dispatch({type: "FETCH_FAIL",})
            toast.error(getError(error))
        }
    }
    return(
        <section>
            <div className="container user">
                <div className="forms">
                    <form onSubmit={submitHandler}>
                    <div className="inputs">
                            <label>Profile Picture:</label>
                            <input name="profile-pic" type="file" accept="image/*" onChange={(e)=> setProfile(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label>Name:</label>
                            <input required name="name" defaultValue={userInfo.name} type="text" onChange={(e)=> setName(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label>Email:</label>
                            <input required name="email" defaultValue={userInfo.email} type="email" onChange={(e)=> setEmail(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >Password:</label>
                            <input required name="password" defaultValue={""} type="password" placeholder="" onChange={(e)=> setPassword(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >New Password:</label>
                            <input required minLength={4} name="new-password" type="password" placeholder="" onChange={(e)=> setNewPassword(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >Confirm Password:</label>
                            <input required minLength={4} name="c-password" type="password" onChange={(e)=> setCPassword(e.target.value)} />
                        </div>
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default UserProfile;