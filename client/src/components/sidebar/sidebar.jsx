import React, {createContext, useEffect, useState, useRef, useCallback} from "react";

import Api from '../../api/api';
import io from 'socket.io-client';

import './Sidebar.css';

import Messages from "../message/Messages"
 
import GroupIcon from '@mui/icons-material/Group';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Moment from 'react-moment';
import 'moment-timezone';

const Sidebar = () => {
    
        
    const [roomName, setRoomName] = useState([]);
    
    const [room, setRoom] = useState()

    const [messages, setMessages] = useState([]);

    const [newMessage, setNewMessage] = useState(false);

    const [key, setKey] = useState('')

    const socketRef = useRef();


    useEffect(() => {
        const port = process.env.REACT_APP_PORT || 8081

        socketRef.current = io.connect(`http://localhost:${port}`)
        socketRef.current.on("NewMessage", () => {
            setNewMessage(true)  
        })        
    });

    
    useEffect(()=>{
        async function getRooms (){
            try {
                await Api.get('/rooms/rooms').then(
                    response=>{setRoomName(response.data.rooms)}
                )                    
            } catch (error) {
                console.log(error)
            }
        }
        getRooms()        

    }, [room]);

    

    const getChat = useCallback(async () =>{

        let messagesResponse=[]

        try {
            for (let i=0; i < roomName.length; i++){
                if(roomName[i].room !== undefined){
                    await Api.get(`chat/getRecentChat/?group=${roomName[i].room}`).then( response => { 
                        if (response) {
    
                            let messageChat = response.data.chatMessages
    
                            if (messageChat.length > 0) {
                                messagesResponse.push({messageChat})
                            }                                         
                        }
                    })
                }                
            }            
        } catch (error) {
            console.log(error)
        }  

        setMessages([messagesResponse])  
                     
    }, [roomName]);         
  
    
    useEffect(()=>{

        getChat();  
        
        setNewMessage(false);

    },[roomName, room, newMessage, getChat])    
    

    const HandleRoom = (e, i) =>{                     
        setRoom(e)
        setKey(i)

        document.addEventListener("DOMContentLoaded", function () {

            document.getElementById(`${i}`).style.backgroundColor = "#ebebeb"

            if (i !== key ) {
                document.getElementById(`${key}`).style.backgroundColor = "white"
                document.getElementById(`${i}`).style.backgroundColor = "#ebebeb"
            }
        })
    }
    
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <>       
            <div className="sidebar">
                {(roomName.length > 0 || roomName !== undefined) ? roomName.map(( { room }, key ) => (                    
                    <div key={room.toString()} id={key} className="sidebarChat"> 
                        <GroupIcon />  
                        
                        <div className="sidebarChat--info" onClick={() => HandleRoom(room, key)} >             
                        <div className="roomName">{ room }</div>

                            {messages && messages[0].map((msg, index) => (
                                <div key={index.toString()}>
                                <div className="room--time" >  
                                    {room === msg.messageChat[0].group && <div className="recentMessages">{msg.messageChat[0].name}: {msg.messageChat[0].message}</div>}
                                    <div id="time">                                    
                                        {room === msg.messageChat[0].group && <Moment format="DD/MM HH:mm">{(msg.messageChat[0].time).toLocaleString('pt-BR', { timeZone: {timezone} })}</Moment>}
                                    </div>
                                </div>  
                                </div>
                            ))} 

                        </div>  

                        <Divider />                                              
                    </div>                    
                                    
                )) : <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '200px' }}>  <CircularProgress />  </Box>}

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

