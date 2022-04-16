import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../providers/auth';

export default function Home(){

    const { handleLogin, loginErrors, hasError, values, handleChange } = useContext(AuthContext)

    return(
        <div>
            <h1>Chat App</h1>
            <h2>Login</h2>
            <h3>Email</h3>
            <input type="email" name='email' value={values.email} onChange={handleChange}/>
            <p>{ loginErrors.email }</p>
            <h3>Senha</h3>
            <input type="password" name='password' value={values.password} onChange={handleChange} />
            <p>{ loginErrors.password }</p>
            <p><button type="submit" onClick={handleLogin}>Entrar</button> </p>  
            {hasError &&  <div>Email ou senha inválidos!</div>}<br/>
            <Link to='/signup'>Crie uma conta</Link>         
        </div>
    )
}