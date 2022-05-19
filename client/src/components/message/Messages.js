import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import Api from '../../api/api';

import "./Messages.css";
import GroupIcon from '@mui/icons-material/Group';
import SendIcon from '@mui/icons-material/Send';
import { RoomContext } from "../sidebar/sidebar";
import { AuthContext } from "../../providers/auth";

import ScrollableFeed from 'react-scrollable-feed'

import Moment from 'react-moment';
import 'moment-timezone';

export default function Messages() {

    const { room }  = useContext(RoomContext);

    const { user } = useContext(AuthContext);

    const username = user.username;

    const [messages, setMessages] = useState([]);

    const [chat, setChat] = useState([]);

    const [state, setState] = useState({ message: "" });

    const [error, setError] = useState(false);

    let navigate = useNavigate();

    const socketRef = useRef();

    let active = true;

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

        console.log(messages)

        return () => {
            active = false;
        };

    },[room, chat])


    useEffect(()=>{
        if (room){ 
            navigate('/chat')
        }
    }, [room]) 

    const [userTyping, setUserTyping] = useState("")

    useEffect(() => {
			socketRef.current = io.connect("http://localhost:8081")
			socketRef.current.on("message", ({ username, message }) => {
				setChat([ ...chat, { username, message } ])
			})

            socketRef.current.emit('joinroom', room);      
            
            socketRef.current.on("typing", (username)=>{
                setUserTyping(username);
                setTimeout(()=>{
                    setUserTyping("")
                }, 4000)
            })
                               
            return () => socketRef.current.disconnect()

		},[chat, room, username]
    )

    useEffect(() => {
            if (state.message.length > 0) {
                socketRef.current.emit("typing", username)
            }
        },[state]
    )

    const onMessageSubmit = async (e) => {

        e.preventDefault();

		const { message } = state

        console.log(message)
  
        if (message.length !== 0) {          
            socketRef.current.emit("message", { room, username, message })
                        
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

    const uniques = messages.map(({name}) => name).filter((value, index, self) => self.indexOf(value) === index)

    const renderChat = () => {
        return (
            <>
                <div className="chat_header">
                    <GroupIcon className="group_item"/>
                    <div>{room}</div>
                    {uniques.map((item)=>{
                        return <div className="usersGroup">{item}</div>
                    })}
                </div>

                <div className="chat_body">
                    <ScrollableFeed>
                        {messages.map(({ message, name, time }, index) => (
                            <p className={`chat_message ${name === user.username && 'chat_reciever'}`}>
                                <span className="chat_name">{name}</span>
                                {message}
                                <span className="chat_timestamp">{<Moment format="DD/MM HH:mm">{(time).toLocaleString('pt-BR', { timeZone: 'America/Recife' })}</Moment>}</span>
                            </p>
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
                            value={state.message} 
                            onChange={({ target: { value } }) => setState({message: value})}
                            onKeyPress={event => event.key === 'Enter' ? onMessageSubmit(event) : null}
                        />
                        <SendIcon type="submit" form="chatForm" fontsize="large" onClick={(event)=>onMessageSubmit(event)}/>
                    </form>
                </div>
            </>            
        )
    }
    
    return <div className="chat">
            {room ? renderChat() : ""}
        </div>            
}