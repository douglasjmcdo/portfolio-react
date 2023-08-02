import React, {useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/header.css';
import Sidebar from './sidebar';

//import '/../img/2023/graphic design/typography + logo/logo_vector.png';

//todo: import filterbar options from data.json?
const Header=({industries, mediums, setFilters, filters, sorts, setSorts})=>{
    let location = useLocation();
    const [industryArray, setIndustryArray] = useState(["front-end", "illustration"]);
    const [status, setStatus] = useState("null");
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDocumentation, setIsDocumentation] = useState(false);

    useEffect(() => {
        console.log('locatoin useeffect triggered', location.pathname);
        function getIsDocumentation(pathname) {
            if (pathname.split('/')[1] === "documentation") 
                { console.log("TRUE AAAAA"); return true; } 
                else { return false; }
        }
        setIsDocumentation(getIsDocumentation(location.pathname));
    }, [location.pathname]);

    //on industries load-in, populate industryArray
    useEffect(() => {
        //
        function populateIndustryArray() {
            console.log("POPULATE FILTERS");
            setIndustryArray([]);
            for (let x in industries) {
                //console.log(industries[x], x);
                setIndustryArray(industryArray => [...industryArray, renderFilterButton(industries[x], x) ]);
            }
        }

        function renderFilterButton(v, i) {
            return <FilterButton value={v} index={i} key={i} />;
        }

        populateIndustryArray();
    }, [industries]);



    //
    //SORTING AND FILTERING:
    //

     //this function determines the info string for sorts and filters
     function infoStatus(filtering, sorting) {
        // console.log("infostatus");
        let sortstring = "";
        let filterstring = "";
        let fullstring = "";

        if (filtering && Object.entries(filtering).length > 0) {
            filterstring = "Filtered by: ";
            Object.entries(filtering).forEach(([key, value]) => {
                value = value.replaceAll(", ", "\", \"");
                filterstring +="\"" + value + "\", ";
            });
            filterstring = filterstring.substring(0, filterstring.length - 2);
        }

        if (sorting) {
            sortstring = "❖  Sorted by: " + sorting + "  ❖";
        }

        if (filterstring.length > 5) {
            fullstring = sortstring + "  " + filterstring + "  ❖";
        } else {
            fullstring = sortstring;
        }


        console.log(fullstring)
        return fullstring;
    }

    //if filters or sorts change, update infostatus
    useEffect(() => {
        setStatus(infoStatus(filters, sorts));
    }, [sorts, filters]);

    //access the sort/filter menu
    function openSidebar() {
        console.log(showSidebar);
        setShowSidebar(true);
    }


    return (
        <div className="stickyheader">
            <div className="navbars">
                <ul className="filterbar" key="0">
                    { industryArray }
                </ul>
                <div className="status" style={isDocumentation ? {opacity: 0 } : {opacity: 1 }}>
                    <div className="statusmessage">{status}</div>
                    <div className="searchSettings">
                        <button className="sidebarbutton" onClick={openSidebar}>Show Sidebar</button>
                    </div>
                </div>
            </div>
            <Sidebar filters={filters} setFilters={setFilters} sorts={sorts} setSorts={setSorts} industries={industries} mediums={mediums}
                             showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        </div>
    )

}

const FilterButton=({value, index})=>{
    let linkto = "/?filter=industry-" + value;
    return (
        <li key={ value } className="filterbutton"><Link to={ linkto }>{ value.toUpperCase() } </Link></li>
    );
}

export default Header;