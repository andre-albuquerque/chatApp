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
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({})

    const [admin, setAdmin] = useState({})

    const [hasError, setError] = useState(false);
    const [loginErrors, setLoginErrors] = useState({});

    const [cookies, setCookie] = useCookies(['token']);

    const [userCookies, setUserCookie] = useCookies(['user', 'admin']);
    
    
    
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

        console.log(username, admin)

        if (token) { 
            setAuthenticated(true)
            Api.defaults.headers.Authorization = `Bearer ${token}`;
            navigate("/chat")
        }

        if (username && admin) {
            setUser({"username": username})

            if (admin === 'true') {
                setAdmin(true)
            }
            
        }

        setLoading(false);            
        
    }, [cookies]);

   
    const handleLogin = async (e) => {    

        e.preventDefault();     

        const isEmpty = Object.keys(loginValidate(values)).length === 0

        if (!isEmpty){
            setLoginErrors(loginValidate(values)); 
            setError(true)    
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

            setLoading(false);            
                                                        
        } catch (error) {
            setError(true)
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

        navigate("/")        
    }

    return (
        <AuthContext.Provider value={ { user, admin, authenticated, handleLogin, handleLogout, loginErrors, hasError, values, handleChange }}>
            {children}    
        </AuthContext.Provider>
    );
};
