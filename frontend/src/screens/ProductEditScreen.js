import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logger from "use-reducer-logger"
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) =>{
    switch (action.type) {
        case 'FETCH_REQUEST':
          return { ...state, loading: true };
        case 'FETCH_SUCCESS':
          return { ...state, loading: false };
        case 'FETCH_FAIL':
          return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
          return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
          return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
          return { ...state, loadingUpdate: false };
        case 'UPLOAD_REQUEST':
          return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
          return {
            ...state,
            loadingUpload: false,
            errorUpload: '',
          };
        case 'UPLOAD_FAIL':
          return { ...state, loadingUpload: false, errorUpload: action.payload };
        default:
            return state
    }
}

function ProductEditScreen() {
    const { id } = useParams()
    const navigate = useNavigate()
    const {state} = useContext(Store)
    const {userInfo} = state

    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(logger(reducer), {
    //   loading: true,
      error: '',
    //   loadingUpdate: true,
    });

    const [name, setName] = useState("")
    const [img, setImg] = useState("")
    const [images, setImages] = useState([])
    const [price, setPrice] = useState("")
    const [inStock, setInstock] = useState("")
    // const [ra, setName] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                dispatch({ type: 'FETCH_REQUEST' })
                const {data} = await axios.get(`/api/admin/product/${id}`, {
                    headers : {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                })
                setName(data.name)
                setImg(data.img)
                setInstock(data.inStock)
                setImages(data.images)
                setPrice(data.price)
                setCategory(data.category)
                setDescription(data.description)
                dispatch({ type: 'FETCH_SUCCESS' });
            } catch (error) {
                dispatch({ type: "FETCH_FAIL", payload: toast.error(getError(error))})
            }
        }
        fetchData()
    },[id])
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        dispatch({ type: 'UPLOAD_REQUEST' });
        try {
          
          const { data } = await axios.post('/api/upload', bodyFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: `Bearer ${userInfo.token}`,
            },
          });
          console.log(state)
          dispatch({ type: 'UPLOAD_SUCCESS' });
    
          toast.success('Image uploaded successfully');
          setImg(data.secure_url);
        } catch (err) {
          toast.error(getError(err));
          dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
        }
      };
    const submitHandler = async (e) =>{
        e.preventDefault();
        try {
            dispatch({type: "UPDATE_REQUEST"})
            const {data} = await axios.put(`/api/product/${id}`, {
                name,
                img,
                images,
                inStock,
                price,
                category,
                description
            },{
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch({type: "UPDATE_SUCCESS"})
            toast.success("Product Successfully updated")
            navigate("/admin/products")
        } catch (error) {
            toast.error(getError(error))
            dispatch({
                type: "UPDATE_FAIL"
            })
        }
    }
    console.log(state)
    return(
        <section>
            <div className="container">
                {loading ? <div className="forms">loading...</div> :(
                    <div className="forms">
                    <form onSubmit={submitHandler}>
                        <h2>Product Update</h2>
                        <div className="inputs">
                            <label>Name:</label>
                            <input required name="name" id="name" type="text" value={name} onChange={(e)=> setName(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >Price:</label>
                            <input required name="price" id="price" type="number" value={price} onChange={(e)=> setPrice(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >Image File:</label>
                            <input name="img-uri" value={img} id="img-uri" onChange={(e) => setImg(e.target.value)} />
                            {loadingUpload && <div>loading...</div>}
                        </div>
                        {!loadingUpload && <div className="inputs">
                            <label >Upload Image:</label>
                            <input name="img" type="file" accept="image/*" onChange={uploadFileHandler} />
                            {loadingUpload && <div>loading...</div>}
                        </div>}
                        
                        <div className="inputs">
                            <label >InStock:</label>
                            <input required name="instock" id="inStock" type="number" value={inStock} onChange={(e)=> setInstock(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >Category:</label>
                            <input required name="category" type="text" id="category" value={category} onChange={(e)=> setCategory(e.target.value)} />
                        </div>
                        <div className="inputs">
                            <label >Description:</label>
                            <textarea name="description" type="text" id="description" value={description} onChange={(e)=> setDescription(e.target.value)} />
                        </div>
                        {!loadingUpload ? <button type="submit">Update Details</button> : (<div><p>Please wait...</p></div>)}
                    </form>
                </div>
                )}
            
            </div>
        </section>
    )
}


export default ProductEditScreen;