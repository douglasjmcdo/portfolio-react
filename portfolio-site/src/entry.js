import React, { useState, useEffect } from 'react';
import './css/entry.css';
import { Link } from 'react-router-dom';
import BigImage from './bigimage.js';

const Entry=(data)=>{
    const [econtent, setEcontent] = useState(<div></div>);
    const type = data.value["type"];
    const [openBig, setOpenBig] = useState(false);
    
    //initialize econtent
    useEffect(() => {
      function determineContent(source) {
        if (type === "individual") {
          setEcontent(
            <div className="entry" onClick={openEntry} key={ source.value["id"] }>
              <div className="eTitle">
                {data.value["title"]}
              </div>
              <div className="eContent">          
                <img className="entryimg" src={source.value["img"]} alt={source.value["alt"]}></img>
              </div>
            </div>
          );
        }

        else if (type === "sub-page-c") {
          var linkto = "/collection/" + source.value["url"];
          setEcontent(
            <Link to={linkto} key={ source.value["id"] }>
              <div className="entry">
                <div className="eTitle">
                  {data.value["title"]}
                </div>
                <div className="eContent">          
                  <img className="entryimg" src={source.value["img"]} alt={source.value["alt"]}></img>
                </div>
              </div>
            </Link>
          );
        }

        else {
          //todo: implement!
          setEcontent(<div>Sub Page: Documentation</div>)
        }
      }

      function openEntry() {
        if (type === "individual") {
            setOpenBig(true);
        }
        else {
            alert("this is a documentation subpage! open that page!");
        }
      }

      determineContent(data);
    }, [data, type]);

    return (
      <div className="contentandbig">{econtent}
      <div hidden={!openBig}><BigImage data={data} setBig={setOpenBig}/></div>
      </div>

    );

}

export default Entry;



    


    


