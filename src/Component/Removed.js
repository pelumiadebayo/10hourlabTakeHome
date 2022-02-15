import React, { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import {Link} from "react-router-dom";

const Removed = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [year, setYear] = useState("");
    const [title, setTitle] = useState("");
    const [searchParam, setSearchParam] = useState(["city"]);
    const [offset, setOffset] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [pageCount, setPageCount] = useState(0)
    const [ignoredDatas, setIgnoredDatas] = useState([]);


    useEffect(() => {
        retrieveData();

    }, [offset, perPage]);

    const retrieveData=()=>{
       if(localStorage["ignored"]&& JSON.parse(localStorage["ignored"]).length>0)
       {
           var data = JSON.parse(localStorage["ignored"])
           setIsLoaded(true);
           setPageCount(Math.ceil(data.length/perPage));
           if(isNaN(perPage)|| perPage>10){
            setIgnoredDatas(data.slice(offset, offset+5));
           }else{
            setIgnoredDatas(data.slice(offset, offset+perPage));
           }
        }else{
            setIgnoredDatas([]);
            setError("No Data is ignored yet")

        }
    }
    
    function search(items){
        
        return items.filter((item) => {
            return searchParam.some(
                (column) => {
                    if(column==='city'){
                        return item[column].toString().toLowerCase().indexOf(city.toLowerCase())> -1
                    }else if(column==='country'){
                        return item[column].toString().toLowerCase().indexOf(country.toLowerCase())> -1
                    }else if(column==='preferred_job_title'){
                        return item[column].toString().toLowerCase().indexOf(title.toLowerCase())> -1
                    }else if(column==='professional_start_date'){
                        var x = new Date(new Date() - new Date(item[column])).getFullYear() - 1970;
                        return x.toString().toLowerCase().indexOf(year.toLowerCase())> -1
                    }
                }
            )
            
        });
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset((selectedPage )*perPage)
    }

    const handleUnIgnore = (item) => {
        for( var i = 0; i < ignoredDatas.length; i++){ 
    
            if ( ignoredDatas[i].uuid === item.uuid) { 
        
                ignoredDatas.splice(i, 1); 
            }
        
        }
        localStorage["ignored"]=JSON.stringify(ignoredDatas);
        window.location.reload();
    };

   

    if (error) {
        return (
            <div className="Error">
                <p><strong>{error}</strong></p>
                <Link to="/10hourlabTakeHome">
                <button >
                    <span>Go Home</span>
                </button>
                </Link>
            </div>
            )
    } else if (!isLoaded) {
        return <>loding...</>;
     } else {
        return (
            <div className="wrapper">
                <div className="head">
                    <p ><strong>Profile Filter By Pelumi Adebayo</strong></p>
                    <span>adepelumi1996@gmail.com</span>
                </div>
                <div className="search-wrapper">
                    <div className="search-form">
                        <label>
                        <span className="sr-only">Search By City</span></label>
                            <input
                                type="search"
                                className="search-input"
                                placeholder="Search for..."
                                value={city}
                                onChange={(e) => {setCity(e.target.value); setSearchParam(["city"])}}
                            />
                    </div>
                    <div className="search-form">
                        <label>
                        <span>Search By Country</span></label>
                            <input
                                type="search"
                                className="search-input"
                                placeholder="Search for..."
                                value={country}
                                onChange={(e) => {setCountry(e.target.value); setSearchParam(["country"])}}
                            />
                    </div>
                    <div className="search-form">
                        <label>
                        <span >Search by Years of Experience</span></label>
                            <input
                                type="number"
                                className="search-input"
                                placeholder="Search for..."
                                value={year}
                                onChange={(e) => {setYear(e.target.value); setSearchParam(["professional_start_date"])}}
                            />
                    </div>
                    <div className="search-form">
                        <label >
                        <span >Search By Job Title</span></label>
                            <input
                                type="search"
                                className="search-input"
                                placeholder="Search for..."
                                value={title}
                                onChange={(e) => {setTitle(e.target.value); setSearchParam(["preferred_job_title"])}}
                            />
                    </div>
                </div>

                <div  className="search-wrapper">
                    <input 
                    className="page" 
                    placeholder="profile per page" 
                    type='number' max={10} min={1}
                    onChange={(e) => {setPerPage(parseInt(e.target.value)); retrieveData() }}
                    />
                    <ReactPaginate
                    previousLabel={"<-prev"}
                    nextLabel={"next->"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                    />
                    <Link to="/10hourlabTakeHome">
                    <button >
                        <span>All Profile</span>
                    </button>
                    </Link>
                </div>

                <ul className="card-grid">
                    {search(ignoredDatas).map(item  => (
                        <li key={item.uuid}>
                            <article className="card" key={item.callingCodes}>
                                <div className="card-image">
                                    <img src="https://via.placeholder.com/150x75" alt="profile"/>
                                </div>
                                <div className="card-content">
                                    <ol className="card-list">
                                        <li>
                                            Name:
                                            <span>{item.first_name} {item.last_name}</span>
                                        </li><li>
                                            Job Title:
                                            <span>{item.preferred_job_title}</span>
                                        </li>
                                        <li>
                                            City: <span>{item.city}</span>
                                        </li>
                                        <li>
                                            Country: <span>{item.country}</span>
                                        </li>
                                        <li>
                                            Years Of Experience: <span>{new Date(new Date() - new Date(item.professional_start_date)).getFullYear() - 1970} years</span>
                                        </li>
                                        <li>
                                            Email: <span>{item.email}</span>
                                        </li>
                                    </ol>
                                    <div className="search-wrapper">
                                    <button onClick={() => handleUnIgnore(item)}>Remove From Ignored</button>
                                        
                                    </div>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

}
export default Removed;