import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../utils/userContext';

import Home from '../components/Home';
import {
    AiOutlineUserDelete, AiOutlineSearch
} from "react-icons/ai";


const Friends = ({ screenWidth }) => {

    const { user } = useContext(UserContext)
    const [friendSearch, setFriendSearch] = useState("")

    return (
        <div className='lg:w-[55vw] lg:max-w-[90vw]  lg:px-10 w-[100vw] max-w-[100vw] mt-[80px] text-current  bg-backgroundAlpha z-10'>
            <div className='flex flex-row mt-[20px] ml-4 items-center w-[calc(100%-10px)] justify-between  ml-[10px] items-center'>
                <h1 className='sm:text-[18px] text-[5vw] font-bold text-secondary'>Lista de Amigos</h1>

                <div className='flex rounded-[10px] mr-[8px] ml-auto border-[2px]  border-secondary  border-b-0  w-[40%] bg-background h-[50px]'>
                    <input className="p-[20px] rounded-[10px]  bg-background max-w-[85%] placeholder-secondary focus:outline-none"
                        type="text" value={friendSearch} placeholder="Buscar amigo" onChange={(e) => setFriendSearch(e.target.value)} />

                    <AiOutlineSearch className='ml-auto mr-[10px] min-w-[1rem] min-h-[1rem] w-[1rem] h-[1rem] my-auto ' />
                </div>

            </div>
            <div className='w-[100%] h-[4px] mt-[-4px] mb-[30px] bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent to-105%' />

            <div className={`flex justify-between w-full flex-wrap px-[10px] mt-[20px] mb-[20px] rounded-[10px] shadow-2xl`}>
                {(friendSearch == "" ? user.amigos : user.amigos.filter((friend) => friend.username.toLowerCase().includes(friendSearch.toLowerCase())
                    || (friend.nombre + " " + friend.apellido).toLowerCase().includes(friendSearch.toLowerCase()))).map((amigo) => (
                        <FriendDisplay key={amigo.id} amigo={amigo} screenWidth={screenWidth} />
                    ))}
            </div>
        </div>
    )
}

const FriendDisplay = ({ amigo, screenWidth }) => {
    return (
        <div className={`flex items-center w-[100%] ${screenWidth < 1540 && screenWidth > 1023 ? "md:w-[100%]" : "md:w-[48%]"} h-[100px] mb-[1rem] rounded-[10px] bg-foreground`}>
            <button className='flex items-center text-start h-[100%] grow hover:bg-primary hover:text-background rounded-l-[10px]'>
                <img src={amigo.foto_perfil} className='shadow-2xl w-[60px] h-[60px]  rounded-[10px] mx-[1rem]' alt={`${amigo.username}'s profile picture`} />
                <div className='max-w-[calc(80%-60px)]'>
                    <h1 className='text-[16px] font-bold text-secondary truncate'> {" @" + amigo.username.charAt(0).toUpperCase() + amigo.username.slice(1)} </h1>
                    <h2 className='text-[16px] mt-[-3px] truncate'> {amigo.nombre + " " + amigo.apellido} </h2>
                    <h2 className='text-[14px] font-thin mt-[-3px] truncate'> {amigo.carrera.nombre} </h2>
                </div>
            </button>

            <button className='ml-auto w-[20%] h-[99%] bg-background border-dashed border-l-[2px] border-accent rounded-r-[10px] hover:bg-accent hover:text-background text-accent font-bold md:text-[14px] text-[16px]'>
                <div className='w-[100%] h-[100%] items-center border-[1px] border-l-0 p-[5px] border-accent rounded-r-[10px]   opacity-50 hover:opacity-100'>
                    <AiOutlineUserDelete className='mx-auto mt-[14px] w-[2.5rem] h-[2.5rem] rounded-[50px]' />
                    Eliminar
                </div>
            </button>
        </div>
    )
}


Friends.getLayout = function getLayout(page, screenWidth) {
    return <Home screenWidth={screenWidth}>{page}</Home>;
};



export default Friends;