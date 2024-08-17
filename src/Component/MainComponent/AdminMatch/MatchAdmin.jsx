import React, { useState, useEffect, useRef } from 'react';
import './MatchAdmin.css';
import Dropdown from '../../DesignComponent/Dropdown/DropDown'
import CustomTable from '../../DesignComponent/Table/Table';
import { io } from "socket.io-client";
import AccordionExpandIcon from '../../DesignComponent/Accordion/Accordion'
import { useLocation } from 'react-router-dom';
import CustomModal from '../../DesignComponent/Modal/Modal';
import TextField from '@mui/material/TextField';
import { Modal, Box, Typography, Button } from '@mui/material';
import axios from 'axios';



const MatchAdmin = ({ Data }) => {
    const [onStrike, setOnStrike] = useState(1);
    const [resultButtonText, setResultButtonText] = useState('Result');
    const [addToButtonText, setAddToButtonText] = useState('Add Runs To');
    const [bat1Runs, setBat1Runs] = useState(0);
    const [bat1Name, setBat1Name] = useState('Set A Batter 1');
    const [bat2Name, setBat2Name] = useState('Set A Batter 2');
    const [bat2Runs, setBat2Runs] = useState(0);
    const [bat1Balls, setBat1Balls] = useState(0);
    const [bat2Balls, setBat2Balls] = useState(0);
    const [totalRuns, setTotalRuns] = useState(0);
    const [wicketsFallen, setWicketsFallen] = useState(0);
    const [currentOver, setCurrentOver] = useState(0);
    const [subOvers, setSubOvers] = useState(0);
    const [message, setMessage] = useState('');
    const [socketId, setSocketId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [team1name, setTeam1Name] = useState();
    const [team2name, setTeam2Name] = useState();
    const [vanue, setVanue] = useState();
    const [date, setDate] = useState();
    const [matchType, setMatchType] = useState();
    const location = useLocation();
    const [tossWinner, setTossWinner] = useState('Set Toss Winner');
    const [isDisable, setIsDisable] = useState(false);
    const [showTossDropdown, setShowTossDropdown] = useState(false);
    const [tossDecision, setTossDecision] = useState('Choose Bat or Bowl');
    const [isDecisionDisable, setIsDecisionDisable] = useState(false);
    const [battingTeam, setBattingTeam] = useState();
    const [bowlerName, setBowlerName] = useState('Set a Bowler');
    const [bowlingStats, setBowlingStats] = useState([]);
    const [showBowlerModal, setShowBowlerModal] = useState(false);
    const [nonBattingPlayers, setNonBattingPlayers] = useState([]);
    const [isBowlerButtonDisabled, setIsBowlerButtonDisabled] = useState(true);
    const [isOverInProgress, setIsOverInProgress] = useState(false);
    const [showBatterModal, setShowBatterModal] = useState(false);
    const [battingPlayers, setBattingPlayers] = useState([]);
    const [isBatter1ButtonDisabled, setIsBatter1ButtonDisabled] = useState(false);
    const [isBatter2ButtonDisabled, setIsBatter2ButtonDisabled] = useState(false);
    const [battingStats, setBattingStats] = useState([]);
    const [selectedBatter, setSelectedBatter] = useState(null);
    const [outPlayers, setOutPlayers] = useState([]);
    const [overNumber, setOverNumber] = useState();
    const [overDisable, setOverDisable] = useState(false)
    const [isFirstInningsOver, setIsFirstInningsOver] = useState(false);
    const [target, setTarget] = useState();
    const [dataSourceForBalling, setDataSourceForBalling] = useState([]);
    const [dataSourceForBatting, setDataSourceForBatting] = useState([]);
    const { match } = location.state || {};
    const [winner, setWinner] = useState();
    const [openWinnerModal, setOpenWinnerModal] = useState(false)
    const [matchEnd, setMatchEnd] = useState(false)
    const [ballResults, setBallResults] = useState(['', '', '', '', '', '']);
    const [matchUpdate, setMatchUpdate] = useState()
    const [matchID, setMatchID] = useState()
    const [previousOvers, setPreviousOvers] = useState([]);
    const signal = useRef(false)

    useEffect(() => {
        console.log(match);
        setMatchID(match.matchId)
        const newSocket = io('wss://10.1.5.143:3000/socket.io', {
            transports: ["websocket", "polling"],
        });
        newSocket.on("connect", () => {
            setSocketId(newSocket.id);
            setIsConnected(true);
            console.log('MatchAdmin connected:', newSocket.id);
            newSocket.on("matchData", (data) => {
                console.log("Received match data:", data);
                setTeam1Name(data.team1Name);
                setTeam2Name(data.team2Name);
                setVanue(data.venue);
                setDate(data.date);
                setMatchType(data.matchType);
            });
        });
        console.log(isConnected);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (subOvers === 0) {
            setIsBowlerButtonDisabled(false);
        }
    }, [subOvers]);

    useEffect(() => {
        const currentOverNumber = Number(currentOver);
        const overNumberLimit = Number(overNumber);

        console.log(currentOverNumber, overNumberLimit);
        let totalPlayers = battingPlayers.length;

        if (currentOverNumber === overNumberLimit) {
            handleEndInnings();
        }
    }, [currentOver, wicketsFallen]);

    useEffect(() => {
        if (overNumber !== 0) {
            const isMatchWon = () => {
                if (currentOver === overNumber && totalRuns >= target) {
                    setWinner(battingTeam);
                    setMatchEnd(true);
                    setOpenWinnerModal(true);
                } else if (currentOver === overNumber && totalRuns < target) {
                    setWinner(nonBattingPlayers[0].teamName);
                    setMatchEnd(true);
                    setOpenWinnerModal(true);
                } else if (totalRuns >= target) {
                    setWinner(battingTeam);
                    setMatchEnd(true);
                    setOpenWinnerModal(true);
                }
            };
            isMatchWon();
        } else {
            alert("set The Over First then The Match")
        }

    }, [currentOver, totalRuns, target, battingTeam, nonBattingPlayers, overNumber,]);


    useEffect(() => {
        const matchState = {
            matchID,
            onStrike,
            resultButtonText,
            bat1Runs,
            bat1Name,
            bat2Name,
            bat2Runs,
            bat1Balls,
            bat2Balls,
            totalRuns,
            wicketsFallen,
            currentOver,
            subOvers,
            tossWinner,
            tossDecision,
            battingTeam,
            bowlerName,
            bowlingStats,
            battingStats,
            selectedBatter,
            outPlayers,
            overNumber,
            isFirstInningsOver,
            target,
            dataSourceForBalling,
            dataSourceForBatting,
            winner,
            matchEnd,
            ballResults,
        };
        const FinalSignalForPost = sessionStorage.getItem('signal')
        if (FinalSignalForPost) {
            axios.post('https://10.1.5.143:4000/saveMatch', { matchID, ...matchState })
        }
    }, []);


    useEffect(() => {
        const FinalSignalForGet = sessionStorage.getItem("signal")
        if (FinalSignalForGet) {
            const response = axios.get(`https://10.1.5.143/match/getMatch/${matchID}`)
            const savedMatchState = response.data
            if (savedMatchState) {
                const matchState = JSON.parse(savedMatchState);
                console.log(matchState)
                setOnStrike(matchState.onStrike);
                setResultButtonText(matchState.resultButtonText);
                setBat1Runs(matchState.bat1Runs);
                setBat1Name(matchState.bat1Name);
                setBat2Name(matchState.bat2Name);
                setBat2Runs(matchState.bat2Runs);
                setBat1Balls(matchState.bat1Balls);
                setBat2Balls(matchState.bat2Balls);
                setTotalRuns(matchState.totalRuns);
                setWicketsFallen(matchState.wicketsFallen);
                setCurrentOver(matchState.currentOver);
                setSubOvers(matchState.subOvers);
                setTossWinner(matchState.tossWinner);
                setTossDecision(matchState.tossDecision);
                setBattingTeam(matchState.battingTeam);
                setBowlerName(matchState.bowlerName);
                setBowlingStats(matchState.bowlingStats);
                setBattingStats(matchState.battingStats);
                setSelectedBatter(matchState.selectedBatter);
                setOutPlayers(matchState.outPlayers);
                setOverNumber(matchState.overNumber);
                setIsFirstInningsOver(matchState.isFirstInningsOver);
                setTarget(matchState.target);
                setDataSourceForBalling(matchState.dataSourceForBalling);
                setDataSourceForBatting(matchState.dataSourceForBatting);
                setWinner(matchState.winner);
                setMatchEnd(matchState.matchEnd);
                setBallResults(matchState.ballResults || ['', '', '', '', '', '']);
            }
        }
    }, []);

    useEffect(() => {
        if (matchEnd) {
            localStorage.removeItem('matchState');
        }
    }, [matchEnd]);

    const handleOpenWM = () => setOpenWinnerModal(true);
    const handleCloseWM = () => setOpenWinnerModal(false);

    const handleBatterSelection = (player, Number) => {
        if (Number === 1) {
            setIsBatter1ButtonDisabled(true);
            setBat1Name(player.name)
        } else {
            setIsBatter2ButtonDisabled(true);
            setBat2Name(player.name)
        }
        setShowBatterModal(false);
        setBattingStats(prevStats => {
            if (!prevStats.some(stat => stat.name === player.name)) {
                return [...prevStats, { name: player.name, runs: 0, ballsFaced: 0, fours: 0, sixes: 0, strikeRate: 0 }];
            }
            return prevStats;
        });
    };

    const handleBatterModalShow = (batterNumber) => {
        const isTossDetailsSet = tossWinner !== 'Set Toss Winner' && tossDecision !== 'Choose Bat or Bowl';
        if (isTossDetailsSet) {
            const battingTeamPlayers = match.team1Name === battingTeam ? match.team1Players : match.team2Players;
            const availablePlayers = battingTeamPlayers.filter((player) => {
                return (
                    player.name !== bat1Name &&
                    player.name !== bat2Name &&
                    !outPlayers.includes(player.name)
                );
            });
            setBattingPlayers(availablePlayers);
            setSelectedBatter(batterNumber);
            setShowBatterModal(true);
        } else {
            alert('Set The Toss Winner And Set The Toss Winner s Decision To Set the Batter');
        }
    };

    const handleEndInnings = () => {
        if (battingTeam && nonBattingPlayers.length > 0) {
            setTarget(totalRuns + 1);
            setIsFirstInningsOver(true);

            setBowlerName('Set a Bowler');
            setCurrentOver(0);
            setWicketsFallen(0);
            setOverDisable(true);
            setBat1Balls(0);
            setBat1Runs(0);
            setBat2Balls(0);
            setBat2Runs(0);
            setBat1Name('Set a Batter 1');
            setBat2Name('Set a Batter 2');
            setIsBatter1ButtonDisabled(false);
            setIsBatter2ButtonDisabled(false);
            setTotalRuns(0);
            const tempBattingTeam = battingTeam;
            let tempNonBattingTeam;
            if (battingTeam === match.team1Name) {
                tempNonBattingTeam = match.team2Name;
            } else {
                tempNonBattingTeam = match.team1Name;
            }
            setBattingTeam(tempNonBattingTeam);
            if (tempNonBattingTeam === match.team1Name) {
                setNonBattingPlayers(match.team2Players);
            } else {
                setNonBattingPlayers(match.team1Players);
            }
        }
    }

    const handleOverChange = (event) => {
        setOverNumber(event.target.value);
    };

    const updateBattingStats = (runs, balls, batter) => {
        setBattingStats(prevStats =>
            prevStats.map(stat =>
                stat.name === batter
                    ? {
                        ...stat,
                        runs: stat.runs + runs,
                        ballsFaced: stat.ballsFaced + balls,
                        strikeRate: ((stat.runs + runs) / (stat.ballsFaced + balls) * 100).toFixed(2),
                    }
                    : stat
            )
        );

        setDataSourceForBatting(prevData => {
            const existingBatter = prevData.find(batterItem => batterItem.name === batter);

            if (existingBatter) {
                return prevData.map(batterItem =>
                    batterItem.name === batter
                        ? {
                            ...batterItem,
                            runs: battingStats.find(stat => stat.name === batter).runs,
                            ballsFaced: battingStats.find(stat => stat.name === batter).ballsFaced,
                            strikeRate: battingStats.find(stat => stat.name === batter).strikeRate,
                        }
                        : batterItem
                );
            } else {
                const newBatter = battingStats.find(stat => stat.name === batter);
                return [...prevData, {
                    name: newBatter.name,
                    runs: newBatter.runs,
                    ballsFaced: newBatter.ballsFaced,
                    strikeRate: newBatter.strikeRate,
                }];
            }
        });
    };

    const handleOUTBtn = (number) => {
        let Out = window.confirm(`Are You sure To OUT The Batter NO ${number} `)

        if (Out) {
            if (number === 1 && bat1Name !== 'Set A Batter 1') {
                setBat1Name('Set A Batter 1')
                setIsBatter1ButtonDisabled(false)
                setBat1Balls(0)
                setBat1Runs(0)
                setWicketsFallen(wicketsFallen + 1)
                setOutPlayers([...outPlayers, bat1Name]);
            } else if (bat1Name == 'Set A Batter 2') {
                setBat2Name('Set A Batter 2')
                setIsBatter2ButtonDisabled(false)
                setBat2Balls(0)
                setBat2Runs(0)
                setWicketsFallen(wicketsFallen + 1)
                setOutPlayers([...outPlayers, bat2Name]);
            }
            else {
                alert('Set The Batter First to Out Them ')
            }
        }
    }

    const handleBowlerSelection = (player) => {
        setBowlerName(player.name);
        setShowBowlerModal(false);
        setBowlingStats(prevStats => {
            if (!prevStats.some(stat => stat.name === player.name)) {
                return [...prevStats, { name: player.name, overs: 0, runs: 0, wickets: 0, economy: 0 }];
            }
            return prevStats;
        });
    };

    const handleBowlerModalShow = () => {
        if (match && match.team1Players && match.team2Players) {
            const nonBattingTeamPlayers = match.team1Name === battingTeam ? match.team2Players : match.team1Players;
            setNonBattingPlayers(nonBattingTeamPlayers);
            setShowBowlerModal(true);
        }
    };

    const handleBowlerModalClose = () => {
        setShowBowlerModal(false);
    };

    const handleResultItemClick = (text) => {
        setResultButtonText(text);
    };

    const handleAddToItemClick = (text) => {
        setAddToButtonText(text);
    };

    const toggleOnStrike = (batNumber) => {
        setOnStrike(batNumber);
    };

    const handleTossSelection = (teamName) => {
        setTossWinner(teamName);
        setIsDisable(true);
    };

    const tossDropdownItems = [
        { text: match.team1Name, onClick: () => handleTossSelection(match.team1Name) },
        { text: match.team2Name, onClick: () => handleTossSelection(match.team2Name) },
    ];

    const handleTossDecisionSelection = (decision) => {
        setTossDecision(decision);
        setIsDecisionDisable(true);
        setBattingTeam(decision === 'Bat' ? tossWinner : tossWinner === match.team1Name ? match.team2Name : match.team1Name);
    };



    const handleFinalUpdateClick = () => {

        if (resultButtonText === 'Result') {
            alert('Please enter a valid number of runs');
            return;
        }

        if ((bat1Name && bat2Name) === 'Set a Batter' || bowlerName === 'Set a Bowler') {
            alert('Please select both a batter and a bowler before updating the score.');
            return;
        }
        signal.current = true
        setOverDisable(true)
        sessionStorage.setItem("signal", signal.current)

        let runsToAdd = 0;
        let newBat1Balls = bat1Balls;
        let newBat2Balls = bat2Balls;
        let newBat1Runs = bat1Runs;
        let newBat2Runs = bat2Runs;
        let newTotalRuns = totalRuns;
        let newWicketsFallen = wicketsFallen;

        switch (resultButtonText) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                runsToAdd = parseInt(resultButtonText, 10);
                if (onStrike === 1) {
                    newBat1Balls += 1;
                    newBat1Runs += runsToAdd;
                } else {
                    newBat2Balls += 1;
                    newBat2Runs += runsToAdd;
                }
                newTotalRuns += runsToAdd;

                break;

            case 'WT':
                newWicketsFallen += 1;
                if (onStrike === 1) {
                    newBat1Balls += 1;
                } else {
                    newBat2Balls += 1;
                }
                if (onStrike === 1) {
                    setBat1Name('Set a Batter')
                    setIsBatter1ButtonDisabled(false)
                    setBat1Balls(0)
                    setBat1Runs(0)
                    setOutPlayers([...outPlayers, bat1Name]);
                }
                else {
                    setBat2Name('Set a Batter')
                    setIsBatter2ButtonDisabled(false)
                    setBat2Balls(0)
                    setBat2Runs(0)
                    setOutPlayers([...outPlayers, bat2Name]);
                }
                break;

            case 'WD':
            case 'NB':
                newTotalRuns += 1;
                if (resultButtonText === 'NB' && addToButtonText === 'player') {
                    if (onStrike === 1) {
                        newBat1Runs += 1;
                    } else {
                        newBat2Runs += 1;
                    }
                }

                const extraBallResult = `${resultButtonText}`;
                const extraBallElement = document.createElement('div');
                extraBallElement.innerHTML = `<h3>${extraBallResult}</h3>`;
                extraBallElement.classList.add('extra-ball');

                const currentBallElement = document.querySelector(`.ball-${subOvers + 1}`);
                if (currentBallElement) {
                    currentBallElement.insertAdjacentElement('beforebegin', extraBallElement);
                }

                break;


            case 'LB':
                if (onStrike === 1) {
                    newBat1Balls += 1;
                } else {
                    newBat2Balls += 1;
                }
                break;

            default:
                alert('Invalid result type');
                return;
        }
        const updatedBallResults = [...ballResults];
        updatedBallResults[subOvers] = resultButtonText;
        setBallResults(updatedBallResults);

        setBat1Balls(newBat1Balls);
        setBat2Balls(newBat2Balls);
        setBat1Runs(newBat1Runs);
        setBat2Runs(newBat2Runs);
        setTotalRuns(newTotalRuns);
        setWicketsFallen(newWicketsFallen);
        setResultButtonText('Result');
        setAddToButtonText('Add Runs To');

        const ballNumber = subOvers + 1;
        const ballResult = `${resultButtonText}`;
        const ballElement = document.querySelector(`.ball-${ballNumber}`);
        if (ballElement && resultButtonText !== 'WD' && resultButtonText !== 'NB') {
            ballElement.innerHTML = `<h3>${ballResult}</h3>`;
        }

        if (resultButtonText !== 'WD' && resultButtonText !== 'NB') {
            if (subOvers < 5) {
                setSubOvers(subOvers + 1);
                setIsOverInProgress(true);
                setIsBowlerButtonDisabled(true);
            } else {
                setPreviousOvers([...previousOvers, updatedBallResults]);

                setSubOvers(0);
                setCurrentOver(currentOver + 1);
                setIsOverInProgress(false);
                setIsBowlerButtonDisabled(false);
                for (let i = 1; i <= 6; i++) {
                    const ballElement = document.querySelector(`.ball-${i}`);
                    if (ballElement) {
                        ballElement.innerHTML = '';
                    }
                }
            }
        }

        console.log('isBowlerButtonDisabled:', isBowlerButtonDisabled);
        updateBowlingStats(runsToAdd, resultButtonText);
        const batterName = onStrike === 1 ? bat1Name : bat2Name;
        updateBattingStats(runsToAdd, 1, batterName);
    };

    const renderBallResults = () => {
        return ballResults.map((result, index) => (
            <div key={index} className={`ball-${index + 1}`}>
                <h5>{result}</h5>
            </div>
        ));
    };

    const updateBowlingStats = (runs, result) => {
        setBowlingStats(prevStats =>
            prevStats.map(stat =>
                stat.name === bowlerName
                    ? {
                        ...stat,
                        overs: result === 'WD' || result === 'NB' ? stat.overs : stat.overs + 0.1,
                        runs: stat.runs + (result === 'WD' || result === 'NB' ? 1 : runs),
                        wickets: result === 'WT' ? stat.wickets + 1 : stat.wickets,
                        economy: ((stat.runs + (result === 'WD' || result === 'NB' ? 1 : runs)) / (stat.overs + (result === 'WD' || result === 'NB' ? 0 : 1))).toFixed(2),
                    }
                    : stat
            )
        );

        const existingBowler = dataSourceForBalling.find(bowler => bowler.name === bowlerName);

        if (existingBowler) {
            existingBowler.overs = bowlingStats.find(stat => stat.name === bowlerName).overs.toFixed(1);
            existingBowler.runs = bowlingStats.find(stat => stat.name === bowlerName).runs;
            existingBowler.wickets = bowlingStats.find(stat => stat.name === bowlerName).wickets;
            existingBowler.economy = bowlingStats.find(stat => stat.name === bowlerName).economy;
        } else {
            const newBowler = {
                name: bowlerName,
                overs: bowlingStats.find(stat => stat.name === bowlerName).overs.toFixed(1),
                runs: bowlingStats.find(stat => stat.name === bowlerName).runs,
                wickets: bowlingStats.find(stat => stat.name === bowlerName).wickets,
                economy: bowlingStats.find(stat => stat.name === bowlerName).economy,
            };
            setDataSourceForBalling([...dataSourceForBalling, newBowler]);
        }
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Over',
            dataIndex: 'overs',
        },
        {
            title: 'Runs',
            dataIndex: 'runs',
        },
        {
            title: 'Wicket',
            dataIndex: 'wickets',
        },
        {
            title: 'Eco',
            dataIndex: 'economy',
        }
    ];
    const columnsForBatter = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Runs',
            dataIndex: 'runs',
        },
        {
            title: 'BallsFaced',
            dataIndex: 'ballsFaced',
        },
        {
            title: 'Fours',
            dataIndex: 'fours',
        },
        {
            title: 'Sixes',
            dataIndex: 'sixes',
        },
        {
            title: 'StrikeRate',
            dataIndex: 'strikeRate',
        }
    ];
    const dataSourceForBater = [
        {
            "name": "Virat Kohli",
            "runs": 85,
            "ballsFaced": 60,
            "fours": 8,
            "sixes": 2,
            "strikeRate": 141.67
        },
    ];
    const resultDropdownItems = [
        { text: '0', onClick: () => setResultButtonText(0) },
        { text: '1', onClick: () => setResultButtonText(1) },
        { text: '2', onClick: () => setResultButtonText(2) },
        { text: '3', onClick: () => setResultButtonText(3) },
        { text: '4', onClick: () => setResultButtonText(4) },
        { text: '5', onClick: () => setResultButtonText(5) },
        { text: '6', onClick: () => setResultButtonText(6) },
        {
            text: 'WT',
            subItems: [
                { text: 'Catch', onClick: () => setResultButtonText('WT') },
                { text: 'Caught Behind', onClick: () => setResultButtonText('WT') },
                { text: 'Stump Out', onClick: () => setResultButtonText('WT') },
                { text: 'Run Out', onClick: () => setResultButtonText('WT') },
                { text: 'LBW', onClick: () => setResultButtonText('WT') }
            ]
        },
        { text: 'WD', onClick: () => setResultButtonText('WD') },
        { text: 'NB', onClick: () => setResultButtonText('NB') },
        { text: 'LB', onClick: () => setResultButtonText('LB') },
    ];
    const addToDropdownItems = [
        { text: 'Player', onClick: () => setAddToButtonText('player') },
        { text: 'Team', onClick: () => setAddToButtonText('team') },
    ];
    const tossDecisionDropdownItems = [
        { text: 'Bat', onClick: () => handleTossDecisionSelection('Bat') },
        { text: 'Bowl', onClick: () => handleTossDecisionSelection('Bowl') },
    ];

    return (
        <div>
            <div className="container Toss_sec ">
                <div className="OverSelection d-flex my-3 ">
                    <h4>
                        The Over Number
                    </h4>
                    <TextField
                        id="outlined-basic"
                        label="SetOver"
                        type='number'
                        onChange={handleOverChange}
                        value={overNumber}
                        variant="outlined"
                        disabled={overDisable}
                    />
                </div>
                <div className="TossResult">
                    <h4>Toss Winner:
                        <button className='btn' disabled={isDisable}>
                            <h5>{isDisable ? tossWinner : <Dropdown buttonText={tossWinner} dropdownItems={tossDropdownItems} />}</h5>
                        </button>
                    </h4>
                </div>
                <div className="SelectionResult">
                    <h4>Decision:
                        <button className='btn' disabled={isDecisionDisable}>
                            <h5>{isDecisionDisable ? tossDecision : <Dropdown buttonText={tossDecision} dropdownItems={tossDecisionDropdownItems} />}</h5>
                        </button>
                    </h4>
                </div>
                <div className="Target d-flex my-3">
                    <h4>
                        Target :  {target ? target : 'TBD'}
                    </h4>
                </div>
            </div>
            <div className="container score mt-5">
                <div className="h1TC text-center ">
                    <h1>Score Section </h1>
                </div>
                <div className="scoreCard">
                    <div className="btMan">
                        <div className="batsman-1">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleBatterModalShow(1)}
                                disabled={isBatter1ButtonDisabled}
                            >
                                {bat1Name ? bat1Name : 'Set a Batter 1'}
                            </button>
                            <h5 className="batsman-1-runs">{bat1Runs}({bat1Balls}) </h5>
                        </div>
                        <div className="batsman-2">
                            <button
                                className="btn btn-primary"
                                onClick={() => handleBatterModalShow(2)}
                                disabled={isBatter2ButtonDisabled}
                            >
                                {bat2Name ? bat2Name : 'Set a Batter 2'}
                            </button>
                            <h5 className="batsman-1-runs">{bat2Runs}({bat2Balls}) </h5>
                        </div>
                    </div>
                    <div className="RWO">
                        <div className="RW">
                            <h5>{totalRuns} / {wicketsFallen} </h5>
                        </div>
                        <div className="O">
                            <h5>Overs: {currentOver}.{subOvers}</h5>
                        </div>
                    </div>
                    <div className="ball">
                        <div className="baller">
                            <button
                                className="btn btn-primary"
                                onClick={handleBowlerModalShow}
                                disabled={isBowlerButtonDisabled}
                            >
                                {bowlerName ? bowlerName : 'Set a Bowler'}
                            </button>
                        </div>
                        <div className="overScore">
                            {renderBallResults()}
                        </div>
                    </div>
                </div>
                {winner ? null : <div className="updateScore mt-3 p-3">
                    <h3>Update Score :</h3>
                    <div className="updateOptions">
                        <Dropdown buttonText={resultButtonText} dropdownItems={resultDropdownItems} onItemClick={handleResultItemClick} />
                        <Dropdown buttonText={addToButtonText} dropdownItems={addToDropdownItems} onItemClick={handleAddToItemClick} />
                    </div>
                    <button className='btn FU' onClick={handleFinalUpdateClick}>Final Update</button>
                </div>}
                {winner ? <h1 className='mt-5 text-center' >Team {winner} Won The Game </h1> : <div className="updateBatsmanInfo mt-3 p-3">
                    <h3>Update Batsman Information :</h3>
                    <div className="updateBatInfo mt-5">
                        <div className={`sec-for-bat-1 ${onStrike === 1 ? 'active' : ''}`} onClick={() => toggleOnStrike(1)}>
                            <div className={`batsman-info `}>
                                <h5 >{bat1Name} </h5> <br />
                                <h5 >{bat1Runs}({bat1Balls}) </h5>
                            </div>
                            <button className='btn btn-secondary out' onClick={() => handleOUTBtn(1)} > Out </button>
                        </div>
                        <div className={`sec-for-bat-2 ${onStrike === 2 ? 'active' : ''}`} onClick={() => toggleOnStrike(2)}>
                            <div className={`batsman-info `}>
                                <h5 >{bat2Name} </h5> <br />
                                <h5 >{bat2Runs}({bat2Balls}) </h5>
                            </div>
                            <button className='btn btn-secondary out' onClick={() => handleOUTBtn(2)} > Out </button>
                        </div>
                    </div>
                </div>}
            </div>
            <div className="container matchInfo mt-5">
                <div className="h1TC text-center ">
                    <h1>Match Information </h1>
                </div>
                <div className="teamSec">
                    <div className="team1 mt-4">
                        <h4>Team 1 </h4>
                        <AccordionExpandIcon data={match.team1Players} teamName={match.team1Name} />
                    </div>
                    <div className="team1 mt-4">
                        <h4>Team 2 </h4>
                        <AccordionExpandIcon data={match.team2Players} teamName={match.team2Name} />
                    </div>
                </div>
                <div className="otherInfo d-flex ">
                    <div className="vanue">
                        <h4>Venue: {match.venue}</h4>
                    </div>
                    <div className="date">
                        <h4>Date: {match.date}</h4>
                    </div>
                    <div className="type">
                        <h4>Type: {match.matchType}</h4>
                    </div>
                </div>
            </div>
            <div className="container balling mt-5">
                <div className="h1TC text-center ">
                    <h1>Bowling Summary </h1>
                </div>
                <div className="tableBalling">
                    <CustomTable
                        columns={columns}
                        data={dataSourceForBalling}
                        size="large"
                        title="Bowling Stats"
                    />
                </div>
            </div>
            <div className="container batting mt-5">
                <div className="h1TC text-center ">
                    <h1>Batting Summary </h1>
                </div>
                <div className="tableBalling">
                    <CustomTable
                        columns={columnsForBatter}
                        data={dataSourceForBatting}
                        size="large"
                        title="Batting Stats"
                    />
                </div>
            </div>
            {showTossDropdown && (
                <div className="tossDropdown">
                    <ul>
                        <li onClick={() => handleTossSelection(match.team1Name)}>{match.team1Name}</li>
                        <li onClick={() => handleTossSelection(match.team2Name)}>{match.team2Name}</li>
                    </ul>
                </div>
            )}
            {showBowlerModal && (
                <CustomModal
                    open={showBowlerModal}
                    handleClose={() => setShowBowlerModal(false)}
                    title="Select a Bowler"
                    footer={null}
                >
                    <ul className="bowler-list">
                        {nonBattingPlayers.map((player) => (
                            <li
                                key={player.id}
                                className="bowler-item"
                                onClick={() => handleBowlerSelection(player)}
                            >
                                {player.name}
                            </li>
                        ))}
                    </ul>
                </CustomModal>
            )}
            {showBatterModal && (
                <CustomModal
                    open={showBatterModal}
                    handleClose={() => setShowBatterModal(false)}
                    title={`Select a Batter ${selectedBatter}`}
                    footer={null}
                >
                    <ul className="batter-list">
                        {battingPlayers.map((player) => (
                            <li
                                key={player.id}
                                className="batter-item"
                                onClick={() => handleBatterSelection(player, selectedBatter)}
                            >
                                {player.name}
                            </li>
                        ))}
                    </ul>
                </CustomModal>
            )}
            <CustomModal
                open={isFirstInningsOver}
                handleClose={() => setIsFirstInningsOver(false)}
                title="End of First Innings"
                footer={
                    <Button variant="contained" color="primary" onClick={() => setIsFirstInningsOver(false)}>
                        Close
                    </Button>
                }
            >
                <div>
                    <Typography variant="body1">The first innings is over.</Typography>
                    <Typography variant="body1">Target for the next team: {target} runs</Typography>
                </div>
            </CustomModal>
            {openWinnerModal && (
                <CustomModal
                    open={openWinnerModal}
                    handleClose={handleCloseWM}
                    title="Match Result"
                    footer={
                        <Button variant="contained" color="primary" onClick={handleCloseWM}>
                            Close
                        </Button>
                    }
                >
                    <div>
                        <Typography variant="body1">The winner of the match is {winner}.</Typography>
                    </div>
                </CustomModal>
            )}
        </div>
    );
};
export default MatchAdmin;