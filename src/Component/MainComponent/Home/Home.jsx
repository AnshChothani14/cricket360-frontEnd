import React, { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import './Home.css';
import Accordion from '../../DesignComponent/Card/Card';
import fetchCricbuzzData from '../../../Configration/NewsApi';
import { News_Photo } from '../../../Assets/photos';
import MediaCard from '../../DesignComponent/Card/Card';
import Badge from '@mui/material/Badge';

const Home = () => {
    const [newsData, setNewsData] = useState([]);

    const handleFetchData = async () => {
        try {
            const result = await fetchCricbuzzData();
            setNewsData(result.storyList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        handleFetchData();
    }, []);

    return (
        <div className='container Home mb-5'>
            <div className="poster my-5">
                <h2>Your Ultimate Source of</h2>
                <Typewriter
                    options={{
                        strings: ['Live Score Update', 'Cricket Tournaments', 'Match Highlights', 'Match Analysis'],
                        autoStart: true,
                        loop: true,
                        wrapperClassName: 'typewriter-text',
                        cursorClassName: 'typewriter-text',
                    }}
                />
            </div>
                <h1>News :</h1>
            <div className="news d-flex ">
                {newsData.length > 0 ? (
                    newsData.map((item, index) => {
                        if (item.story) {
                            const { hline, intro, source, storyType, context } = item.story;
                            return (
                                <Badge badgeContent={storyType} color="secondary"  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                    <div className="newsItem">
                                        <MediaCard
                                            key={index}
                                            image={News_Photo}
                                            title={hline}
                                            description={intro}
                                            source={source}
                                            context={context}
                                        />
                                    </div>
                                </Badge>
                            );
                        }
                        return null;
                    })
                ) : (
                    <p>Loading news...</p>
                )}
            </div>
        </div>
    );
};

export default Home;
