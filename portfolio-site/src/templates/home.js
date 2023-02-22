import Board from '../board.js';
import { useOutletContext } from "react-router-dom";

const MainPage = () => {
 const data = useOutletContext();
 var usedata = "";
 var filters = "";
 var sorts = "";

 if (data) {
   usedata = data["data"];
   filters = data["filters"];
   sorts = data["sorts"];
 }
 return( 
 <div id="mainpage">
    <Board data={usedata} filters={filters} sorts={sorts} boardname="main" />
 </div>
 )
}

export default MainPage;