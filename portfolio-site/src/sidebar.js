import './css/sidebar.css';
import { useEffect, useRef, useState } from 'react';

const Sidebar=({filters, setFilters, sorts, setSorts, industries, mediums, showSidebar, setShowSidebar})=>{
    const [sidebarclass, setSidebarclass] = useState("sidebar");
    const [radio, setRadio] = useState("");
    const [checks, setChecks] = useState("");
    const [checkMValue, setCheckMValue] = useState({});
    const [checkIValue, setCheckIValue] = useState({});
    const [checkSValue, setCheckSValue] = useState({ "collection": false, "documentation": false, "subpage": false});
    const [reset, setReset] = useState(false);
    const [search, setSearch] = useState("")


    //SIDEBAR MANAGEMENT
    //sets showSidebar
    function closeSidebar() {
        setShowSidebar(false);
    }

    //opens and closes the sidebar
    useEffect(() => {
        if (showSidebar) {
            setSidebarclass("sidebar open")
        }
        else {
            setSidebarclass("sidebar")
        }
    }, [showSidebar]);
    
    //these watch for clicks outside 
    const wrapperRef = useRef(null);
    OutsideAlert(wrapperRef);

    //if there's a click outside while the sidebar is open, close the sidebar
    function OutsideAlert(ref) {
        useEffect(() => {
            function outsideClick(event) {
                if (ref.current && !ref.current.contains(event.target) && sidebarclass === "sidebar open") {
                    console.log("outside click");
                    closeSidebar();
                }
            }

            document.addEventListener("mousedown", outsideClick);
            return () => {
                document.removeEventListener("mousedown", outsideClick);
            };
            //sidebarclass is required here no matter what eslint says
            //eslint-disable-next-line
        }, [ref, sidebarclass]);
    }

    //RADIO SORT
    //set up radio for sorting with on initialization. 
    //current options are hardcoded into var sortbyoptions: industry, medium, date, title
    //if sorts updates, then make sure the radio dial rerenders
    useEffect(() => {
        var sortbyoptions = ["industry", "medium", "date", "title", "type"];

        function handleRChange(changeEvent) {
            console.log(changeEvent.target.value);
            setSorts(changeEvent.target.value);

        }

        var newRadio = [];
        for (let x in sortbyoptions) {
            newRadio.push(<div className="form-radio" key={sortbyoptions[x]}>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value={sortbyoptions[x]}
                        checked={sorts === sortbyoptions[x]}
                        //TODO: ensure that checked mirrors 'sorts' variable
                        onChange={handleRChange}
                        className="form-check-input"
                    />
                { sortbyoptions[x] }
                </label>
          </div>)
        }
        setRadio(newRadio);
    }, [sorts, setSorts])

    //CHECKBOX FILTER
    //set up checkbox variables for filtering with. values are passed in from industries and mediums
    useEffect(() => {
        var newcval = {};
        for (let y in industries) {
            var exists = false;
            if (filters && filters["industry"]?.length > 0 && filters["industry"].indexOf(industries[y]) !== -1) {
                exists = true;
            }
            newcval[industries[y]] = exists;
        }
        //rerender checkIvalue ONLY if it has changed
        if (newcval !== checkIValue) {
            setCheckIValue(newcval);
        }
        newcval = {};

        for (let z in mediums) {
            var exists2 = false;
            if (filters && filters["medium"]?.length > 0 && filters["medium"].indexOf(mediums[z]) !== -1) {
                exists2 = true;
            }
            newcval[mediums[z]] = exists2;
        }

        if (newcval !== checkMValue) {
            setCheckMValue(newcval);
        }

        //now do it again for the subpage filters
        newcval = {};
        if (filters && filters["type"]?.length > 0 && filters["type"].indexOf("collection") !== -1) {
            newcval["collection"] = true;
        } else {
            newcval["collection"] = false;
        }
        if (filters && filters["type"]?.length > 0 && filters["type"].indexOf("documentation") !== -1) {
            newcval["documentation"] = true;
        } else {
            newcval["documentation"] = false;
        }
        
        if (filters && filters["type"]?.length > 0 && filters["type"].indexOf("subpage") !== -1) {
            newcval["subpage"] = true;
        } else {
            newcval["subpage"] = false;
        }

        if (newcval !== checkSValue) {
            setCheckSValue(newcval);
        }


    //eslint-disable-next-line
    }, [industries, mediums, filters]);

    //check values have successfully been determined: now we make checkboxes out of them
    useEffect(() => {
        function removeFilter(im, removethis) {
            console.log("removefilter");
            var removefrom = filters;
            if (removefrom) {
                if (removefrom[im].indexOf(", ") !== -1) {
                    //there are commas: just remove the one
                    var allvalues = removefrom[im].split(", ")
                                    .filter(val => val !== removethis)
                                    .join(", ");
                    removefrom[im] = allvalues;
                } else {
                    //no commas: remove the whole entry
                    delete removefrom[im];
                }
                setFilters(removefrom);

            } else {
                console.log("error: no filters to remove");
                return;
            }
        }

        function addFilter(im, addthis) {
            console.log('addfilter');
            var addto = filters;
            if (!addto) {
                console.log("no filters at all: create an empty filter variable");
                addto = {};
                addto[im] = addthis;

            } else if (addto[im] && addto[im].indexOf(addthis) !== -1) {
                console.log("error: ", addthis, "already exists in", addto[im]);
                return;
            } else {
                if (addto[im] && addto[im].length > 0) {
                    //there is already a filter here: append with commas
                    addto[im] = addto[im] + ", " + addthis;
                } else {
                    //no filters in this category: it's free real estate
                    addto[im] = addthis;
                }
            }
            setFilters(addto);
        }

        function handleFChange(changeEvent, isInd) {
            //if we update the filters, the checkValue array also updates above           
            var doAddFilter = false;

            //question 1: adding or removing? check the value arrays: we are inverting them
            if (isInd === "industry") {
                doAddFilter = !checkIValue[changeEvent.target.name];
            } else if (isInd === "medium") {
                doAddFilter = !checkMValue[changeEvent.target.name];
            } else {
                console.log("isInd is ", isInd)
                doAddFilter = !checkSValue[changeEvent.target.name];
            }

            if (!doAddFilter) {
                removeFilter(isInd, changeEvent.target.name);
            } else {
                addFilter(isInd, changeEvent.target.name);
            }
        }

        function returnwrapper(checkval, changeval) {
            var cholder = [];
            Object.entries(checkval).forEach(([key, value]) => {
                cholder.push(
                    <div className="form-check" key={key}>
                    <label>
                        <input
                            type="checkbox"
                            name={key}
                            checked={value}
                            onChange={(event) => handleFChange(event, changeval)}
                            className="form-check-input"
                        />
                        { key }
                    </label>
                </div>
                );
            });  
            var classstring = changeval + "wrapbox";
            return (<div className={classstring}>{cholder}</div>)  
        }

        function setNewChecks() {
            var newIndChecks = [];

            newIndChecks.push(<div className="checkmarkheader topcheckmarkheader" key="typeh">SUB-PAGES:</div>);
            newIndChecks.push(returnwrapper(checkSValue, "type"));  

            newIndChecks.push(<div className="checkmarkheader" key="indh">INDUSTRIES:</div>);
            newIndChecks.push(returnwrapper(checkIValue, "industry"));

    
            newIndChecks.push(<div className="checkmarkheader" key="mediumh">MEDIUMS:</div>);
            newIndChecks.push(returnwrapper(checkMValue, "medium"));
    
            setChecks(newIndChecks);
        }

        setNewChecks();
        // eslint-disable-next-line        
    }, [checkIValue, checkMValue, checkSValue]);

    //SEARCH BAR
    //on searchbar enter key, set search
    function handleSChange(changeEvent) {
        //changeEvent.preventDefault();
        if (changeEvent.key === 'Enter'){
            setSearch(changeEvent.target.value);
            console.log("new search");
        }
    }

    //if search changes, update the filters accordingly
    useEffect(() => {
        if (search.length > 0) {
            //there is a search: replace current search
        var addsearchto = {};
        if (filters) {
            addsearchto = filters;
        }
        addsearchto["search"] = search;
        setFilters(addsearchto);    
        } else {
            //no search: remove search if it exists
            if (filters) {
                var removesearchfrom = filters;
                delete removesearchfrom["search"];
                setFilters(removesearchfrom);
            }
        }
        //eslint-disable-next-line
    }, [search]);

    //the search bar itself
    const SearchBar=()=>{
        return (
            <input
                className="searchbar"
                type="text"
                placeholder="Search Entries"
                onKeyUp={handleSChange}
                defaultValue={search}
            />
        )
    }

 
    //RESETTING SEARCH, SORT AND FILTER
    function resetSearch() {
        setReset(true);
        if (search) {
            setSearch("");
        }
        if (filters && Object.keys(filters).length !== 0) {
            setFilters({});
        } else {
            console.log("NO FILTERS. RESET DATE");
            setSorts("date");
            setReset(false);
        }

        console.log("reset search");
    }

    //if we are resetting: wait for filters to update, THEN change sorts
    useEffect(() => {
        if (reset) {
            setSorts("date");
            setReset(false);
        }
        //eslint-disable-next-line
    }, [filters])
    


    return (
        <div className={sidebarclass} ref={wrapperRef}>
            <div className="sidebar-contents">
                <SearchBar className="searchbar" />
                <div className="sectionheader">Sort by:</div>
                <div className="sortselect">{radio}</div>
                <div className="sectionheader">Filter by:</div>
                <div className="filterselect">{checks}</div>
                <div class="buttonbox">
                    <button className="insbbutton resetbtn" onClick={resetSearch}> Reset Search</button>
                    <button className="insbbutton closebtn" onClick={closeSidebar}>Close Sidebar</button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar; 