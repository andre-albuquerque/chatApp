'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, LogOutIcon, ShieldAlertIcon, UserCircle2Icon, Users2Icon} from 'lucide-react';
import Sidebar from '../../components/sidebar';

export default function Chat() {

    const router = useRouter()

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/');
    }

    return (
        <main className="h-screen flex flex-col justify-center bg-[#13678A]" >
            
            <div className="flex box-border self-center border rounded-lg bg-white divide-slate-900
                            flex-col h-full w-full divide-x-0 justify-center shadow-2xl                            
                            md:flex-col md:h-full md:w-5/6 md:divide-x-0 md:justify-center
                            lg:flex-col lg:h-5/6 lg:w-4/5 lg:divide-x-2 lg:divide-slate-300
                            ">
                
                <div className='flex flex-row h-full 
                                md:flex-row md:h-full
                                lg:flex-row lg:h-full'>
                        <div className='w-2/6 border-r-[2px] border-slate-300'>
                            <div className="flex flex-row h-[10%] rounded-tl-lg bg-[#f0f2f5] border-b-[0.5px] text-black">
                                <div className="flex flex-row w-full m-2 items-center self-center">
                                    <div className="items-center ml-2">
                                        <UserCircle2Icon />
                                    </div>
                                    <button className="items-center ml-4 cursor-pointer
                                                        hover:transform hover:scale-110 hover:text-stone-400"
                                            title='Administrador'> 
                                        <ShieldAlertIcon />
                                    </button>
                                    <div className='flex flex-row justify-end w-full'>
                                        <button className="items-center cursor-pointer
                                                            hover:transform hover:scale-110 hover:text-stone-400" 
                                                title='Sair'>
                                            <LogOutIcon onClick={()=>logout()}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[90%] w-full bg-[##fff] text-black">
                                <Sidebar />
                            </div>
                        </div>
                        <div className="h-full w-4/6 self-end rounded-r-lg bg-slate-300 text-black">
                            <div className="h-[10%] bg-[#f0f2f5] rounded-tr-lg  items-center self-center text-black">
                                <div className="flex flex-row  h-full ml-4 items-center self-center">
                                    <Users2Icon />
                                </div>
                            </div>
                            <div className="h-[78%] bg-[#efeae2] text-black">Content</div>
                            <div className="items-center self-center h-[12%] pt-2 rounded-br-lg 
                                            md:pt-3
                                            lg:pt-2 lg:pl-2 bg-[#f0f2f5] text-black">
                                <div className='flex flex-row '>
                                    <input type="text" placeholder="Digite sua mensagem" 
                                            className="w-11/12 h-14 ml-2 pl-2
                                                        md:h-12 md:pl-2 md:ml-2
                                                        lg:h-12 lg:pl-2 flex border rounded-lg border-slate-300"/>
                                    <button className="w-1/12 lg:h-12 flex justify-center items-center active:transform active:scale-90">
                                        <Send />
                                    </button>
                                </div>                                
                            </div>
                        </div>  
                </div>
            </div> 
        </main>
    );
}            