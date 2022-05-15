import React, { useContext, useState, useEffect, useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AuthContext } from '../providers/auth';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import Api from '../api/api';
import Header from '../components/header/header'
import Sidebar from '../components/sidebar/sidebar'
import Paper from '@mui/material/Paper';
import { MessageLeft, MessageRight } from '../components/message/message';

import Messages from "../components/message/Messages"

import './chat/Chat.css'

import Moment from 'react-moment';
import 'moment-timezone';


export default function Chat(){

    let name = localStorage.getItem("username")

    let room = localStorage.getItem("room")

    const socketRef = useRef();

    let navigate = useNavigate();

    const [ state, setState ] = useState({ message: ""})
    const [ chat, setChat ] = useState([])

    const [error, setError] = useState(false);

    const [messages, setMessages] = useState([])


    useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:8081")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})

            socketRef.current.emit('joinroom', room);

            return () => socketRef.current.disconnect()
		},
		[ chat, room]
	)

    const onTextChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })    
	}

    const onMessageSubmit = async (e) => {
        e.preventDefault()
		const { message } = state
        if (message.length !== 0) {          
            socketRef.current.emit("message", { room, name, message })	
            
            try {
                await Api.post('chat/saveChat', {
                    message: message,
                    name: name,
                    group: room
                })

            } catch (error) {
                setError(true)
            }
            
        setState({message: ""})

        }
	}

    useEffect(()=>{
        const getChat = async () =>{
            try {
                await Api.post('chat/getChat', {
                    group: room
                }).then( response =>{
                    const messageChat = response.data.chatMessages 
                    setMessages(messageChat)
                })
            } catch (error) {
                console.log(error)
            }
        }
        getChat();
    },[room, messages])

    const renderChat = () => {
        
		return <div >
                    <Paper Depth={2}>
                        <Paper >
                            {messages.map(({ message, name, time }, index) => (
                            <MessageLeft
                            message = {message}
                            timestamp = {<Moment format="hh:mm">{(time).toLocaleString('pt-BR', { timeZone: 'America/Recife' })}</Moment>}
                            />
                            ))}
                        </Paper>
                    </Paper>
                </div>
    };

    return(
        <div className="app">    
            <div className="app_body">
                <Header className="header">Header</Header>
                <div className="container">
                    <Sidebar />
                    <Messages />
                    {error && <div>Erro ao salvar as mensagens.</div>}
                </div>
            </div>    
        </div>
    )
} 