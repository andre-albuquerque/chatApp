import React from 'react';

import Header from '../components/header/header'
import Sidebar from '../components/sidebar/sidebar'

import './styles/Chat.css'

import 'moment-timezone';


export default function Chat(){
  
    return (
        <div className="app">    
            <div className="app_body">
                <Header className="header">Header</Header>
                <div className="container--chat">
                    <Sidebar />
                </div>
            </div>    
        </div>
    )
} 