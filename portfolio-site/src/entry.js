import React, { useState, useEffect } from 'react';
import './index.css';

const Entry=(data)=>{
    const [econtent, setEcontent] = useState(<div></div>);
    const type = data.value["type"];
    
    //todo: entry div: on-click, open the ImageMode component

    //initialize econtent
    useEffect(() => {
      determineContent(data.value["data"]);
    }, [data]);

    function determineContent(source) {
      if (type === "individual") {
        setEcontent(<img className="entryimg" src={source} alt={data.value["alt"]}></img>)
      }
      else if (type === "sub-page-c") {
        //todo: implement!
        setEcontent(<img className="entryimg" src={source} alt={data.value["alt"]}></img>)
      }
      else {
        //todo: implement!
        setEcontent(<div>Sub Page: Documentation</div>)
      }
    }
  
    function openEntry() {
        if (type === "individual") {
            alert("this is an individual entry! open up big display");
        }
        else if (type === "sub-page-c") {
            alert("this is a collection subpage! open the collection!");
        }
        else {
            alert("this is a documentation subpage! open that page!");
        }
    }

        //todo: show title  over top left of content on hover
    return (
      <div className="entry" onClick={openEntry} id={ data.value["id"] }>
      <div className="eTitle">
        {data.value["title"]}
      </div>
        <div className="eContent">{ econtent }</div>
      </div>
    );
}

export default Entry;