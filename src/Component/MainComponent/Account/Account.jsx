import React, { useState, useEffect } from 'react';
import './Account.css';
import { useAuth0 } from "@auth0/auth0-react";
import { profileBG, versus, logoutImg } from '../../../Assets/photos.js';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../DesignComponent/Modal/Modal.jsx'; 
import { Button } from '@mui/material';

const Account = () => {
    const { user, isAuthenticated } = useAuth0();
    const [matchSchedule, setMatchSchedule] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [adminPassword, setAdminPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth0();
    const fetchMatchSchedule = async () => {
        try {
            const response = await fetch('https://10.1.5.143:4000/api/matchShaduleList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: user.email })
            });
            const data = await response.json();
            setMatchSchedule(data);
        } catch (error) {
            console.error('Error fetching match schedule:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchMatchSchedule();
        }
    }, [isAuthenticated, user]);

    const handleMatchClick = (match) => {
        console.log(match)
        setSelectedMatch(match);
        setModalOpen(true);
    };

    const handlePasswordChange = (event) => {
        setAdminPassword(event.target.value);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setAdminPassword('');
        setError('');
    };
    console.log(selectedMatch)

    const handleSubmitPassword = () => {
        if (adminPassword === selectedMatch.adminPassword) {
            handleModalClose();
            navigate('/matchAdmin', { state: { match: selectedMatch } });
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    return (
        <div>
            <div className="sec-1 container mt-5">
                <img src={profileBG} className='profileBG' alt="" />
            </div>
            <div className="container content">
                <div className="mainContainer">
                    <div className="containerAD mt-3">
                        <img src={isAuthenticated ? user.picture : null} className='profilePic' alt="" />
                        <div className="profileName">
                            <h1>{isAuthenticated ? user.name : 'Loading...'}</h1>
                            <p>{isAuthenticated ? user.email : 'Loading...'}</p>
                        </div>
                    </div>
                    <div className="mainSec-2">
                        <h2>Scheduled Matches</h2>
                        <div className="shaduleMatches my-4">
                            {matchSchedule.length > 0 ? (
                                matchSchedule.map((match, index) => (
                                    <div className="matchDetailMain" key={index} onClick={() => handleMatchClick(match)}>
                                        <div className="matchDetail">
                                            <div className="team1">
                                                <h5>{match.team1Name}</h5>
                                                <p>{match.team1Captain}</p>
                                            </div>
                                            <img src={versus} className='VS' alt="Versus" />
                                            <div className="team2">
                                                <h5>{match.team2Name}</h5>
                                                <p>{match.team2Captain}</p>
                                            </div>
                                        </div>
                                        <h6>{new Date(match.date).toLocaleString()}</h6>
                                        <h6>{match.venue}</h6>
                                    </div>
                                ))
                            ) : (
                                <p>No scheduled matches found.</p>
                            )}
                        </div>
                    </div>
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} >
                        <img src={logoutImg} alt="" className='lOutImg' />
                        <h5>LogOut</h5>
                    </button>
                </div>
            </div>
            <CustomModal
                open={modalOpen}
                handleClose={handleModalClose}
                title="Enter Admin Password"
                footer={
                    <div>
                        <Button onClick={handleModalClose}>Cancel</Button>
                        <Button onClick={handleSubmitPassword}>Submit</Button>
                    </div>
                }
            >
                <div>
                    <input
                        type="password"
                        value={adminPassword}
                        onChange={handlePasswordChange}
                        placeholder="Admin Password"
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </CustomModal>
        </div>
    );
};

export default Account;
