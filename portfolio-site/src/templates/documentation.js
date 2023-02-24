import { useOutletContext } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Board from '../board.js';
import {useEffect, useState} from 'react';
import "../css/documentation.css"

const Documentation = () => {
    const data = useOutletContext();
    const location = getCollectionName(useLocation().pathname);
    const [subpageinfo, setSubpageinfo] = useState("");
    const [templatearray, setTemplatearray] = useState([]);
    //  const prevpage = useNavigate();

    function getCollectionName(path) {
        //console.log(path);
        return path.split('/').pop();
    }

    //on data load in, set subpageinfo to data
    useEffect(() => {
        function getThisCollectionInfo(all) {
            for (let x in all) {
                if (all[x].type === "sub-page-d" && all[x]?.url === location) {
                    return all[x];
                }
            }
        }
        setSubpageinfo(getThisCollectionInfo(data["data"]));
    }, [data, location]);

    //once subpage is defined, start filling out the template array
    useEffect(() => {
        if (templatearray) {
            setTemplatearray([]);
        }
        if (subpageinfo) {
            subpageinfo.template.forEach(([type, content]) => {
                var nextdiv = "";
                switch (type) {
                    case "text":
                        nextdiv = (<div className="dtext" key={content}>{content}</div>)
                        break;
                    case "header":
                        nextdiv = (<h3 className="dheader" key={content}>{content}</h3>)
                        break;
                    case "board":
                        nextdiv = (<Board key={content} className="dboard" 
                            data={data["data"]} filters={data["filters"]} sorts={data["sorts"]} boardname={content} />)
                        break;
                    case "video":
                        let vidtype = content.split(".");
                        vidtype = "video/" + vidtype[vidtype.length - 1];
                        console.log(vidtype);

                        nextdiv = (
                        <video className="dvid" key={content}
                        controls
                        preload="auto">
                            <source src={content} type={vidtype}/>
                        </video>
                        )
                        break;
                    default:
                        console.log("no case for ", type);
                }
                setTemplatearray(templatearray => [...templatearray, nextdiv]);


            });
        }

    }, [subpageinfo])


    return( 
        <div id="documentation">
            <div className="documainheader">
                <h2>DOCUMENTATION: {subpageinfo?.title }</h2>
                <h3>{subpageinfo?.caption}</h3>
            </div>
           <div className="templatewrapper">{templatearray}</div>
        </div>
        )
}
export default Documentation;