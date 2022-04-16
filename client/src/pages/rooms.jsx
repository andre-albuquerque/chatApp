import React, {useEffect, useState, useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../providers/auth';

import Api from '../api/api'

export default function Rooms(){

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
        <div>
            {user.admin===true && <button onClick={handleAdmin}>Administrador</button>}
            <button onClick={handleLogout}>Logout</button>   
            <br/>  
            <div>{roomName.map(({ room }, index) => (
                <button key={index} value={room} onClick={()=>handleRoom(room)}>{room}</button>))}
            </div>
            {(hasError) && <div>Não foi possível carregar os grupos.</div>}
        </div>
    )
}
