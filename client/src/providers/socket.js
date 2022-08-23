import React, { createContext, useContext, useState, useEffect } from 'react';

import io from "socket.io-client";

export const SocketContext = createContext();

const backend = process.env.REACT_APP_SOCKET;

const socket = io(backend, {
    withCredentials: true
});

export const SocketProvider = ({children}) => {

    const [chat, setChat] = useState([]);

    const [newMessageReceived, setNewMessageReceived] = useState(false)

    const [userTyping, setUserTyping] = useState([])

    const [disconnect, setDisconnect] = useState(false)

    const joinRoom = (room) => {
        socket.emit('joinroom', room); 
    };

    useEffect(()=> {
        const newMessageRecived = () => {
            socket.on("message", ({ room, username, message, time }) => {
                setChat([...chat, { room, username, message, time } ])
                setNewMessageReceived(true);
            })
        };
        newMessageRecived();
    });

    useEffect(()=> {
        const typingRecived = () => {
            socket.on("typing", (roomUser, roomName) => {

                setUserTyping([{roomUser, roomName}]);            

                setTimeout(()=>{
                    setUserTyping("")
                }, 4000)
            })
        };

        typingRecived();

    },[]);

    const typingEmit = (username, room) => {
        socket.emit("typing", username, room)
    }

    const newMessageEmit = (room, username, message, time) => {
        socket.emit("message", { room, username, message, time })
    }

    useEffect(() => {
        if (disconnect === true){
            socket.disconnect();
        }
    },[disconnect])

    return (
        <SocketContext.Provider value={ { chat, setChat, userTyping, joinRoom, typingEmit, newMessageEmit, setDisconnect, newMessageReceived, setNewMessageReceived } }>
            {children}    
        </SocketContext.Provider>
    );
}