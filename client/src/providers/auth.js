import React, { createContext, useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

import Api from '../api/api'

import loginValidate from '../components/loginValidation';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    let navigate = useNavigate();

    const [authenticated, setAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({})

    const [hasError, setError] = useState(false);
    const [loginErrors, setLoginErrors] = useState({});

    const [cookies, setCookie] = useCookies(['token']);
    
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

    useEffect(()=>{
        const token = cookies.token;

        if (token) {
            setAuthenticated(true)
            Api.defaults.headers.Authorization = `Bearer ${cookies}`;
            navigate("/rooms")
        }

        setLoading(false);            
        
    }, [cookies]);
   
    const handleLogin = async () => {        

        const isEmpty = Object.keys(loginValidate(values)).length === 0

        if (!isEmpty){
            setLoginErrors(loginValidate(values));     
            return;         
        }  

        try {               
            
            const login = await Api.post('/users/login',{
                email: values.email,
                password: values.password,               
            },{ withCredentials: true })
            
            if (login) {
                setUser(login.data)
                localStorage.setItem('username', `${login.data.username}`)
                setAuthenticated(true);            
                Api.defaults.headers.Authorization = `Bearer ${cookies}`;
                navigate("/rooms")           
            }

            setLoading(false);
                                            
        } catch (error) {
            setError(true)
        }
    };

    function handleLogout() {
        setAuthenticated(false)
        setCookie("token", "")
        localStorage.removeItem("username")
        localStorage.removeItem("room")
        Api.defaults.headers.Authorization = undefined;
        navigate("/")        
    }

    return (
        <AuthContext.Provider value={ { user, authenticated, handleLogin, handleLogout, loginErrors, hasError, values,handleChange }}>
            {children}    
        </AuthContext.Provider>
    );
};
