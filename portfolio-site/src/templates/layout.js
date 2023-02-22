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
  const [mediums, setMediums] = useState([""]);

  //SORT and FILTER variables are held here so that both header and outlet can access them
  const [filters, setFilters] = useQueryParam('filter', ObjectParam);
  //how to set default filter? when i try withDefault, it infinite loops on FILTER RUN
  const [sorts, setSorts] = useQueryParam('sort', withDefault(StringParam, "date"));

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

    //this function compiles a list of all industries and mediums listed in the data
    function extractIndustries(dataArray) {
      var newIndustry = []
      var newMedium = []
      for (let x in dataArray) {
        for (let y in dataArray[x]["industry"]) {
          var newItem = dataArray[x]["industry"][y];
          if (newIndustry.indexOf(newItem) === -1){ 
            newIndustry.push(newItem);
          }
        }
        for (let z in dataArray[x]["medium"]) {
          var newItem2 = dataArray[x]["medium"][z];
          if (newMedium.indexOf(newItem2) === -1) {
            newMedium.push(newItem2);
          }
        }
      }
      console.log("EXTRACTING INDUSTRIES AND MEDIUMS", newIndustry, newMedium);
      setIndustries(newIndustry);
      setMediums(newMedium);
    }
    console.log("INITIAL RUN");
    setData(importJson(entries));
  }, []);

    return (
        <div className="app">
          <Header industries={industries} mediums={mediums} setFilters={setFilters} filters={filters} sorts={sorts} setSorts={setSorts}/>
          <Outlet context={{data, filters, sorts}}/>
      </div>
    );
}

export default Layout;