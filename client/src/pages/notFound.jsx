import React from 'react';
import { Link } from 'react-router-dom';

export default function notFoundPage(){
    return(
        <div>
            <h1>ERRO 404</h1>
            <h2>Página não encontrada</h2>
            <Link to='/'>Ir para página inicial</Link>
        </div>
    )
};