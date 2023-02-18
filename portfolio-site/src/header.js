import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/header.css';

//todo: import filterbar options from data.json?
const Header=({industries})=>{
    const [filterArray, setFilterArray] = useState(["front-end", "illustration"]);

    //on industries load-in, populate filterArray
    useEffect(() => {
        //
        function populateFilterArray() {
            console.log("POPULATE FILTERS");
            setFilterArray([]);
            for (let x in industries) {
                //console.log(industries[x], x);
                setFilterArray(filterArray => [...filterArray, renderFilterButton(industries[x], x) ]);
            }
        }

        function renderFilterButton(v, i) {
            return <FilterButton value={v} index={i} key={i} />;
        }
        
        populateFilterArray();
    }, [industries]);

    

    // useEffect(() => {
    //     console.log(filterArray);
    //     for (let x in filterArray) {
    //         //console.log(filterArray[x]);
    //     }
    // }, [filterArray.length]);

    return (
        <div className="headerbar">
            <Link to="/" className="headertext"><div>DOUGLAS MCDONALD</div></Link>
            <ul className="filterbar">
                { filterArray }
            </ul>
        </div>
    )

}

const FilterButton=({value, index})=>{
    return (
        <li key={ value } className="filterbutton"><Link to="/collection/2d-studio">{ value } </Link></li>
    );
}

export default Header;