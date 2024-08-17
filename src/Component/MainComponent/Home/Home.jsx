import React, { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import './Home.css';
import FeaturesCard from '../../DesignComponent/FeaturesCard/FeaturesCard';
import fetchCricbuzzData from '../../../Configration/NewsApi';
import { News_Photo, news_Gif, live, shadule, cooming, loginGif, Account } from '../../../Assets/photos.js';
import { Link } from 'react-router-dom';
import MatchShadule from '../MatchShadule/MatchShadule.jsx';
import News from '../News/News.jsx';
import LoginButton from '../LoginLogout/login.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from '../LoginLogout/logout.jsx';

const Home = () => {
    const [newsData, setNewsData] = useState([]);
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [adminID, setAdminID] = useState();

    const Features = [
        {
            name: 'Cricket News',
            gif: news_Gif,
            component: 'News',
            route: '/news'
        },
        {
            name: 'Schedule A Match',
            gif: shadule,
            component: MatchShadule,
            route: '/schedule'
        },
        {
            name: 'Live Match',
            gif: live,
            component: 'LiveMatch',
            route: '/live'
        },
        {
            name: 'More Coming Soon',
            gif: cooming,
            component: 'ComingSoon',
            route: '/coming-soon'
        },
        {
            name: isAuthenticated ? 'Admin Account' : "Admin Login",
            gif: isAuthenticated ? Account : loginGif,
            component: isAuthenticated ? LogoutButton : LoginButton,
            route: isAuthenticated ? '/account' : '/loginAdmin'
        },
    ];

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

    const saveUserToDatabase = async (user) => {
        try {
            console.log('Checking if user already exists in the database:', user);
            
            // Check if the user already exists
            const checkResponse = await fetch('https://10.1.5.143:4000/api/checkUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email }),
            });
    
            if (!checkResponse.ok) {
                throw new Error(`HTTP error! status: ${checkResponse.status}`);
            }
    
            const checkData = await checkResponse.json();
            if (checkData.exists) {
                console.log('User already exists:', user);
                return;
            }
    
            console.log('Saving new user to database:', user);
            const response = await fetch('https://10.1.5.143:4000/api/saveUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...user, adminID: user.email }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Response:', data);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };
    
    useEffect(() => {
        if (isAuthenticated && user) {
            saveUserToDatabase(user);
        }
    }, [isAuthenticated, user]);

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
            <h1 className='m-auto'>Features of Cricket360</h1>
            <div className="featureCards">
                {Features.map((item, index) => (
                    <div className="feature" key={index}>
                        <Link to={item.route} className='linkFeature'>
                            <FeaturesCard title={item.name} featureGif={item.gif} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
