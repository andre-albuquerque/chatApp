import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './pages/home';
import Admin from './pages/admin';
import Signup from './pages/signup';
import Chat from './pages/chat';
import NotFoundPage from './pages/notFound';


export default function App(){
  return(
    <Router>
      <div>
        <Routes>
          <Route path='/' exact element={<Home/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path='/*' element={<NotFoundPage/>}/>
        </Routes>
      </div>
    </Router>
  )
}

