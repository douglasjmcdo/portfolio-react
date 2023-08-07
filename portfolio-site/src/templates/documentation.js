import { useOutletContext } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Board from '../board.js';
import Entry from '../entry.js';
import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import "../css/documentation.css"

const Documentation = () => {
    const data = useOutletContext();
    const location = getCollectionName(useLocation().pathname);
    const [subpageinfo, setSubpageinfo] = useState("");
    const [templatearray, setTemplatearray] = useState([]);
    const [loaded, setLoaded] = useState(false);
    //  const prevpage = useNavigate();

    function getCollectionName(path) {
        //console.log(path);
        return path.split('/').pop();
    }

    //on data load in, set subpageinfo to data
    useEffect(() => {
        function getThisCollectionInfo(all) {
            for (let x in all) {
                if (all[x].type === "documentation" && all[x]?.url === location) {
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
                    case "link":
                        console.log(content);
                        let filler = "";
                        if (content["text"]) {
                            filler = content["text"];
                        } else {
                            filler = <img className="linkimg" key={content} src={content["image"]} alt={content["alt"]}/>
                        }
                        nextdiv = (<Link className="dlink" to={content["url"]} key={filler + content}>{filler}</Link>)
                        break;
                    case "header":
                        nextdiv = (<h3 className="dheader" key={content}>{content}</h3>)
                        break;
                    case "board":
                        nextdiv = (<Board key={content} className="dboard" 
                            data={data["data"]} filters={data["filters"]} sorts={data["sorts"]} boardname={content} />)
                        break;
                    case "image":
                        nextdiv = <img key={content} className="dimg" src={content["image"]} alt={content["alt"]}/>
                        break;
                    case "entry":
                        //technically, this makes a board with 1 entry in it. lol
                        let entryinfo = "";
                        if (isNaN(content)) {
                            entryinfo = data["data"].filter((e) => e["title"] === content);
                        } else {
                            entryinfo = data["data"].filter((e) => e["id"] === content);
                        }
                        console.log(entryinfo);
                        nextdiv = (<Board key={content} className="dboard dentry"
                                data={entryinfo} filters={data["filters"]} sorts={data["sorts"]} boardname={entryinfo["title"]} />)
                        
                        break;
                    case "video":
                        let vidtype = content.split(".");
                        vidtype = "video/" + vidtype[vidtype.length - 1];
                        console.log("VIDEO", content, vidtype);

                        nextdiv = (
                        <video className="dvid" key={content}
                        controls
                        preload="auto">
                            <source src={content} type={vidtype}/>
                        </video>
                        )
                        if (vidtype == "video/mkv") {
                            nextdiv = (
                                <video className="dvid" key={content}
                                controls
                                preload="auto"
                                src={content}>
                                </video>
                            )
                        }
                        break;
                    default:
                        console.log("no case for ", type);
                }
                setTemplatearray(templatearray => [...templatearray, nextdiv]);


            });
            setLoaded(true);
        }

        //eslint-disable-next-line
    }, [subpageinfo])

    useEffect(() => {
        console.log(loaded)

    }, [loaded])

    return( 
        <div id="documentation">
            <div className="documainheader">
                <h2>DOCUMENTATION: {subpageinfo?.title }</h2>
                <h3>{subpageinfo?.caption}</h3>
            </div>
            <div hidden={loaded}>LOADING...</div>
           <div hidden={!loaded} className="templatewrapper">{templatearray}</div>
        </div>
        )
}
export default Documentation;