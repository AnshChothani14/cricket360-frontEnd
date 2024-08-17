import React, { useState, useEffect } from 'react';
import fetchCricbuzzData from '../../../Configration/NewsApi';
import { News_Photo } from '../../../Assets/photos.js';
import MediaCard from '../../DesignComponent/Card/Card';
import Badge from '@mui/material/Badge';
import './News.css'

const News = () => {
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
        <div className="news container">
            <h1>Latest News</h1>
            <div className="newsContainer">
                {newsData.length > 0 ? (
                    newsData.map((item, index) => {
                        if (item.story) {
                            const { hline, intro, source, storyType, context } = item.story;
                            return (
                                <Badge key={index} badgeContent={storyType} color="secondary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                    <div className="newsItem">
                                        <MediaCard
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

export default News;
