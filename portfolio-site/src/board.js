import React, {useState, useEffect } from 'react';
import './css/board.css';
import Entry from './entry.js';
import { useLocation } from 'react-router-dom';


const Board=({data, boardname})=>{
    const [filters, setFilters] = useState([null]);
    const [sorts, setSorts] = useState("date");
    const [needSort, setNeedSort] = useState(false);
    const [status, setStatus] = useState(infoStatus(filters, sorts));
    const [entryArray, setEntryArray] = useState([]);


    //on data load or url change, populate entry array. 
    useEffect(() => {
        populateEntryArray(boardname);
    }, [data, boardname]);

    function renderEntry(i) {
        return <Entry value={i} />;
    };

    //this function determines the info string for sorts and filters
    function infoStatus(filters, sorts) {
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
        setStatus(infoStatus(filters, sorts));
        // setNeedSort(true); // why does setNeedSort(true) make the whole app hang in the sorts useeffect?
    }, [filters, sorts]);

    function populateEntryArray(boardname) {
        //reset entry array before repopulating
        console.log("POPULATE ENTRIES");
        setEntryArray([]);
        for (let x in data) {

            //main board: check if exists on main page!
            if (boardname === "main" && data[x].onmainpage === true) {
                setEntryArray(entryArray => [...entryArray, renderEntry(data[x]) ]);
            }
            //collection boards: see the board is named within "insubpage" array
            else if (boardname != "main" && data[x].insubpage.length > 0) {
                for (let sub in data[x].insubpage) {
                    if (data[x].insubpage[sub] === boardname) {
                        console.log("DATA ", data[x].title, " IS INCLUDED IN SUBPAGE", boardname);
                        setEntryArray(entryArray => [...entryArray, renderEntry(data[x]) ]);
                    }
                }
            }
        }
    }


    //
    // SORTING THE ENTRYARRAY:
    // THE ARRAY WILL SORT ONCE WHENEVER 'needSort' IS SET TO TRUE.
    //THE ARRAY SHOULD BE SORTED EITHER:
    //1) WHEN THE ARRAY CHANGES
    //2) WHEN THE SORT PARAMETER CHANGES
    //

    //if entryArray has changed in length and is not empty, sort it again
    useEffect(() => {
        if (entryArray.length != 0) {
            //console.log(entryArray);
            setNeedSort(true);
        }
    }, [entryArray.length]);

    //if "needsort" is true, sort the array and reset needsort
    useEffect(() => {
        if (needSort) {
            console.log("SORT RUN")
            //console.log(entryArray);
            setEntryArray(sortEntryArray(entryArray, sorts));
            setNeedSort(false);
        }
    }, [needSort]);

    function sortEntryArray(arrayToSort, sortmethod) {
        //sort the contents of the array by sort
        console.log("OLD SORT: ", sorts, "SORT BY ", sortmethod);
        const sortedArray = [...arrayToSort];
        sortedArray.sort((a,b) => a.props.value[sortmethod] - b.props.value[sortmethod]);
        //this isn't sorting. why?
        console.log(sortedArray);
        return sortedArray;
    }

    //toggle sort between date and title.
    function testSort() {
        var newsort = sorts;
        if (sorts == "date") {
            newsort = "title";
        }
         else {
            newsort = "date";
        }
        setEntryArray(sortEntryArray(entryArray, newsort));
        setSorts(newsort);
    }


    return (
        <div className="display-board">
          <div className="status">{status}</div>
          <button onClick={testSort}>switch sort</button>
          <div className="board-row">
            { entryArray }
          </div>
        </div>
    );
}

export default Board;