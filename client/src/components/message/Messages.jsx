import React, { useState, useEffect, useContext, createContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import Api from '../../api/api';

import "./Messages.css";

import {ReactComponent as ReactLogo} from  "../../components/logo/logo.svg";

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
import Typography from '@mui/material/Typography';


import { RoomContext } from "../sidebar/sidebar";
import { AuthContext } from "../../providers/auth";

import ScrollableFeed from 'react-scrollable-feed'

import Moment from 'react-moment';
import 'moment-timezone';


export default function Messages() {    

    const { room }  = useContext(RoomContext);

    const { user } = useContext(AuthContext)
 
    const [messages, setMessages] = useState([]);

    let username = user.username

    const [uniquesUsers, setUniquesUsers] = useState([])

    const [chat, setChat] = useState([]);

    const [state, setState] = useState({ message: "" });

    const [sended, setSended] = useState(false);

    const [open, setOpen] = useState(false);

    let navigate = useNavigate();

    const socketRef = useRef();    


    useEffect(()=>{
        if (room){ 
            navigate('/chat');
            setChat([]);
            setMessages([]);
        }
    }, [room, navigate]) 

    const [userTyping, setUserTyping] = useState("")


    useEffect(() => {

        const port = process.env.REACT_APP_PORT || 8081

        socketRef.current = io.connect(`http://localhost:${port}`)
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

    },[chat, room, username])

    useEffect(() => {
            if (state.message.length > 0) {
                socketRef.current.emit("typing", username, room)
            }
        },[state, username, room]
    );

    useEffect(()=>{

        let active = true;

        const getChat = async () =>{
            if (room !== undefined) {
                try {
                    await Api.get(`chat/getChat/?group=${room}`).then( response => { if (active) {
                        const messageChat = response.data.chatMessages 
                        setMessages(messageChat)
                        }
                    })
    
                } catch (error) {
                    console.log(error)
                }
            }

        }

        getChat();

        setSended(false);

        return () => {
            active = false;
        };

    },[room])


    useEffect(()=> {
        if (chat.length > 0) {
            setUniquesUsers(chat.map(({username}) => username).filter((value, index, self) => self.indexOf(value) === index))
        }
        if (messages.length > 0) {
            setUniquesUsers(messages.map(({name}) => name).filter((value, index, self) => self.indexOf(value) === index))
        }
        else {
            setUniquesUsers([])
        }

    }, [chat, messages])



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
                console.log(error)
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
                    {uniquesUsers.map((item)=>(
                        <div key={item.toString()}>
                        <ListItem > 
                            <Avatar src={`https://robohash.org/${Math.random()*1000}`} />                               
                            <ListItemText className="userParticipant" primary={item} />
                        </ListItem>
                        </div>
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
                                return <div className="username" key={item.toString()}>{item}</div>}                                
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
                        {messages !== undefined && messages.map(({ message, name, time }, index) => (
                            <div className="message-time" key={index.toString()}>
                                <p className={`chat_message ${name === user.username && 'chat_reciever'}`}>
                                    <span className="chat_name">{name}</span>
                                    <span className="message">{message}</span>                                
                                </p>
                                <span className={`chat_timestamp---reciever ${name === username && 'chat_timestamp'}`}>{<Moment format="DD/MM HH:mm">{(time)}</Moment>}</span>
                            </div>
                        )) }


                        {chat !== undefined && chat.map(({ message, username, time }, index) => (
                            <div className="message-time"  key={index.toString()}>
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
                            autoComplete="off"
                            value={state.message} 
                            onChange={({ target: { value } }) => setState({message: value})}
                            onKeyPress={event => event.key === 'Enter' ? onMessageSubmit(event) : null}
                        />
                        <SendIcon type="submit" form="chatForm" fontSize="large" onClick={(event)=>onMessageSubmit(event)}/>
                    </form>
                </div>

                <MessageProvider sended = {sended}/>
            </>  
        
        )
    }
    
    return <div className="chat--container">
            {room ? renderChat() : <div className='chatlogo'>
                                        <ReactLogo id="chatLogo--chat" width="200" height="300"/> 
                                        <div>
                                            <Typography variant="subtitle1" sx={{color: "rgb(142, 142, 142)"}}>Escolha um grupo para mandar mensagens</Typography>
                                        </div>
                                    </div>}                                 
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