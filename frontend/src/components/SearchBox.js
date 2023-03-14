import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function SearchBox() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate()
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : `/search`)
    }
    return(
        <form className="searchbox" onSubmit={submitHandler}>
            <input type={"text"} name="q" id="q" onChange={(e)=> setQuery(e.target.value)}
            placeholder="search products..."
            aria-autocomplete="list"
            aria-label="Search Products"
            aria-describedby="button-search" />
            <button className="action" type="submit" id="button-search">
                <i className="fas fa-search"></i>
            </button>
        </form>
    )
}