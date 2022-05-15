import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Alert  } from '@mui/material';

import { AuthContext } from '../providers/auth';

export default function Home(){

    const { handleLogin, loginErrors, hasError, values, handleChange } = useContext(AuthContext)

    return(        
        <Container component="main" maxWidth="xs">
            <Box 
                component="form" 
                onSubmit={handleLogin} 
                noValidate  
                sx={{
                    mt: 8,
                    mb: 3,
                    position: 'relative',
                    marging: '10px auto',
                    display: 'block',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <Typography component="h2" variant="h5">
                    Sign in
                </Typography>

                <TextField label="Email" fullWidth  margin="normal" type="email" name='email' value={values.email} onChange={handleChange}/>
                {(hasError && loginErrors.email && values.email.length === 0) && <div><Alert severity="warning">{ loginErrors.email }</Alert></div>}

                <TextField label="Senha" fullWidth margin="normal" type="password" name='password' value={values.password} onChange={handleChange}/>
                {(hasError && loginErrors.password && values.password.length === 0) && <div><Alert severity="warning">{ loginErrors.password }</Alert></div>}

                <Button fullWidth sx={{ mt: 3, mb: 2 }} variant="contained" type="submit" onClick={handleLogin}>Entrar</Button>

                {(hasError) && <div><Alert severity="error">Email ou senha inválidos!</Alert></div>}

                <Link to='/signup'>Crie uma conta</Link>
            </Box>
        </Container>        
    )
}