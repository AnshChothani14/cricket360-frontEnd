import React, { useState, useEffect } from 'react';
import './MatchAdmin.css';
import Dropdown from '../../DesignComponent/Dropdown/DropDown'
import CustomTable from '../../DesignComponent/Table/Table';
import { io } from "socket.io-client";

const MatchAdmin = () => {
    const [message, setMessage] = useState('');
    const [socketId, setSocketId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://10.1.5.4:4000");
        newSocket.on("connect", () => {
            setSocketId(newSocket.id);
            setIsConnected(true);
            console.log('MatchAdmin connected:', newSocket.id);
            newSocket.on("matchData", (data) => {
                console.log("Received match data:", data);

            });
        });
        console.log(isConnected)
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (socket && socket.connected) {
            socket.emit("message", message);
            console.log('Message sent from ID:', socketId);
        } else {
            console.log('Socket is not connected yet.');
        }
    };
    const [onStrike, setOnStrike] = useState(1);
    const [resultButtonText, setResultButtonText] = useState('Result');
    const [addToButtonText, setAddToButtonText] = useState('Add Runs To');
    const [bat1Runs, setBat1Runs] = useState(0);
    const [bat1Name, setBat1Name] = useState('Ansh Chothani');
    const [bat2Name, setBat2Name] = useState('Virat Kohli');
    const [ballName, setBallName] = useState('Nasem Shah ');
    const [bat2Runs, setBat2Runs] = useState(0);
    const [bat1Balls, setBat1Balls] = useState(0);
    const [bat2Balls, setBat2Balls] = useState(0);
    const [totalRuns, setTotalRuns] = useState(0);
    const [wicketsFallen, setWicketsFallen] = useState(0);
    const [currentOver, setCurrentOver] = useState(0);
    const [subOvers, setSubOvers] = useState(0);

    const handleResultItemClick = (text) => {
        setResultButtonText(text);
    };

    const handleAddToItemClick = (text) => {
        setAddToButtonText(text);
    };

    const toggleOnStrike = (batNumber) => {
        setOnStrike(batNumber);
    }

    const handleFinalUpdateClick = () => {
        if (resultButtonText === 'Result') {
            alert('Please enter a valid number of runs');
            return;
        }

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
                break;

            case 'WD':
                newTotalRuns += 1;
                break;

            case 'NB':
                newTotalRuns += 1;
                runsToAdd = 1; 
                if (addToButtonText === 'player') {
                    if (onStrike === 1) {
                        newBat1Runs += runsToAdd;
                    } else {
                        newBat2Runs += runsToAdd;
                    }
                }
                break;

            case 'LB':
                runsToAdd = 0; 
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

        setBat1Balls(newBat1Balls);
        setBat2Balls(newBat2Balls);
        setBat1Runs(newBat1Runs);
        setBat2Runs(newBat2Runs);
        setTotalRuns(newTotalRuns);
        setWicketsFallen(newWicketsFallen);

        setResultButtonText('Result');
        setAddToButtonText('Add Runs To');

        const ballNumber = (currentOver * 6) + subOvers + 1;
        const ballResult = `${resultButtonText} `;
        const ballElement = document.querySelector(`.ball-${ballNumber}`);
        if (ballElement) {
            ballElement.innerHTML = `<h5>${ballResult}</h5>`;
        }


        if (subOvers < 5) {
            setSubOvers(subOvers + 1);
        } else {
            setCurrentOver(currentOver + 1);
            setSubOvers(0);
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

    const dataSourceForBalling = [
        {
            "name": "Jasprit Bumrah",
            "overs": 10,
            "runs": 45,
            "wickets": 3,
            "economy": 4.5
        },
        {
            "name": "Pat Cummins",
            "overs": 10,
            "runs": 50,
            "wickets": 2,
            "economy": 5.0
        },
        {
            "name": "Trent Boult",
            "overs": 10,
            "runs": 35,
            "wickets": 4,
            "economy": 3.5
        },
        {
            "name": "Kagiso Rabada",
            "overs": 10,
            "runs": 60,
            "wickets": 1,
            "economy": 6.0
        },
        {
            "name": "Mitchell Starc",
            "overs": 10,
            "runs": 55,
            "wickets": 2,
            "economy": 5.5
        },
        {
            "name": "Rashid Khan",
            "overs": 10,
            "runs": 40,
            "wickets": 3,
            "economy": 4.0
        },
        {
            "name": "Yuzvendra Chahal",
            "overs": 10,
            "runs": 48,
            "wickets": 2,
            "economy": 4.8
        },
        {
            "name": "Bhuvneshwar Kumar",
            "overs": 10,
            "runs": 38,
            "wickets": 3,
            "economy": 3.8
        },
        {
            "name": "Adil Rashid",
            "overs": 10,
            "runs": 53,
            "wickets": 1,
            "economy": 5.3
        },
        {
            "name": "Moeen Ali",
            "overs": 10,
            "runs": 46,
            "wickets": 2,
            "economy": 4.6
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
        {
            "name": "Rohit Sharma",
            "runs": 75,
            "ballsFaced": 54,
            "fours": 7,
            "sixes": 3,
            "strikeRate": 138.89
        },
        {
            "name": "Steve Smith",
            "runs": 65,
            "ballsFaced": 50,
            "fours": 6,
            "sixes": 1,
            "strikeRate": 130.00
        },
        {
            "name": "Kane Williamson",
            "runs": 55,
            "ballsFaced": 48,
            "fours": 4,
            "sixes": 2,
            "strikeRate": 114.58
        },
        {
            "name": "Joe Root",
            "runs": 70,
            "ballsFaced": 52,
            "fours": 5,
            "sixes": 2,
            "strikeRate": 134.62
        },
        {
            "name": "David Warner",
            "runs": 95,
            "balls        Faced": 62,
            "fours": 10,
            "sixes": 3,
            "strikeRate": 153.23
        },
        {
            "name": "Babar Azam",
            "runs": 60,
            "ballsFaced": 45,
            "fours": 6,
            "sixes": 1,
            "strikeRate": 133.33
        },
        {
            "name": "AB de Villiers",
            "runs": 80,
            "ballsFaced": 49,
            "fours": 9,
            "sixes": 2,
            "strikeRate": 163.27
        },
        {
            "name": "Glenn Maxwell",
            "runs": 45,
            "ballsFaced": 28,
            "fours": 5,
            "sixes": 1,
            "strikeRate": 160.71
        },
        {
            "name": "Ben Stokes",
            "runs": 50,
            "ballsFaced": 35,
            "fours": 3,
            "sixes": 2,
            "strikeRate": 142.86
        }
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

    return (
        <div>
            <div className="container score mt-5">
                <h1>Score Section :</h1>
                <div className="scoreCard">
                    <div className="btMan">
                        <div className="batsman-1">
                            <h5 className="batsman-1-name">{bat1Name} </h5>
                            <h5 className="batsman-1-runs">{bat1Runs}({bat1Balls}) </h5>
                        </div>
                        <div className="batsman-2">
                            <h5 className="batsman-1-name">{bat2Name}</h5>
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
                            <h5 className="baller-name">{ballName}</h5>
                        </div>
                        <div className="overScore">
                            <div className="ball-1"><h5>  </h5> </div>
                            <div className="ball-2"><h5>  </h5> </div>
                            <div className="ball-3"><h5>  </h5> </div>
                            <div className="ball-4"><h5>  </h5> </div>
                            <div className="ball-5"><h5>  </h5> </div>
                            <div className="ball-6"><h5>  </h5> </div>
                        </div>
                    </div>
                </div>
                <div className="updateScore mt-3 p-3">
                    <h3>Update Score :</h3>
                    <div className="updateOptions">
                        <Dropdown buttonText={resultButtonText} dropdownItems={resultDropdownItems} onItemClick={handleResultItemClick} />
                        <Dropdown buttonText={addToButtonText} dropdownItems={addToDropdownItems} onItemClick={handleAddToItemClick} />
                    </div>
                    <button className='btn FU' onClick={handleFinalUpdateClick}>Final Update</button>
                </div>
                <div className="updateBatsmanInfo mt-3 p-3">
                    <h3>Update Batsman Information :</h3>
                    <div className="updateBatInfo mt-5">
                        <div className={`sec-for-bat-1 ${onStrike === 1 ? 'active' : ''}`} onClick={() => toggleOnStrike(1)}>
                            <div className={`batsman-info `}>
                                <h5 >{bat1Name} </h5>
                                <h5 >{bat1Runs}({bat1Balls}) </h5>
                            </div>
                            <button className='btn btn-secondary out'> Out </button>
                        </div>
                        <div className={`sec-for-bat-2 ${onStrike === 2 ? 'active' : ''}`} onClick={() => toggleOnStrike(2)}>
                            <div className={`batsman-info `}>
                                <h5 >{bat2Name} </h5>
                                <h5 >{bat2Runs}({bat2Balls}) </h5>
                            </div>
                            <button className='btn btn-secondary out'> Out </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container over"></div>
            <div className="container balling mt-5  ">
                <h1>Bowling Summary :</h1>
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
                <h1>Batting Summary :</h1>
                <div className="tableBalling">
                    <CustomTable
                        columns={columnsForBatter}
                        data={dataSourceForBater}
                        size="large"
                        title="Batting Stats"
                    />
                </div>
            </div>
        </div>
    );
};

export default MatchAdmin;

