import axios from 'axios';
import { useState } from 'react';
import cheerio from 'cheerio';
import { useRef } from 'react';
import { parseHeader } from './parseData';

export default () => {
    const htmlParser = useRef(null);
    const [posts, updatePosts] = useState(undefined);
    const [header, updateHeader] = useState('Loading...');
    const getData = async () => {
        try {
            const nation = Math.floor((Math.random() * 149 + 1)).toString();
            if (nation == 100) {
                getData();
                return;
            }
            const response = await axios.get('https://travel.sygic.com/en/list/what-to-see-in-trinidad-and-tobago-country:' + nation)
            htmlParser.current = cheerio.load(response.data);
            // let placePhoto = htmlParser.current('.place-photo');
            // let placeDescription = htmlParser.current('.place-description');
            // let h3 = htmlParser.current('h3');
            // let openMap = htmlParser.current('.open-map');
            // let innerList = { placePhoto, placeDescription, h3, openMap };
            let innerList = htmlParser.current('.inner-list');
            let pageTitle = htmlParser.current('.page-title');
            updateHeader(parseHeader(pageTitle));
            cleanData(innerList);
        } catch (error) {
            console.log("data load fail")
        }
    }
    const cleanData = (innerList) => {
        let fullArr = Object.entries(innerList).slice(0, innerList.length - 1);
        let removeAdArr = fullArr.filter((item) => item[1].attribs.class !== "inner-list ad");
        updatePosts(removeAdArr);
    }
    return [posts, updatePosts, getData, header]
}