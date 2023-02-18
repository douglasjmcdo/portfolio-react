import { useOutletContext } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import Board from '../board.js';

const Collection = () => {
 const data = useOutletContext();
 const location = getCollectionName(useLocation().pathname);
 const subpageinfo = getThisCollectionInfo(data);
 console.log(location);
 const prevpage = useNavigate();

 function getCollectionName(path) {
    console.log(path);
    return path.split('/').pop();
 }

 function getThisCollectionInfo(all) {
    for (let x in all) {
        if (all[x].type === "sub-page-c" && all[x]?.url == location) {
            return all[x];
        }
    }
 }


 return( 
 <div id="collection">
    <div>COLLECTION: {subpageinfo?.title }</div>
    <div>{subpageinfo?.caption}</div>
    {/* <div> {JSON.stringify(data, null, 4)} </div> */}
    <Board data={data} boardname={location} />
    <button onClick={() => prevpage(-1)}> Return to Search </button>
 </div>
 )
}

export default Collection;