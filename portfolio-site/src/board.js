import React, {useState, useEffect } from 'react';
import './css/board.css';
import Entry from './entry.js';

const Board=({className, data, filters, sorts, boardname})=>{
    const [needSort, setNeedSort] = useState(false);
    const [needFilter, setNeedFilter] = useState(false);
    const [entryArray, setEntryArray] = useState([]); //BASE DATA
    const [filteredArray, setFilteredArray] = useState([]); //ENTRY ARRAY, FILTERED + SORTED
    const [bigindex, setBigindex] = useState(-1); //determines which bigindex is showing. -1 = none
    const [boardClasses, setBoardClasses] = useState("display-board");

    //on data load or url change, populate entry array. 
    useEffect(() => {
        function populateEntryArray(boardname) {
            //reset entry array before repopulating
            console.log("POPULATE ENTRIES");
            setEntryArray([]);
            //data is a single entry: presumably for documentation. just populate it
            if (data && data.length <= 1) {
                setEntryArray(entryArray => [...entryArray, data[0]]);
                return;
            }

            for (let x in data) {
                //main board: check if exists on main page!
                if (boardname === "main" && data[x].onmainpage === true) {
                    setEntryArray(entryArray => [...entryArray, data[x] ]);
                }
                //collection boards: see the board is named within "insubpage" array
                else if (boardname !== "main" && data[x].insubpage.length > 0) {
                    for (let sub in data[x].insubpage) {
                        if (data[x].insubpage[sub] === boardname) {
                            setEntryArray(entryArray => [...entryArray, data[x] ]);
                        }
                    }
                }
            }
        }

        console.log("data or boardname have changed,", data?.length, boardname);
        populateEntryArray(boardname);
    }, [data, boardname]);

    useEffect(() => {
        if (className) {
            setBoardClasses(className + " display-board " + boardname)
        } else {
            setBoardClasses("display-board " + boardname)
        }
    }, [className, boardname])


    //
    //FILTERING THE ENTRYARRAY:
    //THE ENTRYARRAY WILL BE FILTERED AND ASSIGNED TO FILTEREDARRAY WHENEVER 'needFilter' IS TRUE
    //THIS SHOULD HAPPEN EITHER:
    // 1) WHEN ENTRYARRAY CHANGES
    // 2) WHEN THE FILTER PARAMETER CHANGES
    //

    //1. if entryArray changes, update filteredarray!
    useEffect(() => {
        setNeedFilter(true);        
    }, [entryArray]);

    //2. if the filter parameters change, update filteredarray!
    useEffect(() => {
        if (needFilter === false && entryArray.length > 0 ) { setNeedFilter(true); }
        // eslint-disable-next-line
    }, [filters]);

    //if "needfilter" is true, filter the array and reset needfilter
    useEffect(() => {
        function containsFilter(a, filterkey, filtervalue) {
            //search: 
            if (filterkey === "search") {
                //console.log("SEARCH");
                let isMatch = false;

                //for each value, see if the filtervalue exists in it. if yes to any, mark as match
                isMatch = Object.values(a).find((el) => {
                    if (typeof(el) === "string") {
                        return el.toLowerCase().includes(filtervalue);
                    } else if (typeof(el) === "object") {
                        //check each element in the array; return true if any match
                        let inArray = false;
                        inArray = el.find((inel) => {
                            if (typeof(inel) === "string") {
                                return inel.toLowerCase().includes(filtervalue);
                            }
                            //edge cases: documentation boards can have objs nested up to 3 deep
                            //this is specifically for documentation types link and image
                            else if(typeof(inel) === "object" && typeof(inel[1]) === "object") {
                                return Object.values(inel[1]).find((inel2) => {
                                    return inel2.toLowerCase().includes(filtervalue);
                                });
                            } else if (typeof(inel) === "object") {
                                //inel[1] is a string
                                return inel[1].toLowerCase().includes(filtervalue);
                            }else { 
                                //inel is an int or otherwise easily converted
                                return inel.toString().toLowerCase().includes(filtervalue);
                            }
                        })
                        return inArray;
                    } else {
                        return el.toString().toLowerCase().includes(filtervalue);
                    }
                })
                return isMatch;
            }

            if (filtervalue === "subpage") {
                if (a[filterkey] !== "individual") {
                    return true;
                } else {
                    return false;
                }
            }

            //all other filters:
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
                //filtering by multiple mediums or industries: delineate with commas
                if (value.indexOf(", ") !== -1) {
                    var allvalues = value.split(", ");
                    for (let v in allvalues) {
                        filteredArray = filteredArray.filter((a) => containsFilter(a, key, allvalues[v]));
                    }
                } else {
                    //filtering by a single medium or industry
                    filteredArray = filteredArray.filter((a) => containsFilter(a, key, value));
                }
            });

            return filteredArray;
        }

        if (needFilter) {
            console.log("FILTER RUN");
            setNeedFilter(false);
            setNeedSort(true);
            let newArray = filterArray(entryArray, filters);
            setFilteredArray(newArray);
        }
        // eslint-disable-next-line
    }, [needFilter]);


    //
    // SORTING THE FILTEREDARRAY:
    // THE ARRAY WILL SORT ONCE WHENEVER 'needSort' IS TRUE.
    //THE ARRAY IS SORTED EITHER:
    //1) WHEN THE ARRAY CHANGES
    //1a) WHEN FILTERING HAS RUN
    //2) WHEN THE SORT PARAMETER CHANGES
    //

    //1. if filteredArray has changed in length and is not empty, sort it again
    useEffect(() => {
        console.log("FILTEREDARRAY LENGTH CHECK", filteredArray.length);
        if (filteredArray.length !== 0) {
            setNeedSort(true);
        }
    }, [filteredArray.length]);

    //1a. see the needFilter useEffect for where sorting is toggled if filtering has run
    //2. if the sort parameters change, sort it again
    useEffect(() => {
        if (needSort === false && entryArray.length > 0 ) { setNeedSort(true); }
        // why does sNS(true) prevent entryArray from populating when entryArray == 0? I guess it overwrites the data load?
        // eslint-disable-next-line
    }, [sorts]);

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

        function compareTypes(a, b) {
            //sort functions return false if a comes first, and true if b comes first
            if (a == b) {
                return 0;
            }
            else if (a != "individual") {
                return false;
            } else if (b != "individual") {
                return true;
            } else {
                return 0;
            }
        }

        function tiebreakerSort(a, b, sortmethod) {
            //stringify so that arrays compare properly
            let av = stringifyObj(a[sortmethod]);
            let bv = stringifyObj(b[sortmethod]);
            let datea = new Date(a["date"]);
            let dateb = new Date(b["date"]);

            //date defaults to REVERSE chronological
            if (sortmethod === "date") {
                //if dates are tied, sort by type, then by title
                if (datea.getTime() === dateb.getTime()) {
                    if (a["type"] === b["type"]) {
                        return a["title"] > b["title"];
                    } else {
                        return compareTypes(a["type"], b["type"]);
                    }
                }
                return datea.getTime() < dateb.getTime();
            }
            
            if (av === bv) {
                //sort methods are tied: sort by date, then by type, then by title
                if (datea.getTime() === dateb.getTime()) {
                    if (a["type"] === b["type"]) {
                        return a["title"] > b["title"];
                    } else {
                        return compareTypes(a["type"], b["type"]);
                    }
                } else {
                    return datea.getTime() < dateb.getTime();
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
            sortedArray = [...arrayToSort].sort((a,b) => tiebreakerSort(a, b, sortmethod));
            
            //want a reverse sort? use this
            if (false) {
                sortedArray.reverse();
            }
            return sortedArray;
        }

        if (needSort) {
            console.log("SORT RUN")
            let newArray = sortArray(filteredArray, sorts);
            setFilteredArray(newArray);
            setNeedSort(false);
        }
        // eslint-disable-next-line
    }, [needSort]);

    //BIGINDEX:
    //if bigindex reaches a nonexistent array number, then set it to -1
    useEffect(() => {
        if (bigindex >= filteredArray.length) {
            setBigindex(-1);
        }
    }, [bigindex, filteredArray.length]);

    return (
        <div className={ boardClasses }>
          {/* <button onClick={testSort}>add + sort</button> */}
          <div className="loadingscreen" hidden={true}>LOADING...</div>
          <div className="board-row" >

            { filteredArray.map((x, index) => (
                <Entry data={x} index={index} key={x["title"]} bigindex={bigindex} setBigindex={setBigindex}/>
            )) }
          </div>
        </div>
    );
}

export default Board;