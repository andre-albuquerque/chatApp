import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Alert  } from '@mui/material';
import {ReactComponent as ReactLogo} from '../components/logo/logo.svg';

import "./styles/Home.css"

import { Offline } from "react-detect-offline";

import { AuthContext } from '../providers/auth';

export default function Home(){

    const { handleLogin, loginErrors, hasError, serverError, values, handleChange } = useContext(AuthContext)

    return(    
        <div className="app--admin">
            <div className="body--home">
                <Container component="main" maxWidth="xs" 
                    sx={{
                    position: 'center',
                    width: {
                        xs: '340px',
                        sm: '500px',
                        md: '450px',
                        lg: '445px',
                    },
                    }}>
                    <Box         
                        xs={1}                
                        component="form" 
                        onSubmit={handleLogin} 
                        className="MuiBox-root--home"
                        noValidate  
                        sx={{
                            mt: 1,
                            mb: 3,
                            mr: 9,
                            height: 'auto',
                            width: {
                                xs: '272px',
                                sm: '395px',
                                md: '398px',
                                lg: '440px'
                            },  
                            position: 'center',
                            display: 'block',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            zIndex: 'modal'
                        }}
                    >
                        <ReactLogo className="logo" width="100" height="200"/>
                        <Typography component="h1" variant="h3" sx={{marginBottom: "33px"}}>
                            ChatApp
                        </Typography>

                        <Typography component="h2" variant="h5">
                            Sign in
                        </Typography>

                        <TextField label="Email" fullWidth  margin="normal" type="email" name='email' value={values.email} onChange={handleChange}/>
                        {(hasError && loginErrors.email && values.email.length === 0) && <div><Alert severity="warning">{ loginErrors.email }</Alert></div>}

                        <TextField label="Senha" fullWidth margin="normal" type="password" name='password' value={values.password} onChange={handleChange}/>
                        {(hasError && loginErrors.password && values.password.length === 0) && <div><Alert severity="warning">{ loginErrors.password }</Alert></div>}

                        <Button fullWidth sx={{ mt: 3, mb: 2 }} variant="contained" type="submit" onClick={handleLogin}>Entrar</Button>

                        {(hasError) && <div><Alert severity="error">Email ou senha inválidos!</Alert></div>}
                        {(serverError) && <div><Alert severity="error">Erro de conexão com o servidor. Tente novamente mais tarde.</Alert></div>}
                        <Offline><div><Alert severity="error">Parece que você está desconectado da internet. Verique e tente novamente..</Alert></div></Offline>

                        <Link to='/signup'>Crie uma conta</Link>
                    </Box>
                </Container>       
            </div> 
        </div>
    )
}