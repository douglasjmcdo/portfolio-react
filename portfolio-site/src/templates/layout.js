import { Outlet, Link } from "react-router-dom";
import React, {useState, useEffect } from 'react';

import entries from '../data.json';
import Header from '../header.js';

const Layout = () => {
  const [data, setData] = useState(null);
  const [industries, setIndustries] = useState(["front-end", "illustration"]);

  //"constructor": initializes data
  useEffect(() => {
    console.log("INITIAL RUN");
    setData(importJson(entries));
  }, []);

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

    return (
        <div className="app">
          <Header industries={industries}/>
          <Outlet context={data}/>
      </div>
    );
}

export default Layout;