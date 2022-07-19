import React, { createContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie'
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

import Api from '../api/api'

import loginValidate from '../components/loginValidation';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    let navigate = useNavigate();

    const [authenticated, setAuthenticated] = useState(false)

    const [user, setUser] = useState({})

    const [admin, setAdmin] = useState({})

    const [hasError, setError] = useState(false);

    const [loginErrors, setLoginErrors] = useState({});

    const [serverError, setServerError] = useState(false);

    const [cookies] = useCookies(['token']);

    const [userCookies] = useCookies(['user', 'admin']);
    
        
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

        const username = userCookies.user

        const admin = userCookies.admin

        if (token) { 
            setAuthenticated(true)
            Api.defaults.headers.Authorization = `Bearer ${token}`;

            if (username) {
                setUser({"username": username})        
            }
    
            if (admin) {
                if (admin === 'true') {
                    setAdmin(true)
                }
            }   

            navigate('/chat')
        }
 
        
    }, [cookies, userCookies]);

  
    const handleLogin = async (e) => {    

        e.preventDefault();     

        const isEmpty = Object.keys(loginValidate(values)).length === 0

        if (!isEmpty){
            setLoginErrors(loginValidate(values)); 
            setError(true) 
            setTimeout(()=>{
                setLoginErrors({})
            }, 5000)   
            return;         
        }  

        try {               
            
            const login = await Api.post('/users/login', {
                email: values.email,
                password: values.password,               
            },{ withCredentials: true })

            
            if (login) {
                setUser(login.data)
                setAuthenticated(true);            
                Api.defaults.headers.Authorization = `Bearer ${login.data.token}`;
                navigate("/chat")  
            }
       
                                                        
        } catch (error) {            
            console.log(error)
            if (!error.response) {
                setServerError(true)
            }else{
                setError(true)
            }

            setTimeout(()=>{
                setServerError(false)
            }, 8000)

            setTimeout(()=>{
                setError(false)
            }, 8000)

        }
    };

    function handleLogout() {
        setAuthenticated(false)
        Cookies.remove("token")
        Cookies.remove("user")
        Cookies.remove("admin")
        Api.defaults.headers.Authorization = undefined;
        setValues({
            email: '',
            password: ''
        })

        setError(false)

        window.location.reload(false)
        navigate("/")        
    }

    return (
        <AuthContext.Provider value={ { user, admin, authenticated, handleLogin, handleLogout, loginErrors, hasError, serverError, values, handleChange }}>
            {children}    
        </AuthContext.Provider>
    );
};
