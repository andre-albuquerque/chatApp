import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import Validate from '../components/formValidation';

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
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) =>{
    try {
      e.preventDefault(); 
      setFormErrors(Validate(values))   

      await Axios.post('http://localhost:8081/register',{
        email: values.name,
        username: values.username,
        password: values.password
      })
      
    } catch (error) {
      setError(true)
    }     
  };

  return (
    <form>
        <h1>Crie uma conta</h1>
        <h3>Email</h3>
        <input type="email" name='email' value={values.email} onChange={handleChange} />
        <p>{ formErrors.email }</p>
        <h3>Username</h3>
        <input type="text" name='username' value={values.username} onChange={handleChange} />
        <p>{ formErrors.username }</p>
        <h3>Senha</h3>
        <input type="password" name='passwordCheck' value={values.passwordCheck} onChange={handleChange}/>
        <p>{ formErrors.password }</p>
        <h3>Digite a senha novamente</h3>
        <input type="password" name='password' value={values.password} onChange={handleChange} />
        <p>{ formErrors.password }</p>
        <p>
          <button type="submit" onClick={handleSubmit}>Registrar</button>
        </p>
        {hasError && <div>Ocorreu um erro ao salvar a conta. Tente novamente.</div>}<br/> 
        <Link to="/">Já possui uma conta?</Link>
    </form>
  );
}
