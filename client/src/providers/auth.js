import React, { createContext, useEffect, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = (props) => {

    const [email, setEmail] = useState({
        email: ''
    });

    const [password, setPassword] = useState({
        password: ''
    });

    useEffect(()=>{
        const emailStorage = localStorage.getItem('email');
        if (emailStorage){
            setEmail(JSON.parse(emailStorage));
        }else{
            setEmail({
                email: ''
            })
        }

        const passwordStorage = localStorage.getItem('password');
        if (passwordStorage){
            setPassword(JSON.parse(passwordStorage))
        }else{
            setPassword({
                password: ''
            })
        }
    }, [setEmail, setPassword]);

    return (
        <AuthContext.Provider value={{email, setEmail, password, setPassword}}>
            {props.children}    
        </AuthContext.Provider>
    );
};

export const useAuth  = () => React.useContext(AuthContext);