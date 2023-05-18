'use client';

import { createContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import io from "socket.io-client";


const AuthContext = createContext({});

const RoomContext = createContext({});

const SocketContext = createContext({});

const AuthProvider = ({ children }) => {

    const [admin, setAdmin] = useState(false);

    const [username, setUsername] = useState('');

    const router = useRouter()

    const handleLogin = async (dataInputs) => {

        const response = await fetch('http://localhost:8000/users/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(dataInputs),
        });        
    
        const body = await response.json();
    
        if (body && body.token) {
            localStorage.setItem('auth', body.token);
        }
        
        body.admin === true  ? setAdmin(true) : setAdmin(false);  

        if (body.admin === true) {
            localStorage.setItem('admin', true);
        }
        
        body.username ? setUsername(body.username) : setUsername('');
    
        if (response.status === 201) {
            router.push('/chat');
        }else{
            alert('Usuário ou senha incorretos');
        }
        
    }

    return (
        <AuthContext.Provider value={{ handleLogin, admin, setAdmin, username }}>
            {children}
        </AuthContext.Provider>
    )
}

const RoomProvider = ({ children }) => {

    const [roomSelected, setRoomSelected] = useState('');

    return (
        <RoomContext.Provider value={{ setRoomSelected, roomSelected }}>
            {children}
        </RoomContext.Provider>
    )

}

const SocketProvider = ({ children }) => {

    const socket = io('http://localhost:8000', {
        withCredentials: true
    });


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

export { AuthContext, AuthProvider, RoomContext, RoomProvider, SocketContext, SocketProvider };