import { useOutletContext } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Board from '../board.js';
import '../css/collection.css';
import {useEffect, useState} from 'react';

const Collection = () => {
 const data = useOutletContext();
 const location = getCollectionName(useLocation().pathname);
 const [subpageinfo, setSubpageinfo] = useState("");
 console.log(location);
//  const prevpage = useNavigate();

 function getCollectionName(path) {
    //console.log(path);
    return path.split('/').pop();
 }

 //on data load in, set subpageinfo to data
 useEffect(() => {
   function getThisCollectionInfo(all) {
      for (let x in all) {
          if (all[x].type === "collection" && all[x]?.url === location) {
              return all[x];
          }
      }
   }

   setSubpageinfo(getThisCollectionInfo(data["data"]));
 }, [data, location]);


 return( 
 <div id="collection">
   <div className="collmainheader">
      <h2 className="ch2">COLLECTION: {subpageinfo?.title }</h2>
      <h3 className="ch3">{subpageinfo?.caption}</h3>
   </div>
   {/* <div> {JSON.stringify(data, null, 4)} </div> */}
   <Board data={data["data"]} filters={data["filters"]} sorts={data["sorts"]} boardname={location} />
   {/* <button onClick={() => prevpage(-1)}> Return to Search </button> */}
 </div>
 )
}

export default Collection;