import React from 'react';
import { Link } from 'react-router-dom';

import "./styles/404.css"

export default function notFoundPage(){
    return(
        <div className="notfound">
            <div className='notfound--body'>
                <h1 id='title'>ERRO 404</h1>
                <h2 id='description'>Página não encontrada</h2>
                <div id='buttom'>
                    <Link to='/' id='link---home'>Ir para página inicial</Link>
                </div>
            </div>
        </div>

    )
};