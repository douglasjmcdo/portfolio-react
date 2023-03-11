import React, { useState, useEffect } from 'react';
import './css/entry.css';
import { Link } from 'react-router-dom';
import BigImage from './bigimage.js';

const Entry=({data, index, bigindex, setBigindex})=>{
    const [econtent, setEcontent] = useState("");
    const type = data["type"];
    const [openBig, setOpenBig] = useState(false);
    const [loaded, setLoaded] = useState(false);
    
    //initialize econtent
    useEffect(() => {
      function determineContent(source) {
        if (type === "individual") {
          setEcontent(
            <div className="entry" style={{display: loaded ? "block" : "none"}} onClick={openEntry} key={ source["id"] }>
              <div className="eTitle indiv">
                {data["title"]}
              </div>
              <div className="eContent">          
                <img className="entryimg" onLoad={() => setLoaded(true)} src={source["img"]} alt={source["alt"]}></img>
              </div>
            </div>
          );
        }

        else {
          var linkto = "/documentation/" + source["url"];
          if (type === "collection") {
            linkto = "/collection/" + source["url"];
          }
          setEcontent(
            <Link to={linkto} key={ source["id"] }>
              <div className="entry" style={{display: loaded ? "block" : "none"}}>
                <div className="centertext">
                  <div className="eTitle subpage">
                    <span className="underline">{data["title"]}</span>
                  </div>
                  <div className="ecaption">
                    {data["caption"]}
                  </div>
                </div>
                <div className="eContent">          
                  <img className="entryimg subpimg" onLoad={() => setLoaded(true)} src={source["img"]} alt={source["alt"]}/>
                </div>
              </div>
            </Link>
          );
        }
      }

      determineContent(data);

      //eslint-disable-next-line
    }, [data, type, index, loaded]);

    //want to open the bigimage? set bigindex to match index
    function openEntry() {
      setBigindex(index);
    }

    //if the index and bigindex match, then open bigimage
    useEffect(() => {
      if (index === bigindex) {
        setOpenBig(true);
      }
    }, [index, bigindex]);

    return (
      <div className="contentandbig"> 
          <div>{econtent}</div>
          <div hidden={!openBig}>
            <BigImage info={data} setBig={setOpenBig} tabindex="0"
                      index={index} bigindex={bigindex} setBigindex={setBigindex}/>
          </div>
      </div>

    );

}

export default Entry;



    


    


