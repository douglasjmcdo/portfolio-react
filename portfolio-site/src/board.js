import { array } from 'prop-types';
import React, {useState, useEffect } from 'react';
import './css/board.css';
import Entry from './entry.js';
//import { useLocation } from 'react-router-dom';


const Board=({data, boardname})=>{
    const [filters, setFilters] = useState([null]);
    const [sorts, setSorts] = useState("date");
    const [needSort, setNeedSort] = useState(false);
    const [status, setStatus] = useState("null");
    const [entryArray, setEntryArray] = useState([]);


    //on data load or url change, populate entry array. 
    useEffect(() => {
        function populateEntryArray(boardname) {
            //reset entry array before repopulating
            console.log("POPULATE ENTRIES");
            setEntryArray([]);
            for (let x in data) {
    
                //main board: check if exists on main page!
                if (boardname === "main" && data[x].onmainpage === true) {
                    setEntryArray(entryArray => [...entryArray, data[x] ]);
                }
                //collection boards: see the board is named within "insubpage" array
                else if (boardname !== "main" && data[x].insubpage.length > 0) {
                    for (let sub in data[x].insubpage) {
                        if (data[x].insubpage[sub] === boardname) {
                            console.log("DATA ", data[x].title, " IS INCLUDED IN SUBPAGE", boardname);
                            setEntryArray(entryArray => [...entryArray, data[x] ]);
                        }
                    }
                }
            }
        }

        console.log("data or boardname have changed,", data?.length, boardname);
        populateEntryArray(boardname);
    }, [data, boardname]);

    // function renderEntry(i) {
    //     return <Entry value={i} />;
    // };

    //this function determines the info string for sorts and filters
    function infoStatus(filters, sorts) {
        // console.log("infostatus");
        if (filters === undefined || sorts === undefined ) {
            console.log(filters, sorts);
            return "undefined";
        }
        if (filters[0] == null) {
            return "Sorted by: " + sorts;
        }
        else {
            return "filters else";
        }
    }

    //if filters or sorts change, update infostatus
    useEffect(() => {
        // console.log("filters useeffect");
        setStatus(infoStatus(filters, sorts));
        if (needSort === false && entryArray.length > 0 ) { setNeedSort(true); }
        // why does sNS(true) prevent entryArray from populating when entryArray == 0?? I guess it overwrites the data load?
    }, [filters, sorts]);

    


    //
    // SORTING THE ENTRYARRAY:
    // THE ARRAY WILL SORT ONCE WHENEVER 'needSort' IS SET TO TRUE.
    //THE ARRAY SHOULD BE SORTED EITHER:
    //1) WHEN THE ARRAY CHANGES
    //2) WHEN THE SORT PARAMETER CHANGES
    //

    //if entryArray has changed in length and is not empty, sort it again
    useEffect(() => {
        console.log("ENTRYARRAY LENGTH CHECK", entryArray.length);
        if (entryArray.length !== 0) {
            setNeedSort(true);
        }
    }, [entryArray.length]);

    //if "needsort" is true, sort the array and reset needsort
    useEffect(() => {
        function sortEntryArray(arrayToSort, sortmethod) {
            if (arrayToSort === undefined || arrayToSort?.length === 0) {
                return [];
            }
            else if (sortmethod === undefined) {
                console.log ("Sort method is undefined. leaving array unsorted");
                return arrayToSort;
            }

            //sort the contents of the array by sortmethod.  //this isn't reliably sorting by title. why?
            const sortedArray = [...arrayToSort].sort((a,b) => a[sortmethod] - b[sortmethod]);
    
            return sortedArray;
        }

        if (needSort) {
            console.log("SORT RUN")
            setEntryArray(sortEntryArray(entryArray, sorts));
            setNeedSort(false);
        }
    }, [needSort]);

    

    // //toggle sort between date and title.
    // function testSort() {
    //     console.log('testsort');
        
    //     const newEntry = entryArray[3];
    //     setEntryArray(entryArray => [...entryArray, newEntry]);


    // }

    function testSort2() {
        var newsort = sorts;
        if (sorts === "date") {
            newsort = "id";
        }
         else {
            newsort = "date";
        }
        setSorts(newsort);
        
    }


    return (
        <div className="display-board">
          <div className="status">{status}</div>
          {/* <button onClick={testSort}>add + sort</button> */}
          <button onClick={testSort2}>switch sort</button>
          <div className="board-row">

            { entryArray.map(x => (
                <Entry value={x} key={x["title"]}/>
            )) }
          </div>
        </div>
    );
}

export default Board;