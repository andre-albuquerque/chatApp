import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router';

import './App.css';

import Home from './pages/home';
import Admin from './pages/admin';
import Signup from './pages/signup';
import Chat from './pages/chat';
import NotFoundPage from './pages/notFound';


import { AuthContext, AuthProvider } from './providers/auth';

function PrivateRoute({ children }) {

  const { authenticated } = useContext(AuthContext);

  return authenticated ? children : <Navigate to="/" />  
  
}

export default function App(){  

  return (
    <Router>
      <AuthProvider>
        <div>
          <Routes>
            <Route path='/' exact element={<Home/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path="/admin"
             element={
              <PrivateRoute>
                <Admin/>
              </PrivateRoute>
             }
            />         
            <Route path="/chat"
             element={
              <PrivateRoute>
                <Chat/>
              </PrivateRoute>
             }
            />
            <Route path='/*' element={<NotFoundPage/>}/>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

