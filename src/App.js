import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoComponent from './Video/VideoComponent';
import './App.css';
import Header from './Component/SubComponent/Header/Header';
import Home from './Component/MainComponent/Home/Home';
import MatchShadule from './Component/MainComponent/MatchShadule/MatchShadule';
import Viewer from './Component/MainComponent/Viewer.jsx/Viewer';
import  MatchAdmin from './Component/MainComponent/AdminMatch/MatchAdmin'

function App() {
  const [videoEnded, setVideoEnded] = useState(false);

  console.log(videoEnded)
  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  return (
    <Router>
      <div>
        {!videoEnded && <VideoComponent onVideoEnd={handleVideoEnd} />}
        {videoEnded && (
          <div>
            <div className='headerDiv'>
              <Header />
            </div>
            <Routes>
              <Route path="/viewer" element={<Viewer />} />
              <Route path="/matchAdmin" element={<MatchAdmin />} />
              <Route path="/" element={
                <>
                  <Home />
                  <div className='matchShaduleDiv'>
                    <MatchShadule />
                  </div>
                </>
              } />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;