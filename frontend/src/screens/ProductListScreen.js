import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";



const reducer = (state, action)=>{
    switch (action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}
        case "FETCH_SUCCESS":
            return {...state, loading: false, products: action.payload.products, page: action.payload.page, pages: action.payload.pages}
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}
            case 'CREATE_REQUEST':
                return { ...state, loadingCreate: true };
              case 'CREATE_SUCCESS':
                return {
                  ...state,
                  loadingCreate: false,
                };
                case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
              case 'CREATE_FAIL':
                return { ...state, loadingCreate: false };
        default:
            return state
    }
}
function ProductListScreen() {
    const [{loading, error, products, pages, loadingCreate, loadingDelete, successDelete}, dispatch ] = useReducer(reducer, {
        loading: true,
        error: "",
        products: []
    })
    const navigate = useNavigate(   )
    const {state} = useContext(Store)
    const {userInfo} = state
    const {search, pathname} = useLocation()
    const sp = new URLSearchParams(search)
    const page = sp.get("page") || 1 
    useEffect(()=>{
        const fetchData = async ()=>{
            dispatch({type: "FETCH_REQUEST"})
            try {
                const {data} = await axios.get(`http://localhost:4550/api/admin?page=${page}`, {
                    headers : {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                })
                dispatch({type: "FETCH_SUCCESS", payload: data})
            } catch (error) {
                dispatch({type: "FETCH_FAIL", payload: getError(error)})
            }
        }
        fetchData()
    },[page, userInfo])
    const createHandler = async() =>{
        if (window.confirm('Are you sure to create?')) {
            try {
              dispatch({ type: 'CREATE_REQUEST' });
              const { data } = await axios.post(
                'http://localhost:4550/api/',
                {},
                {
                  headers: { Authorization: `Bearer ${userInfo.token}` },
                }
              );
              toast.success('product created successfully');
              dispatch({ type: 'CREATE_SUCCESS' });
              navigate(`/admin/products/${data.product._id}`);
            } catch (err) {
              toast.error(getError(error));
              dispatch({
                type: 'CREATE_FAIL',
              });
            }
          }
        };
    const deleteHandler = async (product) =>{
        if (window.confirm('Are you sure to delete?')) {
            try {
              await axios.delete(`http://localhost:4550/api/${product._id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              });
              toast.success('product deleted successfully');
              dispatch({ type: 'DELETE_SUCCESS' });
            } catch (err) {
              toast.error(getError(error));
              dispatch({
                type: 'DELETE_FAIL',
              });
            }
          }
    }
    return(
        <section>
            <div className="small">
                <div>
                    <h2>Users</h2>
                    <button className="action" onClick={createHandler}>Create Product</button>
                </div>
                <div>
                    {loadingCreate && <div>loading...</div>}
                    {loadingDelete && <div>loading...</div>}
                {loading ? <div>loading...</div> :(
                    <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((x)=>(
                            <tr key={x._id}>
                                <td>{x._id}</td>
                                <td>{x.name}</td>
                                <td>NGN{x.price}</td>
                                <td>{x.category}</td>
                                <td>{x.brand}</td>
                                <td><button className="action" onClick={()=>{ navigate(`/admin/products/${x._id}`)}}>Edit</button><button className="action" onClick={()=>{ deleteHandler(x)}}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )
                }
                {[...Array(pages).keys()].map((x)=>(
                    <Link
                    className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
                    key={x + 1}
                    to={`/admin/products?page=${x + 1}`}>{x + 1}</Link>
                ))}
            </div>
            </div>
        </section>
    )
}


export default ProductListScreen;