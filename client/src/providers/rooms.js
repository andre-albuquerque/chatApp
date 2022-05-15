import React, {useEffect, useState, useContext, createContext} from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from './auth';

import Api from '../api/api'

export const RoomsContext = createContext();

export const RoomsProvider = ({children}) => {

    const [hasError, setError] = useState(false);
    const [roomName, setRoomName] = useState([]);

    const [room, setRoom] = useState()

    const { user, handleLogout } = useContext(AuthContext);

    let navigate = useNavigate();

    const handleAdmin = () =>{
        navigate("/admin")
    }
    
    useEffect(()=>{
        async function getRooms (){
            try {
                await Api.get('/rooms/rooms').then(
                    response=>setRoomName(response.data.rooms))

            } catch (error) {
                setError(true)
            }
        }
        getRooms()
    }, []);

    
    const handleRoom = (e) =>{  
        setRoom(e)
        localStorage.setItem("room", room)        
    }

    
    useEffect(()=>{
        localStorage.setItem("room", room)
        if (room){ 
            navigate('/chat')
        }
    }) 

    return(
        <RoomsContext.Provider value={{ roomName }}>
            {children}    
        </RoomsContext.Provider>
    )
}
