import React, { useState, useEffect, useContext, createContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import Api from '../../api/api';


import "./Messages.css";

import GroupIcon from '@mui/icons-material/Group';
import SendIcon from '@mui/icons-material/Send';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';

import { RoomContext } from "../sidebar/sidebar";
import { AuthContext } from "../../providers/auth";

import ScrollableFeed from 'react-scrollable-feed'

import Moment from 'react-moment';
import 'moment-timezone';


export default function Messages() {    

    const { room }  = useContext(RoomContext);

    const { user } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);

    const username = user.username;

    const [chat, setChat] = useState([]);

    const [state, setState] = useState({ message: "" });

    const [sended, setSended] = useState(false);

    const [error, setError] = useState(false);

    const [open, setOpen] = useState(false);

    let navigate = useNavigate();

    const socketRef = useRef();

    let active = true;


    useEffect(()=>{
        if (room){ 
            navigate('/chat');
            setChat([]);
        }
    }, [room]) 

    const [userTyping, setUserTyping] = useState("")

    useEffect(() => {
			socketRef.current = io.connect("http://localhost:8081")
			socketRef.current.on("message", ({ username, message, time }) => {
				setChat([...chat, { username, message, time } ])
			})

            socketRef.current.emit('joinroom', room);      
            
            socketRef.current.on("typing", (username, roomUser)=>{
                
                if (roomUser === room){
                    setUserTyping(username);
                }
                setTimeout(()=>{
                    setUserTyping("")
                }, 4000)
            })
                               
            return () => socketRef.current.disconnect()

		},[chat, room, username]
    )

    useEffect(() => {
            if (state.message.length > 0) {
                socketRef.current.emit("typing", username, room)
            }
        },[state]
    );

    useEffect(()=>{
        const getChat = async () =>{
            try {
                await Api.post('chat/getChat', {
                    group: room
                }).then( response => { if (active) {
                    const messageChat = response.data.chatMessages 
                    setMessages(messageChat)
                }
                })

            } catch (error) {
                console.log(error)
            }
        }

        getChat();

        setSended(false);

        return () => {
            active = false;
        };

    },[room])

    let uniquesUsers = ''

    if (messages !== undefined){
        uniquesUsers = messages.map(({name}) => name).filter((value, index, self) => self.indexOf(value) === index)
    }

    const onMessageSubmit = async (e) => {

        e.preventDefault();

		const { message } = state

        let time = new Date();

        setSended(true);
 
        if (message.length !== 0) {          
            socketRef.current.emit("message", { room, username, message, time })
                        
            try {
                await Api.post('chat/saveChat', {
                    message: message,
                    name: username,
                    group: room
                })

            } catch (error) {
                setError(true)
            }
            
        setState({message: ""})
        }
	}

    const handleClickOpen = () => {
        setOpen(true);
      };

    const handleClose = () => {
        setOpen(false);
    };


    const SimpleDialog = () => {            
    
        return (
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>{room}</DialogTitle>
                {uniquesUsers !== '' && <DialogContentText >{uniquesUsers.length} participantes</DialogContentText>}
                <Divider variant="middle"/>         
                <List sx={{ pt: 0 }}>
                    {uniquesUsers.map((item, key)=>(
                        <>
                        <ListItem key={item}> 
                            <Avatar src={`https://robohash.org/${Math.random()*1000}`} />                               
                            <ListItemText className="userParticipant" primary={item} />
                        </ListItem>
                        </>
                    ))}
                </List>
            </Dialog>
        )
    }

    
    const renderChat = () => {
        return (
            <>
                <div className="chat_header">
                <GroupIcon className="group_icon"/>
                    <div className="room_users">                                            
                        <div className="roomName">{room}</div>
                        
                        {userTyping ? <div className="userTyping">{userTyping} está digitando...</div> : <div className="usersGroup" onClick={handleClickOpen}>
                            {uniquesUsers.map((item)=>{
                                return <div className="username">{item}</div>}                                
                            )}
                            </div>
                        }
                        <SimpleDialog
                            open={open}
                            onClose={handleClose}
                        />
                    </div>
                </div>

                <div className="chat_body">
                    <ScrollableFeed>  
                        {messages !== undefined && messages.map(({ message, name, time }) => (
                            <div className="message-time">
                                <p className={`chat_message ${name === user.username && 'chat_reciever'}`}>
                                    <span className="chat_name">{name}</span>
                                    <span className="message">{message}</span>                                
                                </p>
                                <span className={`chat_timestamp---reciever ${name === username && 'chat_timestamp'}`}>{<Moment format="DD/MM HH:mm">{(time)}</Moment>}</span>
                            </div>
                        ))}



                        {chat !== undefined && chat.map(({ message, username, time }) => (
                            <div className="message-time">
                                <p className={`chat_message ${username === user.username && 'chat_reciever'}`}>
                                    <span className="chat_name">{username}</span>
                                    <span className="message">{message}</span>                                
                                </p>
                                <span className={`chat_timestamp---reciever ${username === user.username && 'chat_timestamp'}`}>{<Moment format="DD/MM HH:mm">{(time)}</Moment>}</span>
                            </div>
                        ))}
                    </ScrollableFeed>
                </div>

                <div className="chat_footer">
                    <form id="chatForm" onSubmit={(event)=>onMessageSubmit(event)}>
                        <input 
                            id="input"
                            placeholder="Mensagem" 
                            name='message' 
                            type="text" 
                            autocomplete="off"
                            value={state.message} 
                            onChange={({ target: { value } }) => setState({message: value})}
                            onKeyPress={event => event.key === 'Enter' ? onMessageSubmit(event) : null}
                        />
                        <SendIcon type="submit" form="chatForm" fontsize="large" onClick={(event)=>onMessageSubmit(event)}/>
                    </form>
                </div>

                <MessageProvider sended = {sended}/>
            </>  
        
        )
    }
    
    return <div className="chat--container">
            {room ? renderChat() : ""}                                 
        </div>
}

export const MessageContext = createContext();

export const MessageProvider = (props) => {

    const sended = props.sended;

    return (
        <MessageContext.Provider value={ {sended} }>      
            {props.children}
        </MessageContext.Provider>
    )
};