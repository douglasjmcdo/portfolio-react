import React, { useState, useEffect } from 'react';
import './css/entry.css';

const Entry=(data)=>{
    const [econtent, setEcontent] = useState(<div></div>);
    const type = data.value["type"];
//     const [ewrapper, setEwrapper] = useState(<div className="entry" key={ data.value["id"]}></div>);
    
    //todo: entry div: on-click, open the ImageMode component

    
//     const FillEntry=()=> {
//       return (
//         <div>
//           <div className="eTitle">
//             {data.value["title"]}
//           </div>
//           <div className="eContent">{ econtent }</div>
//         </div>
//       )
//     };

    //initialize econtent
    useEffect(() => {
      determineContent(data);
    }, [data]);


    function determineContent(source) {
      if (type === "individual") {
        setEcontent(<img className="entryimg" src={source.value["data"]} alt={source.value["alt"]}></img>);
//         setEwrapper(<div className="entry" onClick={openEntry} key={ source.value["id"] }>
//                       <FillEntry />
//                     </div>);
      }
      else if (type === "sub-page-c") {
        //todo: implement!
        setEcontent(<img className="entryimg" src={source.value["data"]} alt={source.value["alt"]}></img>)
//         var linkto = "/collection/" + source.value["url"];
//         setEwrapper(<Link to={linkto} key={ source.value["id"] }>
//                       <div className="entry"><FillEntry /></div>
//                     </Link>);
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
      <div className="entry" onClick={openEntry} key={ data.value["id"] }>
        <div className="eTitle">
          {data.value["title"]}
        </div>
        <div className="eContent">{ econtent }</div>
      </div>
    );
    
//     return (
//       <div>{ewrapper}</div>
//     );

}

export default Entry;



    


    


