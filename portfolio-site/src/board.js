import React, {useState, useEffect } from 'react';
import './css/board.css';
import Entry from './entry.js';

const Board=({data})=>{
    const [filters, setFilters] = useState([null]);
    const [sorts, setSorts] = useState("date");
    const [needSort, setNeedSort] = useState(false);
    const [status, setStatus] = useState(infoStatus(filters, sorts));
    const [entryArray, setEntryArray] = useState([]);


    //on data load, populate entry array. currently defaults to 'main'.
    useEffect(() => {
        populateEntryArray("main");
    }, [data]);

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

    function populateEntryArray(boardname) {
        //reset entry array before repopulating
        console.log("POPULATE ENTRIES");
        setEntryArray([]);
        for (let x in data) {
            //console.log(data[x]);
            if (boardname === "main" && data[x].onmainpage === true) {
                setEntryArray(entryArray => [...entryArray, renderEntry(data[x]) ]);
            }
            //TODO: alt case for collection boards
        }
    }


    //
    // SORTING THE ENTRYARRAY:
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

    useEffect(() => {
        if (needSort) {
            console.log("SORT RUN")
            //console.log(entryArray);
            setEntryArray(sortEntryArray(entryArray));
            setNeedSort(false);
        }
    }, [needSort]);

    function sortEntryArray(arrayToSort) {
        //sort the contents of the array by sort
        console.log("SORT");
        const sortedArray = [...arrayToSort];
        sortedArray.sort((a,b) => a.props.value[sorts] - b.props.value[sorts]);
        return sortedArray;
    }


    return (
        <div className="display-board">
          <div className="status">{status}</div>
          <div className="board-row">
            { entryArray }
          </div>
        </div>
    );
}

export default Board;