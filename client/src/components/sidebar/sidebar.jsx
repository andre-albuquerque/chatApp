import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Api from '../../api/api'
import './Sidebar.css';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import GroupIcon from '@mui/icons-material/Group';



const Sidebar = () => {

    const [roomName, setRoomName] = useState([]);
    const [hasError, setError] = useState(false);
    const [room, setRoom] = useState()

    let navigate = useNavigate();
    
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

    useEffect(()=>{
        localStorage.setItem("room", room)
        if (room){ 
            navigate('/chat')
        }
    }) 

    const handleRoom = (e) =>{  
        setRoom(e)
        localStorage.setItem("room", room)        
    }

    return (
        <div className="sidebar">
            {roomName.map(({ room }) => (       
            <ListItem className="sidebar_groupItem">
                <ListItemAvatar>
                    <GroupIcon />
                </ListItemAvatar>
                <ListItemText onClick={()=>handleRoom(room)}>
                    {room}                         
                    <Divider /> 
                </ListItemText> 
            </ListItem>
            ))}
        </div>
    )
}

export default Sidebar