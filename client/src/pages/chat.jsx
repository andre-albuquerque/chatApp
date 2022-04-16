import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../providers/auth';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import Api from '../api/api';

import Moment from 'react-moment';
import 'moment-timezone';


export default function Chat(){

    const { handleLogout } = useContext(AuthContext);

    let name = localStorage.getItem("username")

    let room = localStorage.getItem("room")

    const socketRef = useRef();

    let navigate = useNavigate();

    const handleBack = () =>{
        localStorage.removeItem("room")
        navigate("/rooms")
    }

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
        
		return messages.map(({ message, name, time }, index) => (
			<div key={index}>
				<h4>
                    <span>{name}: {message} </span> <br/>
                    <span><Moment format="hh:mm">{(time).toLocaleString('pt-BR', { timeZone: 'America/Recife' })}</Moment></span>
				</h4>
			</div>                
		))
	}

    return(
        <div>
            <button onClick={handleLogout}>Logout</button>
            <br/>
            <br/>
            <button onClick={handleBack}>Lista de grupos</button>

            <h1>{room}</h1>
            <div>
				<h3>Chat:</h3>
				{renderChat()}
			</div>
            <form onSubmit={onMessageSubmit}>
                <div>
                    <textarea 
                        name='message'
                        onChange={(e)=>onTextChange(e)}
                        value={setState.message}
                    />
                </div>
                <br/>           
                <button>Enviar</button>
            </form>          
            <br/>        
            <br/>
            {error && <div>Erro ao salvar as mensagens.</div>}
        </div>
    )
}