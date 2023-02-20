import { array } from 'prop-types';
import React, {useState, useEffect } from 'react';
import './css/board.css';
import Entry from './entry.js';
import { useSearchParams } from 'react-router-dom';
import {
    useQueryParam,
    StringParam,
    ObjectParam,
    withDefault
  } from 'use-query-params';


const Board=({data, boardname})=>{
    
    const [filters, setFilters] = useQueryParam('filter', ObjectParam);
    //how to set default filter? when i try withDefault, it infinite loops on FILTER RUN
    const [sorts, setSorts] = useQueryParam('sort', withDefault(StringParam, "medium"));
    const [needSort, setNeedSort] = useState(false);
    const [needFilter, setNeedFilter] = useState(false);
    const [status, setStatus] = useState("null");
    const [entryArray, setEntryArray] = useState([]); //BASE DATA
    const [filteredArray, setFilteredArray] = useState([]); //ENTRY ARRAY, FILTERED + SORTED

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

    //if entryArray changes, update filteredarray!
    useEffect(() => {
        setNeedFilter(true);        
    }, [entryArray]);

    // function renderEntry(i) {
    //     return <Entry value={i} />;
    // };

    //this function determines the info string for sorts and filters
    function infoStatus(filters, sorts) {
        // console.log("infostatus");
        let sortstring = "";
        let filterstring = "";
        let fullstring = "";

        if (filters && Object.entries(filters).length > 0) {
            filterstring = "Filtered by: ";
            Object.entries(filters).forEach(([key, value]) => {
                filterstring +="\"" + value + "\", ";
            });
            filterstring = filterstring.substring(0, filterstring.length - 2);
        }

        if (sorts) {
            sortstring = "Sorted by: " + sorts;
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
        if (needSort === false && entryArray.length > 0 ) { setNeedSort(true); }
        // why does sNS(true) prevent entryArray from populating when entryArray == 0? I guess it overwrites the data load?
    }, [sorts]);

    useEffect(() => {
        setStatus(infoStatus(filters, sorts));
        console.log('filters is ', filters);
        if (needFilter === false && entryArray.length > 0 ) { setNeedFilter(true); }
    }, [filters]);


    //
    //FILTERING THE ENTRYARRAY:
    //THE ENTRYARRAY WILL BE FILTERED AND ASSIGNED TO FILTEREDARRAY WHENEVER 'needFilter' IS TRUE
    //THIS SHOULD HAPPEN EITHER:
    // 1) WHEN ENTRYARRAY CHANGES
    // 2) WHEN THE FILTER PARAMETER CHANGES
    //

    useEffect(() => {

        function containsFilter(a, filterkey, filtervalue) {
            //console.log("CONTAINSFILTER", a["title"], filterkey, filtervalue, typeof(a[filterkey]));
            if (typeof(a[filterkey]) === "object") {
                for (let i in a[filterkey]) {
                    if (a[filterkey][i] === filtervalue) {
                        //console.log("MATCH!", a["title"], " is ", filtervalue);
                        return true;
                    }
                }
                return false;

            } else {
                return (a[filterkey] === filtervalue);
            }
        }

        function filterArray(arrayToFilter, filtermethods) {
            if (!filtermethods) {
                console.log("no filter method provided.", arrayToFilter, filtermethods);
                return arrayToFilter;
            }

            const freshfilter = Object.entries(filtermethods);
            if (arrayToFilter === undefined || arrayToFilter?.length === 0) {
                return [];
            } else if (freshfilter === undefined || freshfilter?.length === 0) {
                console.log("no filters to apply. returning,",arrayToFilter);
                return arrayToFilter;
            }

            var filteredArray = arrayToFilter;

            freshfilter.forEach(([key, value]) => {
                filteredArray = filteredArray.filter((a) => containsFilter(a, key, value));
            });

            return filteredArray;
        };

        if (needFilter) {
            console.log("FILTER RUN");
            setNeedFilter(false);
            setNeedSort(true);
            let newArray = filterArray(entryArray, filters);
            setFilteredArray(newArray);
            console.log(newArray);
        }
    }, [needFilter]);

    function testFilter() {
        if (!filters || Object.entries(filters).length === 1) {
            //newfilter = {};
            console.log(2);
            setFilters({medium: "digital", title: "UI Userflow 1"});
        }
        else if (Object.entries(filters).length === 0){
            //newfilter = {medium: "2d" };
            setFilters({medium: "2d"});
        } else {
            console.log(3);
            //newfilter = {medium: "digital", title: "UI Userflow 1"};
            setFilters({});
        }
    }


    //
    // SORTING THE FILTEREDARRAY:
    // THE ARRAY WILL SORT ONCE WHENEVER 'needSort' IS TRUE.
    //THE ARRAY IS SORTED EITHER:
    //1) WHEN THE ARRAY CHANGES
    //2) WHEN THE SORT PARAMETER CHANGES
    //

    //if filteredArray has changed in length and is not empty, sort it again
    useEffect(() => {
        console.log("FILTEREDARRAY LENGTH CHECK", filteredArray.length);
        if (filteredArray.length !== 0) {
            setNeedSort(true);
        }
    }, [filteredArray.length]);

    //if "needsort" is true, sort the array and reset needsort
    useEffect(() => {
        function stringifyObj(objin) {
            if (typeof(objin) === "object") {
                return JSON.stringify(objin);
            }
            else {
                return objin;
            }

        }
        function tiebreakerSort(a, b, sortmethod) {
            //stringify so that arrays compare properly
            let av = stringifyObj(a[sortmethod]);
            let bv = stringifyObj(b[sortmethod]);

            //date defaults to REVERSE chronological
            if (sortmethod === "date") {
                return av < bv;
            }
            
            if (av === bv) {
                // console.log("sort methods are tied: sort by date, then by title");
                if (a["date"] == b["date"]) {
                    return a["title"] > b["title"];

                } else {
                    return a["date"] < b["date"];
                }
            }
            return av > bv;
        }


        function sortArray(arrayToSort, sortmethod) {
            if (arrayToSort === undefined || arrayToSort?.length === 0) {
                return [];
            }
            else if (sortmethod === undefined) {
                console.log ("Sort method is undefined. leaving array unsorted");
                return arrayToSort;
            }

            //sort the contents of the array by sortmethod.  //this isn't reliably sorting by title. why?
            var sortedArray = arrayToSort;
            var methodtype = typeof(arrayToSort[0][sortmethod]);
            sortedArray = [...arrayToSort].sort((a,b) => tiebreakerSort(a, b, sortmethod));
            
            //want a reverse sort? use this
            if (false) {
                sortedArray.reverse();
            }
    
            console.log(sortedArray, "sorted");
            return sortedArray;
        }

        if (needSort) {
            console.log("SORT RUN")
            let newArray = sortArray(filteredArray, sorts);
            setFilteredArray(newArray);
            setNeedSort(false);
            console.log(newArray);
        }
    }, [needSort]);


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


    return (
        <div className="display-board">
          <div className="status">{status}</div>
          {/* <button onClick={testSort}>add + sort</button> */}
          <button onClick={testSort2}>switch sort</button>
          <button onClick={testFilter}>switch filter</button>
          <div className="board-row">

            { filteredArray.map(x => (
                <Entry value={x} key={x["title"]}/>
            )) }
          </div>
        </div>
    );
}

export default Board;