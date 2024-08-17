import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from "socket.io-client";

const Viewer = () => {
    const [name, setName] = useState('Ansh');
    const [socket, setSocket] = useState(null);

    const matches = useSelector((state) => state.matches.matches);
    console.log(matches)

    useEffect(() => {
        const newSocket = io("http://10.1.5.143:4000");
        newSocket.on("connect", () => {
            console.log("Viewer connected:", newSocket.id);
        });
        newSocket.on("matchData", (data) => {
            setName(data);
            console.log("Received message:", data);
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Viewer</h1>
            <h5 className="h">{name.team1Name} </h5>
            <h5 className="h">{name.team2Name} </h5>
        </div>
    );
};

export default Viewer;
