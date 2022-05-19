import React, {createContext, useEffect, useState} from "react";

import Api from '../../api/api'
import './Sidebar.css';
import Messages from '../message/Messages'

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import GroupIcon from '@mui/icons-material/Group';

const Sidebar = () => {

    const [roomName, setRoomName] = useState([]);
    const [hasError, setError] = useState(false);
    const [room, setRoom] = useState()

   
    useEffect(()=>{
        async function getRooms (){
            try {
                await Api.get('/rooms/rooms').then(
                    response=>{setRoomName(response.data.rooms)})
                    
            } catch (error) {
                setError(true)
            }
        }
        getRooms()
    }, []);


    const [key, setKey] = useState('')

    const HandleRoom = (e, i) =>{                     
        setRoom(e)
        setKey(i)

        document.getElementById(`${i}`).style.backgroundColor = "#ebebeb"

        if (i !== key ) {
            document.getElementById(`${key}`).style.backgroundColor = "white"
            document.getElementById(`${i}`).style.backgroundColor = "#ebebeb"
        }

    }


    return (   
        <>  
            <div className="sidebar">
                    {roomName.map(({ room }, key) => (
                        <ListItem id={key} className="sidebar_groupItem">
                            <ListItemAvatar>
                                <GroupIcon />
                            </ListItemAvatar>
                            <ListItemText className="listItemText" onClick={() => HandleRoom(room, key)}>
                                {room}
                                <Divider />
                            </ListItemText>
                        </ListItem>
                    ))}
            </div>

            <RoomProvider room={room} />
        </>
    )
};

export default Sidebar;

export const RoomContext = createContext({});

export const RoomProvider = (props) => {

    const room = props.room;

    return (
        <RoomContext.Provider value={ {room} }>  
            <Messages className="chat"/>          
            {props.children}
        </RoomContext.Provider>
    )
};

