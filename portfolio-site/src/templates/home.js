import Board from '../board.js';
import { useOutletContext } from "react-router-dom";

const MainPage = () => {
 const data = useOutletContext();
 return( 
 <div id="mainpage">
    <Board data={data} />
    <div>MAIN PAGE!</div>
 </div>
 )
}

export default MainPage;