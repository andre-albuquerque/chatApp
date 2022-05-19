import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../providers/auth';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import Api from '../api/api';
import Header from '../components/header/header'
import Sidebar from '../components/sidebar/sidebar'

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

    return (
        <div className="app">    
            <div className="app_body">
                <Header className="header">Header</Header>
                <div className="container">
                    <Sidebar />
                    {error && <div>Erro ao salvar as mensagens.</div>}
                </div>
            </div>    
        </div>
    )
} 