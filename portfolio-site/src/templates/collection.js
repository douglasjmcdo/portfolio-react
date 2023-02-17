import { useOutletContext } from "react-router-dom";

const Collection = () => {
 const data = useOutletContext();
 return( 
 <div id="collection">
    <div>COLLECTION!</div>
 </div>
 )
}

export default Collection;