import React, { useEffect, useState } from "react";
import Endpoint from "../Service/endpoint";
import ReactPaginate from 'react-paginate';
import {Link} from "react-router-dom";


const Home = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [year, setYear] = useState("");
    const [title, setTitle] = useState("");
    const [searchParam, setSearchParam] = useState(["city"]);
    const [offset, setOffset] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [pageCount, setPageCount] = useState(0)
    const [storedDatas, setStoredDatas] = useState([]);
    const [ignoredDatas, setIgnoredDatas] = useState([]);


    useEffect(() => {
        localStorage["datas"]?setStoredDatas(JSON.parse(localStorage["datas"])):(localStorage["datas"]=JSON.stringify([]));
        localStorage["ignored"]?setIgnoredDatas(JSON.parse(localStorage["ignored"])):(localStorage["ignored"]=JSON.stringify([]));

        retrieveData();
    }, [offset, perPage]);

    const retrieveData = () => {
         Endpoint.getAll()
             .then(response => {
                 setIsLoaded(true);
                 setPageCount(Math.ceil(response.items.length/perPage));
                 if(isNaN(perPage) || perPage>10){
                    setItems(response.items.slice(offset, offset+10));
                 }else{
                    setItems(response.items.slice(offset, offset+perPage));
                 }
                })
             .catch(e => {
                setIsLoaded(true);
                setError(error);
            });
    };

    function search(items){
        var itemToSearch;
        if(ignoredDatas&&ignoredDatas.length>0){
            itemToSearch= items.filter( x => !ignoredDatas.filter(y=>y.uuid===x.uuid).length );
        }else{
            itemToSearch= items;
        }
        return itemToSearch.filter((item) => {
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

    const handleSave = (item) => {
        storedDatas.push(item);
        localStorage["datas"]=JSON.stringify(storedDatas);
        window.location.reload();
    };

    const handleIgnore = (item) => {
        ignoredDatas.push(item);
        localStorage["ignored"]=JSON.stringify(ignoredDatas);
        window.location.reload();
    };

    if (error) {
        return <>{error}</>;
    } else if (!isLoaded) {
        
        return <>loading...</>;
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
                    <Link to="/saved">
                    <button className="gotopage">
                        <span>View Saved</span>
                    </button>
                    </Link>
                    <Link to="/ignored">
                    <button className="gotopage">
                        <span>View Ignored</span>
                    </button>
                    </Link>
                </div>

                <ul className="card-grid">
                    {search(items).map(item  => (
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
                                        {storedDatas&& storedDatas.find(x=>x.uuid===item.uuid)?
                                        <div className="saved"><strong>Saved Profile</strong></div>:
                                        (<button onClick={() => handleSave(item)} className="button">Save</button>)
                                        }


                                        {(ignoredDatas&& ignoredDatas.find(x=>x.uuid===item.uuid))||(storedDatas&& storedDatas.find(x=>x.uuid===item.uuid))?
                                        <></>:
                                        <button onClick={() => handleIgnore(item)} className="button">Ignore</button>
                                        }
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
export default Home;