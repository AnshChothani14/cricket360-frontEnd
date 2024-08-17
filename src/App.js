import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import VideoComponent from './Video/VideoComponent';
import './App.css';
import Header from './Component/SubComponent/Header/Header';
import Home from './Component/MainComponent/Home/Home';
import MatchShadule from './Component/MainComponent/MatchShadule/MatchShadule';
import MatchAdmin from './Component/MainComponent/AdminMatch/MatchAdmin';
import News from './Component/MainComponent/News/News';
import LoginButton from './Component/MainComponent/LoginLogout/login';
import { useAuth0 } from "@auth0/auth0-react";
import Account from './Component/MainComponent/Account/Account';


function App() {
    const [videoEnded, setVideoEnded] = useState(false);

    const handleVideoEnd = () => {
        setVideoEnded(true);
    };
    const { logout } = useAuth0();

    return (
        <div>
            {!videoEnded && <VideoComponent onVideoEnd={handleVideoEnd} />}
            {videoEnded && (
                <div className='glassy-gradient'>
                    <div className='headerDiv'>
                        <Header />
                        {/* <input aria-label="Time" type="time" /> */}
                    </div>
                    <Routes>
                        <Route path='/schedule' element={<MatchShadule />} />
                        <Route path='/news' element={<News />} />
                        <Route path="/" element={<Home />} />
                        <Route path='/matchAdmin' element={<MatchAdmin />} />
                        <Route path='/loginAdmin' element={<LoginButton />} />
                        <Route path='/account' element={<Account />} />
                    </Routes>
                </div>
            )}
        </div>
    );
}

export default App;
