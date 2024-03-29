'use client';

import React, { useState, useContext, useEffect } from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { AuthContext } from './context/page';

export default function Login() {

  const { handleLogin } = useContext(AuthContext);

  const [dataInputs, setDataInputs] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
      const { name, value } = event.target;
      setDataInputs({ ...dataInputs, [name]: value });
  }
  
  const router = useRouter();

  const token = localStorage.getItem('auth');

  useEffect(() => {
    
    token && token.length > 0 ? router.push('/chat') : null;
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.values(dataInputs).some((value) => value === '')) {
      alert('Preencha todos os campos');
      return;
    }

    handleLogin(dataInputs);

  }

  return <main className="h-screen flex flex-col justify-center bg-[#13678A]">
    <div className="flex box-border self-center border rounded-lg bg-white divide-slate-900 
                    flex-col h-full w-full divide-x-0 justify-center shadow-2xl
                    lg:flex-row lg:h-4/5 lg:w-2/3 lg:divide-x-2 lg:divide-slate-300
                    md:flex-col md:h-full md:w-5/6 md:divide-x-0 md:justify-center
                     ">
      <div className="self-center mb-8
                      lg:w-1/2
                      md:pb-8 md:mt-8                        
                      ">
        <h1 className="text-5xl font-bold text-center m-4 text-blue-500
                      md:text-7xl md:m-2 md:mt-8 md:mb-4"
                      >Chat App</h1>
      </div>
      <div className="self-center w-full
                      lg:w-1/2
                      md:w-full
                    ">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <span className="w-11/12 self-center text-center text-3xl mb-8 text-slate-950">Login</span>
          <span className="w-11/12 self-center text-slate-950
                          md:w-9/12">E-mail</span>
          <input type= "email" name="email" value={dataInputs.email} onChange={handleChange}
                className="border-2 w-11/12 h-9 p-2 self-center rounded-lg focus:ring text-black
                          md:w-9/12"/>
          <span className="w-11/12 self-center mt-6 text-slate-950
                          md:w-9/12">Senha</span>
          <input type= "password" name="password" value={dataInputs.password} onChange={handleChange}
                 className="border-2 w-11/12 h-9 p-2 self-center rounded-lg focus:ring text-black
                        md:w-9/12"/>
          <button className="w-11/12 self-center border-2 mt-5 h-9 rounded-lg bg-[#13678A] hover:bg-[#0F4C75] text-white
                            active:transform active:scale-95
                            md:w-9/12"
                  type="submit"
                >Entrar</button>
          
          <span className="w-11/12 self-center text-center mt-5 text-slate-950">Não tem uma conta? 
           <Link href="/signup" className="text-blue-500 hover:text-[#0F4C75]"> Cadastre-se</Link>
          </span>
        </form>
      </div>
    </div>
    <footer className="self-center text-center text-white text-sm mt-4">© 2023 Chat App. Desenvolvido por <a href="https://github.com/andre-albuquerque" className="text-blue-500 hover:text-[#0F4C75]">Andre Albuquerque</a></footer>
  </main>
}