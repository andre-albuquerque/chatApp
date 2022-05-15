import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import Validate from '../components/formValidation';
import { Box, Container, Typography, TextField, Button, Alert  } from '@mui/material'

export default function SignUp() {

  const [values, setValues] = useState({
    email: '',
    username: '',
    password: '',
    passwordCheck: ''
  })  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    })
  };

  const [hasError, setError] = useState(false);

  const [submitError, setSubmitError] = useState(false);

  const [formErrors, setFormErrors] = useState('');

  const [items, setItems] = useState('');

  const [success, setSuccess] = useState(false);
  const [sucessMsg, handleSuccess] = useState('')

  const handleSubmit = async (e) =>{     
    e.preventDefault(); 
 
    const isEmpty = Object.keys(Validate(values)).length === 0

    if (!isEmpty){
      setFormErrors(Validate(values)); 
      setError(true)    
      return;         
    }    

    try {              
      await Axios.post('http://localhost:8081/users/signup', {
          email: values.email,
          username: values.username,
          password: values.password,
          passwordCheck: values.passwordCheck
        }
      ).then(response => {
        handleSuccess(response.data.message);
        setSuccess(true);
      })        
    }
    catch (error) {       
        if (error.response) {
          let errorMsg = error.response.data;
          setSubmitError(true)
          setItems(errorMsg.message)
          setFormErrors(errorMsg)          
        }
      };
  };

  return (
  
    <Container component="main" maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} noValidate
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
        <Typography component="h1" variant="h5">
          Crie uma conta
        </Typography>
          
        <form>
          <TextField label="Email" fullWidth  margin="normal" type="email" name='email' value={values.email} onChange={handleChange}/>
          {(hasError && formErrors.email) && <div><Alert severity="warning">{ formErrors.email }</Alert></div>}

          <TextField  label="Nome de usuário" fullWidth margin="normal" type="text" name='username' value={values.username} onChange={handleChange} />
          {(hasError && formErrors.username) && <div><Alert fullWidth severity="warning">{ formErrors.username}</Alert></div>}

          <TextField label="Senha" fullWidth margin="normal" type="password" name='password' value={values.password} onChange={handleChange}/>
          {(hasError && formErrors.password) && <div><Alert fullWidth severity="warning">{ formErrors.password }</Alert></div>}

          <TextField label="Digite a senha novamente" fullWidth margin="normal" type="password" name='passwordCheck' value={values.passwordCheck} onChange={handleChange} />
          {(hasError && formErrors.password) && <div><Alert fullWidth severity="warning">{ formErrors.password }</Alert></div>}
        </form>

        <Button fullWidth sx={{ mt: 3, mb: 2 }} variant="contained" type="submit" onClick={handleSubmit}>Registrar</Button>
        
        {(submitError) && <div><Alert severity="error">{items}</Alert></div>}
        {(success) && <div><Alert severity="success">{sucessMsg}</Alert></div>} 

        <Link to="/">Já possui uma conta?</Link>
      </Box>
    </Container>
  );
}
