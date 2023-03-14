import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSubmit } from "react-router-dom";
import { toast } from "react-toastify";
import { Ratings } from "../components/Ratings";
import { Store } from "../Store";
import { getError } from "../utils";

function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return {...state, loading: true, error: '' };
      case 'FETCH_SUCCESS':
        return {...state, loading: false, 
            products: action.payload.products,
            page: action.payload.page,
            pages: action.payload.pages,
            countProducts: action.payload.countProducts};
      case 'FETCH_FAIL':
        return {...state, loading: false, error: action.payload }; 
        default:
            return state;
        }
}

const prices = [
  {
    name: `NGN50 to NGN5000`,
    value: `50-5000`
  },
  {
    name: `NGN5001 to NGN100000`,
    value: `5001-100000`
  },
  {
    name: `NGN100001 to NGN500000`,
    value: `100001-500000`
  }
]
export const ratings = [
  {
    name: `4stars & up`,
    rating: 4,
  },
  {
    name: `3stars & up`,
    rating: 3,
  },
  {
    name: `2stars & up`,
    rating: 2,
  },
  {
    name: `1star & up`,
    rating: 1,
  },
]
function SearchScreen() {
    const {search} = useLocation();
    const navigate = useNavigate()
    const sp = new URLSearchParams(search); //search?category=shirts
    const category = sp.get(`category`) || `all`
    const query = sp.get(`query`) || `all`
    const price = sp.get(`price`) || `all`
    const rating = sp.get(`rating`) || `all`
    const order = sp.get(`order`) || `newest`
    const page = sp.get(`page`) || 1;
    const [{loading, error, products, pages, countProducts}, dispatch ] = useReducer( reducer, {
        loading: true,
        error: ''
    })
    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {cart} = state
    const addToCartHandler = async (item)=>{
      const existItem = cart.cartItems.find((x)=> x._id == item._id)
      const quantity = existItem ? existItem.quantity + 1 : 1;
      const {data} = await axios.get(`/api/product/${item._id}`)
      if(data.inStock < quantity){
          window.alert("Sorry, Product is out of stock")
      }
      ctxDispatch({type: "CART_ADD_ITEM", payload: {...item, quantity}})
  }
  const outStockHandler = () =>{
      toast.error("Sorry, Product is out of stock")
      return;
  }
    useEffect(()=>{
      const fetchData = async () =>{
        try {
           const {data} = await axios.get(`/api/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`) 
           dispatch({ type: "FETCH_SUCCESS", payload: data})
        } catch (error) {
            dispatch({
                type: "FETCH_FAIL",
                payload: getError(error)
            })
        }
      }
      fetchData()  
    },[page, category, price, query, rating, order])
    const [categories, setCategories] = useState([])
    useEffect(()=>{
      const fetchCategories = async () =>{
        try {
          const {data} = await axios.get(`/api/categories`)
          setCategories(data)
        } catch (error) {
          toast.error(getError(error))
        }
      }
      fetchCategories()
    },[dispatch])
    const getFilterUrl = (filter) =>{
      const filterPage = filter.page || page;
      const filterCategory = filter.category || category;
      const filterQuery = filter.query || query;
      const filterRating = filter.rating || rating;
      const filterPrice = filter.price || price;
      const sortOrder = filter.order || order;
      return `/search?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}`
    }
    return(
        <section className="search">
          <div className="container">
            <div className="filter">
              <div>
                <h3>Department</h3>
                <ul>
                  <li>
                    <Link className={"all" === category ? "text-bold" : ''}
                    to={getFilterUrl({ category: "all"})}>Any</Link>
                  </li>
                  {categories.map((c)=>(
                    <li key={c}>
                    <Link className={c === category ? "text-bold" : ''}
                    to={getFilterUrl({ category: c})}>{c}</Link>
                  </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Price</h3>
                <ul>
                  <li>
                    <Link className={"all" === price ? "text-bold" : ''}
                    to={getFilterUrl({ price: "all"})}>Any</Link>
                  </li>
                  {prices.map((p)=>(
                    <li key={p.value}>
                    <Link className={p.value === price ? "text-bold" : ''}
                    to={getFilterUrl({ price: p.value})}>{p.name}</Link>
                  </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Avg. Customer Review</h3>
                <ul>
                  {ratings.map((r)=>(
                    <li key={r.name}>
                    <Link className={`${r.rating}` ===  `${rating}` ? "text-bold" : ''}
                    to={getFilterUrl({ rating: r.rating})}>
                      <Ratings caption={' & up'} ratings={r.rating}></Ratings>
                    </Link>
                  </li>
                  ))}
                  <li>
                    <Link className={rating ===  `all` ? "text-bold" : ''}
                    to={getFilterUrl({ rating: "all"})}>
                      <Ratings caption={' & up'} ratings={0}></Ratings>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="products">
              {loading ? <div>loading</div> : (
                <div>
                  <div>
                    <div>
                      {countProducts === 0 ? "No" : countProducts} Results
                      {query !== "all" && " : " + query}
                      {category !== "all" && " : " + category}
                      {price !== "all" && " : " + price}
                      {rating !== "all" && " : Rating " + rating + " & up"}
                      {query !== "all" ||
                      category !== "all" ||
                      rating !== "all" ||
                      price !== "all" ? (
                        <button
                        className="action"
                        onClick={()=> navigate("/search")}>
                          <i className="fas fa-times-circle"></i>
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div>
                  {products.length === 0 && (
                    <div>Product not found</div>
                    
                  )}
                  <div className="f-product">
                {
                    products.map(item =>{
                        return (
                                <div className="product" key={item._id}>
                                    <Link to={`/product/${item._id}`} className="product-link">
                                    <div className="p-img">
                                        <img src={item.img} alt="item picture" />
                                    </div>
                                    <div>
                                        <h3>{item.name}</h3>
                                        <p className="price">{item.price}</p>
                                        <p><span>{item.ratings}</span></p>
                                        <p className="brand">{item.name}</p>
                                        <Ratings ratings={item.ratings}></Ratings>
                                        <div className="cart-add">
                                        </div>
                                    </div>
                                    </Link>
                                    <div className="cart-add">
                                        {item.inStock === 0 ? <button className="action" onClick={outStockHandler}>Out Of Stock</button> : <button className="action" onClick={()=>addToCartHandler(item)}>Add to Cart</button>}
                                    </div>
                                </div>
                        )
                    }
                    )
                }
                </div>
                </div>
                <div>
                  {[...Array(pages).keys()].map((x)=>(
                    <Link key={x +1}
                    className="mx-1"
                    to={getFilterUrl({page: x + 1})}>
                      <button className={Number(page) === x + 1 ? "text-bold" : '' + " action"}>{x + 1}</button>
                    </Link>
                  ))}
                </div>
                </div>
              )}
            </div>
            <div className="sort">
                    Sort by {' '}
                    <select
                      value={order}
                      onChange={(e)=>{
                        navigate(getFilterUrl({ order: e.target.value}))
                      }}>
                        <option className="sortby" value={"newest"}>Newest Arrivals</option>
                        <option className="sortby" value={"lowest"}>Price: Low to High</option>
                        <option className="sortby" value={"highest"}>Price: High to Low</option>
                        <option className="sortby" value={"toprated"}>Avg. Customer Reviews</option>
                      </select>
                  </div>
          </div>
        </section>
    )
}

export default SearchScreen;