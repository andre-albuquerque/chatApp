import React, { useState, useEffect } from "react";
import "./Messages.css";
import GroupIcon from '@mui/icons-material/Group';
import SendIcon from '@mui/icons-material/Send';
import Api from '../../api/api';

import Moment from 'react-moment';
import 'moment-timezone';

export default function Messages() {

    const [messages, setMessages] = useState([])

    const [room, setRoomName] = useState([])

    let username = localStorage.getItem("username")

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


    return <div className="chat">
        <div className="chat_header">
            <GroupIcon className="group_item"/>
            <div>{room}</div>
        </div>

        <div className="chat_body">

            {messages.map(({ message, name, time }, index) => (
                <p className={`chat_message ${name == username && 'chat_reciever'}`}>
                    <span className="chat_name">Andre</span>
                    {message}
                    <span className="chat_timestamp">{<Moment format="DD/MM hh:mm">{(time).toLocaleString('pt-BR', { timeZone: 'America/Recife' })}</Moment>}</span>
                </p>
            ))}
        </div>

        <div className="chat_footer">
            <form >
                <input placeholder="Mensagem" />
                <SendIcon fontsize="large"/>
            </form>
        </div>
    </div>
}