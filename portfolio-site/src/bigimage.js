import React, {useState, useEffect } from 'react';
import './css/bigimage.css';
import { Link } from 'react-router-dom';

const BigImage=({info, setBig, index, bigindex, setBigindex})=>{
    const [tags, setTags] = useState([]);

    
    //CLOSE BIGIMAGE
    function goodbye() {
        setBig(false);
    }

    //IMAGE INDEX MANAGEMENT:
    function closeBimg() {
        setBigindex(-1);
    }

    function nextBimg() {
        setBigindex(bigindex + 1);
    }

    function prevBimg() {
        setBigindex(bigindex - 1);
    }

    //arrow key inputs to toggle between bigimages
    useEffect(() => {
        //this image is currently open: start tracking for keytabs
        if (index === bigindex) {
            function checkKey(event) {
                if (event.keyCode === 37) {
                    //left arrow key: go to previous bigimage
                    prevBimg();
                } else if (event.keyCode === 39) {
                    //right arrow key: go to next bigimage
                    nextBimg();
                }
                else if (event.keyCode === 27) {
                    //esc button: close bigimg
                    closeBimg();
                }
            }
            document.addEventListener("keyup", checkKey);
            return () => {
                document.removeEventListener("keyup", checkKey);
            };
        }
        //image should not be open
        else if (index !== bigindex) {
            goodbye();
        }
        //eslint-disable-next-line
    }, [index, bigindex]);

    //DATA LOAD:
    //once info is loaded in, calculate the tags
    useEffect(() => {
        function tagsCalculator() {
            var newtags = [];
            var linkto = "";
            var hashtext = "#";
            for (let x in info["industry"]) {
                linkto = "?filter=industry-" + info["industry"][x];
                hashtext = "#" + info["industry"][x];
                newtags.push(<Link className="hashlink" to={linkto} key={linkto}>{hashtext}</Link>);
            }
    
            for (let y in info["medium"]) {
                linkto = "?filter=medium-" + info["medium"][y];
                hashtext = "#" + info["medium"][y];
                newtags.push(<Link className="hashlink" to={linkto} key={linkto}>{hashtext}</Link>);
            }
            setTags(newtags);
        }
    
        tagsCalculator();
    }, [info]);

    
    return (
        <div className="bigimage" onClick={closeBimg}>
                <img className="thefile" src={info["img"]} alt={info["alt"]}/>
                <div className="bigtitlebar">
                    <div className="bigtitle">{info["title"]}</div>
                    <div className="bigtags">{ tags }</div>
                </div>
                <div className = "bigcaption">{info["caption"]}</div>
        </div>
    );
}

export default BigImage;