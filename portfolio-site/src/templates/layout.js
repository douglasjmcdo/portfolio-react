import { Outlet } from "react-router-dom";
import React, {useState, useEffect } from 'react';

import entries from '../data.json';
import Header from '../header.js';
import {
  useQueryParam,
  StringParam,
  ObjectParam,
  withDefault
} from 'use-query-params';


const Layout = () => {
  const [data, setData] = useState(null);
  const [industries, setIndustries] = useState(["front-end", "illustration"]);
  const [filters, setFilters] = useQueryParam('filter', ObjectParam);
  //how to set default filter? when i try withDefault, it infinite loops on FILTER RUN
  const [sorts, setSorts] = useQueryParam('sort', withDefault(StringParam, "medium"));
  const [needSort, setNeedSort] = useState(false);
  const [needFilter, setNeedFilter] = useState(false);  

  //"constructor": initializes data
  useEffect(() => {
    // This function takes a json of entries and returns an array of entries 
    function importJson(dataIs) {
      var dataimport = [];
      try {
          for (let x in dataIs["entries"]) {
              dataimport[x] = dataIs["entries"][x];
          }
      }catch (error) {
          console.error(error);
        }
      console.log("IMPORTING JSON", dataimport);
      extractIndustries(dataimport);
      return dataimport;
    }

    //this function compiles a list of all industries listed in the data
    function extractIndustries(dataArray) {
      var newIndustry = []
      for (let x in dataArray) {
        for (let y in dataArray[x]["industry"]) {
          var newItem = dataArray[x]["industry"][y];
          if (newIndustry.indexOf(newItem) === -1){ 
            newIndustry.push(newItem);
          }
        }
      }
      console.log("EXTRACTING INDUSTRIES", newIndustry);
      setIndustries(newIndustry);
    }
    console.log("INITIAL RUN");
    setData(importJson(entries));
  }, []);

 //TODO: move search toggling here
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
 

    return (
        <div className="app">
          <Header industries={industries}/>
          <Outlet context={data}/>
      </div>
    );
}

export default Layout;