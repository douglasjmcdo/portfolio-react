import Board from '../board.js';
import { useOutletContext } from "react-router-dom";

const MainPage = () => {
 const data = useOutletContext();
 const usedata = data[0];
 const filters = data[1];
 //console.log(data?, usedata, filters);
 return( 
 <div id="mainpage">
    <Board data={data} boardname="main" />
    <div>MAIN PAGE!</div>
 </div>
 )
}

export default MainPage;