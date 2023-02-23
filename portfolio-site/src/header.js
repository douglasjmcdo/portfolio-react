import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/header.css';
import Sidebar from './sidebar';

//todo: import filterbar options from data.json?
const Header=({industries, mediums, setFilters, filters, sorts, setSorts})=>{
    const [industryArray, setIndustryArray] = useState(["front-end", "illustration"]);
    const [status, setStatus] = useState("null");
    const [showSidebar, setShowSidebar] = useState(false);

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
                filterstring +="\"" + value + "\", ";
            });
            filterstring = filterstring.substring(0, filterstring.length - 2);
        }

        if (sorting) {
            sortstring = "Sorted by: " + sorting;
        }

        if (filterstring.length > 5) {
            fullstring = sortstring + " || " + filterstring;
        } else {
            fullstring = sortstring;
        }



        return fullstring;
    }

    //if filters or sorts change, update infostatus
    useEffect(() => {
        setStatus(infoStatus(filters, sorts));
    }, [sorts, filters]);


    //BUTTON TESTERS. REMOVE ONCE BUTTONS ARE NO LONGER NEEDED
    function testFilter() {
        if (!filters || Object.entries(filters).length === 1) {
            //newfilter = {};
            console.log(2);
            setFilters({medium: "digital", title: "UI Userflow 1"});
        }
        else if (Object.entries(filters).length === 0){
            //newfilter = {medium: "2d" };
            setFilters({medium: "2d, traditional"});
        } else {
            console.log(3);
            //newfilter = {medium: "digital", title: "UI Userflow 1"};
            setFilters({});
        }
    }
    
    function testSort2() {
        if (sorts === "date") {
            setSorts("medium");
        } else if (sorts === "medium") {
            setSorts("title");
        }
         else {
            setSorts("date");
        }
    }

    function openSidebar() {
        console.log(showSidebar);
        setShowSidebar(true);
    }


    return (
        <div className="headerbar">
            <Link to="/" className="headertext"><div>DOUGLAS MCDONALD</div></Link>
            <ul className="filterbar">
                { industryArray }
            </ul>
            <div className="status">
                {status}
                <div className="searchSettings">
                    {/* <button onClick={testFilter}>switch filter</button>
                    <button onClick={testSort2}>switch sort</button> */}
                    <button onClick={openSidebar}>show sidebar</button>
                    <Sidebar filters={filters} setFilters={setFilters} sorts={sorts} setSorts={setSorts} industries={industries} mediums={mediums}
                             showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
                </div>
            </div>

        </div>
    )

}

const FilterButton=({value, index})=>{
    let linkto = "/?filter=industry-" + value;
    return (
        <li key={ value } className="filterbutton"><Link to={ linkto }>{ value } </Link></li>
    );
}

export default Header;