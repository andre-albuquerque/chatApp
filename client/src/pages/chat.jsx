import React, { useState } from 'react';

import Header from '../components/header/header'
import Sidebar from '../components/sidebar/sidebar'
import Messages from '../components/message/Messages';

import './chat/Chat.css'

import 'moment-timezone';


export default function Chat(){
  
    const [error, setError] = useState(false);

    return (
        <div className="app">    
            <div className="app_body">
                <Header className="header">Header</Header>
                <div className="container--chat">
                    <Sidebar />
                    {error && <div>Erro ao salvar as mensagens.</div>}
                </div>
            </div>    
        </div>
    )
} 