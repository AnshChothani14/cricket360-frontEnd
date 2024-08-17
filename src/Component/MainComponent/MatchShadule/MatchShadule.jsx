 import React, { useState, useEffect } from 'react';
import { Divider, Button, TextField, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Dropdown from '../../DesignComponent/Dropdown/DropDown';
import './MatchShadule.css';
import { io } from "socket.io-client";
import CustomModal from '../../DesignComponent/Modal/Modal'
import { Typography } from '@mui/material';
import LoginButton from '../LoginLogout/login';
import { useAuth0 } from "@auth0/auth0-react";

const socket = io("https://10.1.5.143:4000",{
    transports: ["websocket", "polling"],
    timeout: 10000,
}
);

const MatchShadule = () => {
    const { user, isAuthenticated } = useAuth0();
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);
    const [newPlayer, setNewPlayer] = useState({ name: '', role: '', team: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentTeam, setCurrentTeam] = useState('');
    const [currentPlayerId, setCurrentPlayerId] = useState(null);
    const [team1Name, setTeam1Name] = useState('');
    const [team2Name, setTeam2Name] = useState('');
    const [conTeam1Name, setConTeam1Name] = useState('');
    const [conTeam2Name, setConTeam2Name] = useState('');
    const [matchType, setMatchType] = useState('');
    const [venue, setVenue] = useState('');
    const [date, setDate] = useState('');
    const [matchId, setMatchId] = useState();
    // const [adminID, setAdminId] = useState();
    const [adminPassword, setAdminPassword] = useState()
    const [open, setOpen] = useState(false);
    const[socketId, setSocketId] = useState("ja ja  khadeda")
    const [denger , setDenger] = useState(isAuthenticated)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    

    const playerRoles = [
        { text: 'Captain', href: '-' },
        { text: 'Vice Captain', href: '-' },
        { text: 'Bowler', href: '-' },
        { text: 'Batsman', href: '-' },
        { text: 'All Rounder', href: '-' },
        { text: 'Wicket Keeper', href: '-' }
    ];

    const matchTypes = [
        { text: 'T20', href: '-' },
        { text: 'One Day', href: '-' },
        { text: 'Test', href: '-' }
    ];

    const [matchData, setMatchData] = useState({});

    useEffect(() => {
        socket.on("matchData", (data) => {
            setSocketId(socket.id)
            console.log(socketId)
            setMatchData(data);
            console.log(matchData)
        });
        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });
        

        return () => {
            socket.off("matchData");
        };
    }, []);

    const handleAddOrUpdatePlayer = (team) => {
        if (!newPlayer.name || !newPlayer.role) {
            alert('Player name and role cannot be empty');
            return;
        }

        if ((team === 'team1' && team1Players.filter(player => player.role === newPlayer.role).length > 0 && (newPlayer.role === 'Captain' || newPlayer.role === 'Vice Captain')) ||
            (team === 'team2' && team2Players.filter(player => player.role === newPlayer.role).length > 0 && (newPlayer.role === 'Captain' || newPlayer.role === 'Vice Captain'))) {
            alert(`Each team can have only one ${newPlayer.role}`);
            return;
        }

        if (editMode) {
            if (team === 'team1') {
                setTeam1Players(team1Players.map(player => player.id === currentPlayerId ? { ...newPlayer, id: currentPlayerId } : player));
            } else {
                setTeam2Players(team2Players.map(player => player.id === currentPlayerId ? { ...newPlayer, id: currentPlayerId } : player));
            }
            setEditMode(false);
            setCurrentPlayerId(null);
        } else {
            if (team === 'team1') {
                setTeam1Players([...team1Players, { ...newPlayer, id: Date.now() }]);
            } else {
                setTeam2Players([...team2Players, { ...newPlayer, id: Date.now() }]);
            }
        }
        setNewPlayer({ name: '', role: '', team: '' });
    };

    const handleDeletePlayer = (team, playerId) => {
        if (team === 'team1') {
            setTeam1Players(team1Players.filter(player => player.id !== playerId));
        } else {
            setTeam2Players(team2Players.filter(player => player.id !== playerId));
        }
    };

    const handleEditPlayer = (team, player) => {
        setNewPlayer({ name: player.name, role: player.role, team });
        setEditMode(true);
        setCurrentPlayerId(player.id);
        setCurrentTeam(team);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setNewPlayer({ ...newPlayer, name: value });
        } else {
            switch (name) {
                case 'MatchType':
                    setMatchType(value);
                    break;
                case 'venue':
                    setVenue(value);
                    break;
                case 'date':
                    setDate(value);
                    break;
                default:
                    break;
            }
        }
    };

    const handleRoleSelect = (role) => {
        setNewPlayer({ ...newPlayer, role });
    };
    const generateRandomId = () => {
        const id = Math.random().toString(36).substring(2, 15);
        setMatchId(id);
    };
    const handleMIAlert = () => {
        alert('Match Id Is Allready Genrated');
    }


    const handleTeamNameChange = (team, value) => {
        if (team === 'team1') {
            setTeam1Name(value);
        } else {
            setTeam2Name(value);
        }
    };

    const handleConTeamName = () => {
        setConTeam1Name(team1Name);
        setConTeam2Name(team2Name);
    };

    const handleMatchTypeSelect = (type) => {
        setMatchType(type);
    };

    const handleAddMatch = () => {
        const adminID = user.email
        if (!team1Name || !team2Name || !matchType || !venue || !date || !matchId) {
            alert('Please fill in all fields');
            return;
        }

        // if (team1Players.length !== 12 || team2Players.length !== 12) {
        //     alert('Each team must have exactly 12 players');
        //     return;
        // }

        const team1Roles = team1Players.map(player => player.role);
        const team2Roles = team2Players.map(player => player.role);

        // if (!team1Roles.includes('Captain') || !team2Roles.includes('Captain') ||
        //     !team1Roles.includes('Vice Captain') || !team2Roles.includes('Vice Captain')) {
        //     alert('Each team must have a Captain and a Vice Captain');
        //     return;
        // }
        console.log(user.name)

        const matchData = {
            team1Name,
            team2Name,
            team1Players,
            team2Players,
            matchType,
            venue,
            date,
            matchId,
            adminID,
            adminPassword,
        };

        console.log("Sending match data:", matchData);
        socket.emit("matchData", matchData);
        handleOpen()

    };

    return (
        <div>
            {isAuthenticated ? <div className="container">
                <h1 className='my-4 '>Create A New Match</h1>
                <div className="playersSection">
                    <div className="teamname">
                        <p>*Enter the Valid Information about the Match</p>
                        <h3>Add Team Name</h3>
                        <div className="T">
                            <div className="t1">
                                <label>Team 1</label>
                                <TextField
                                    className='mt-2'
                                    placeholder="Enter 1st Team name"
                                    value={team1Name}
                                    onChange={(e) => handleTeamNameChange('team1', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                            </div>
                            <div className="t2">
                                <label>Team 2</label>
                                <TextField
                                    className='mt-2'
                                    placeholder="Enter 2nd Team name"
                                    value={team2Name}
                                    onChange={(e) => handleTeamNameChange('team2', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                            </div>
                        </div>
                        <button className='btn btn-primary btnTN' onClick={handleConTeamName}>Set Team Name</button>
                    </div>
                    <div className="addPlayer">
                        <h3>{editMode ? `Edit Player for ${currentTeam === 'team1' ? team1Name : team2Name}` : 'Add Player'}</h3>
                        <div className="playerInput">
                            <TextField
                                className='playerNameIP'
                                label="Player Name"
                                name="name"
                                value={newPlayer.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Dropdown
                                buttonText={newPlayer.role || "Select Player Role"}
                                dropdownItems={playerRoles.map(role => ({
                                    ...role,
                                    href: "#",
                                    onClick: () => handleRoleSelect(role.text)
                                }))}
                            />
                        </div>
                        <div className="playerButtonContainer">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddOrUpdatePlayer(editMode ? currentTeam : 'team1')}
                                disabled={editMode && currentTeam === 'team2'}
                            >
                                {editMode ? 'Update Player' : 'Add to Team 1'}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddOrUpdatePlayer(editMode ? currentTeam : 'team2')}
                                disabled={editMode && currentTeam === 'team1'}
                            >
                                {editMode ? 'Update Player' : 'Add to Team 2'}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="heroSecMS">
                    <div className="TeamName px-5">
                        <div className="temArea">
                            <div className="team1">
                                <div className="displayPlayer">
                                    <h3>{conTeam1Name} Players</h3>
                                    <Divider />
                                    <div className="team1Player mt-3">
                                        {team1Players.map(player => (
                                            <div key={player.id} className="playerCard">
                                                <span>{player.name} - {player.role}</span>
                                                <div>
                                                    <IconButton onClick={() => handleEditPlayer('team1', player)}>
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeletePlayer('team1', player.id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </div>
                                                <Divider />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="teamArea">
                            <div className="team2">
                                <div className="displayPlayer">
                                    <h3>{conTeam2Name} Players</h3>
                                    <Divider />
                                    <div className="team2Player mt-3">
                                        {team2Players.map(player => (
                                            <div key={player.id} className="playerCard">
                                                <span>{player.name} - {player.role}</span>
                                                <div>
                                                    <IconButton onClick={() => handleEditPlayer('team2', player)}>
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeletePlayer('team2', player.id)}>
                                                        <Delete />
                                                    </IconButton>
                                                    <Divider />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="other">
                    <h3>Other Information</h3>
                    <div className="otherInput">
                        <div className="MT d-flex">
                            <h5> Match Type : </h5>
                            <Dropdown
                                buttonText={matchType || "Select Match Type"}
                                dropdownItems={matchTypes.map(type => ({
                                    ...type,
                                    href: "#",
                                    onClick: () => handleMatchTypeSelect(type.text)
                                }))}
                            />
                        </div>
                        <div className="o1 mt-3 mb-3">
                            <TextField
                                className='mt-2  subO'
                                label="Venue"
                                name="venue"
                                value={venue}
                                onChange={(e) => handleInputChange(e)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                className='mt-2 subO'
                                label="Date"
                                name="date"
                                value={date}
                                onChange={(e) => handleInputChange(e)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                type='password'
                                className='mt-2 subO'
                                label="Password"
                                name="Password"
                                value={adminPassword}
                                onChange={(e) => { setAdminPassword(e.target.value) }}
                                fullWidth
                                margin="normal"
                            />
                            <CustomModal
                                open={open}
                                handleClose={handleClose}
                                title="Credentials For The Admin"
                                footer={
                                    <>
                                        <Button onClick={handleClose} color="primary">
                                            Close
                                        </Button>
                                        <Button onClick={handleClose} color="secondary">
                                            Ok
                                        </Button>
                                    </>
                                }
                            >
                                <div>
                                    <h5>Admin Password : {adminPassword} </h5> <br />
                                    <h5>Note : </h5>
                                    <p>Remember Id And PassWord to Start and Handle Match</p>
                                </div>
                            </CustomModal>
                        </div>
                    </div>
                    <div className="otherButtonContainer">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddMatch}
                        >
                            Add Match
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={matchId ? handleMIAlert : generateRandomId}
                        >
                            {matchId ? matchId : 'Genrate Match Id'}
                        </Button>
                    </div>
                </div>
            </div> : <LoginButton sign={denger} /> }
        </div>
    );
};

export default MatchShadule;
