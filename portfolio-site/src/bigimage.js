import React, {useState, useEffect } from 'react';
import './css/bigimage.css';
import { Link } from 'react-router-dom';

const BigImage=({data, setBig})=>{
    const [tags, setTags] = useState([]);

    function goodbye() {
        setBig(false);
    }

    useEffect(() => {
        function tagsCalculator() {
            var newtags = [];
            var linkto = "";
            var hashtext = "#";
            for (let x in data.value["industry"]) {
                linkto = "?filter=industry-" + data.value["industry"][x];
                hashtext = "#" + data.value["industry"][x];
                newtags.push(<Link className="hashlink" to={linkto} key={linkto}>{hashtext}</Link>);
            }
    
            for (let y in data.value["medium"]) {
                linkto = "?filter=medium-" + data.value["medium"][y];
                hashtext = "#" + data.value["medium"][y];
                newtags.push(<Link className="hashlink" to={linkto} key={linkto}>{hashtext}</Link>);
            }
            setTags(newtags);
        }
    
        tagsCalculator();
    }, [data]);

    
    return (
        <div className="bigimage" onClick={goodbye}>
                <img className="thefile" src={data.value["img"]} alt={data.value["alt"]}/>
                <div className="bigtitlebar">
                    <div className="bigtitle">{data.value["title"]}</div>
                    <div className="bigtags">{ tags }</div>
                </div>
                <div className = "bigcaption">{data.value["caption"]}</div>
        </div>
    );
}

export default BigImage;