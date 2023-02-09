import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import DetailPscreen from "./screens/DetailPScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import SignInScreen from "./forms/SignInScreen";
import { Store } from "./Store";
import RegisterScreen from "./forms/RegisterScreen";
import UserProfile from "./screens/UserProfileScreen";
import {toast, ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ShippingScreen from "./screens/ShippingScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardScreen from "./screens/DashboardScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderlistScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";

function App() {
  const [sidebarIsopen, setSidebarIsopen] = useState(false);
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const userItems = () =>{
    document.querySelector(".sign-option").classList.toggle("active-bt")
  }
  const userItems1 = () =>{
    document.querySelector(".sign-option1").classList.toggle("active-bt")
  }
  const {state, dispatch: ctxDispatch} = useContext(Store)
  const { cart, userInfo } = state
  const signOutHandler = ()=>{
    ctxDispatch({type: "SIGNOUT_SUCCESS"})
    localStorage.removeItem("userInfo")
    localStorage.removeItem("cartItems")
    localStorage.removeItem("shippingAddress")
    localStorage.removeItem("paymentMethod")
    navigate("/")
  }
  useEffect(()=>{
    const fetchCategories = async () =>{
      try {
        const {data} = await axios.get(`http://localhost:4550/api/categories`);
        setCategories(data)
      } catch (error) {
        toast.error(getError(error));
      }
    }
    fetchCategories()
  },[])
  // console.log(categories)
  return (
    <div className="App">
      <div className={sidebarIsopen ? " active-cont" : ""}>
        <ToastContainer position="bottom-center" limit={1} />
        <nav>
          <div className="navbar">
            <button onClick={()=> setSidebarIsopen(!sidebarIsopen)}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="logo">
              <img src='' alt='JAXULEE JR' />
            </div>
            <div className="navbar">
                <SearchBox />
            </div>
            <div className="nav-items">
              <ul>
                <Link to={"/all-products"} className="nav-link"><li>Products</li></Link>
                <Link to={"/products/cart"} className="nav-link cart"><li>Cart { cart.cartItems.length > 0 && <p className="cart-number">{cart.cartItems.reduce((a,c)=> a+c.quantity, 0)}</p>}</li></Link>
                {userInfo ? (
                <div className="drop-t">
                  <li className="nav-link sign-out" onClick={userItems}>{userInfo.name}<span>&#9660;</span>
                    <ul className="sign-option"><li className="siu"><Link to={"/user-profile"} className="user-link">User Profile</Link></li><li className="siu"><Link to={"/orderhistory"} className="user-link">Order History</Link></li><li onClick={signOutHandler} className="siu user-link">Sign Out</li></ul></li>
                </div>)
                : 
                (<Link to={"/signin"} className="nav-link"><li> New or Existing User?</li></Link>)}
                {userInfo && userInfo.isAdmin && (
                  <div className="drop-t">
                  <li className="nav-link sign-out" onClick={userItems1}>Admin<span className="code">&#9660;</span>
                    <ul className="sign-option1">
                     <li className="siu1"><Link to={"/admin/dashboard"} className="user-link">Dashboard</Link></li>
                      <li className="siu1"><Link to={"/admin/products"} className="user-link">Products</Link></li>
                      <li className="siu1"><Link to={"/admin/orders"} className="user-link">Orders</Link></li>
                      <li className="siu1"><Link to={"/admin/users"} className="user-link">Users</Link></li>
                    </ul>
                  </li>
                </div>
                )}
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          <div 
          className={sidebarIsopen ?
          ` active-nav side-navbar` :
          `side-navbar`}>
            <nav className="f">
              <div>
                <strong>Categories</strong>
              </div>
              {categories.map((category, a)=>(
                <div key={a + 1}>
                  <Link to={`/search?category=${category}`}
                  onClick={()=> setSidebarIsopen(false)}>
                    <h2>{category}</h2>
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </nav>
        <main className="main-body">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/all-products" element={<ProductScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/product/:_id" element={<DetailPscreen />} />
            <Route path="/products/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SignInScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            {/* Admin Route */}
            <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>} />
            <Route path="/admin/products/:id" element={<AdminRoute><ProductEditScreen /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><OrderListScreen /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserListScreen /></AdminRoute>} />
            <Route path="/admin/users/:id" element={<AdminRoute><UserEditScreen /></AdminRoute>} />
            {/* End */}
            <Route path="/user-profile" element={<ProtectedRoute> <UserProfile /></ProtectedRoute>} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>} />
            <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen /> </ProtectedRoute>} />
            <Route path="/*" element={<HomeScreen />} />
          </Routes>
        </main>
        <div className="footer">
          <div className="footT">
            <h3>Copyrights All rights reserved</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
