import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/auth';
import Axios from 'axios';
import loginValidate from '../components/loginValidation';

export default function Home(){

    const { setEmail, setPassword } = useAuth;

    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        passwordCheck: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value
        })
    };

    const [hasError, setError] = useState(false);
    const [loginErrors, setLoginErrors] = useState({});

    const handleLogin = async () => {

        //setEmail(values.email)
        //setPassword(values.password)

        const isEmpty = Object.keys(loginValidate(values)).length === 0

        if (!isEmpty){
            setLoginErrors(loginValidate(values));     
            return;         
        }  

        try {
                        
            await Axios.get('http://localhost:8081/login',{
                email: values.email,
                password: values.password
            }).then(response => console.log(response))
            
        } catch (error) {
            setError(true)
            console.log(error)
        }
    };

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
            {hasError &&  <div>Ocorreu um erro interno. Tente novamente.</div>}<br/>      
            <Link to='/signup'>Registre-se</Link>            
        </div>
    )
}