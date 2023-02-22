import './css/sidebar.css';
import { useEffect, useState } from 'react';

const Sidebar=({filters, setFilters, sorts, setSorts, industries, mediums, showSidebar, setShowSidebar})=>{
    const [sidebarclass, setSidebarclass] = useState("sidebar");
    const [radio, setRadio] = useState("");
    const [checks, setChecks] = useState("");
    const [checkMValue, setCheckMValue] = useState({});
    const [checkIValue, setCheckIValue] = useState({});

    function closeSidebar() {
        console.log(showSidebar);
        setShowSidebar(false);
    }

    //set up radio for sorting with on initialization. 
    //current options are hardcoded into var sortbyoptions: industry, medium, date, title
    useEffect(() => {
        var sortbyoptions = ["industry", "medium", "date", "title"];

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
                        onChange={handleRChange}
                        className="form-check-input"
                    />
                { sortbyoptions[x] }
                </label>
          </div>)
        }
        setRadio(newRadio);
    }, [setSorts])

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
            } else {
                doAddFilter = !checkMValue[changeEvent.target.name];
            }

            if (!doAddFilter) {
                removeFilter(isInd, changeEvent.target.name);
            } else {
                addFilter(isInd, changeEvent.target.name);
            }
        }

        var newIndChecks = [];

        newIndChecks.push(<div className="checkmarkheader" key="indh">INDUSTRIES:</div>);
        Object.entries(checkIValue).forEach(([key, value]) => {
                newIndChecks.push(
                    <div className="form-check" key={key}>
                    <label>
                        <input
                            type="checkbox"
                            name={key}
                            checked={value}
                            onChange={(event) => handleFChange(event, "industry")}
                            className="form-check-input"
                        />
                        { key }
                    </label>
                </div>
                );
        });

        newIndChecks.push(<div className="checkmarkheader" key="mediumh">MEDIUMS:</div>);
        Object.entries(checkMValue).forEach(([key, value]) => {
                newIndChecks.push(
                    <div className="form-check" key={key}>
                    <label>
                        <input
                            type="checkbox"
                            name={key}
                            checked={value}
                            onChange={(event) => handleFChange(event, "medium")}
                            className="form-check-input"
                        />
                        { key }
                    </label>
                </div>
                );
        });

        setChecks(newIndChecks);
    }, [checkIValue, checkMValue]);
    

    //opens and closes the sidebar
    //todo: implement close on click outside
    useEffect(() => {
        if (showSidebar) {
            setSidebarclass("sidebar open")
        }
        else {
            setSidebarclass("sidebar")
        }
    }, [showSidebar]);

    return (
        <div className={sidebarclass}>
            <div className="sidebar-contents">
                <div className="search">searchbar here</div>
                <div className="sortselect">{radio}</div>
                <div className="filterselect">{checks}</div>
                <div>{showSidebar}</div>
                <button onClick={closeSidebar}>close sidebar</button>
            </div>
        </div>
    );
}

export default Sidebar;