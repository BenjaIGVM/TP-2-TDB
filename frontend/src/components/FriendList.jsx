import { AiOutlineComment, AiOutlineSearch } from "react-icons/ai";
import React, { useState, useContext } from 'react';
import { UserContext } from '../utils/userContext';


export default function FriendsList({ friends, hide }) {

    const { changeFriendChatState } = useContext(UserContext);
    const [animationEnded, setAnimationEnded] = useState(false);
    const [chatSearch, setChatSearch] = useState("");

    const handleAnimationEnd = () => {
        setAnimationEnded(true);
    };

    const openChat = async (friendID) => {
        await changeFriendChatState(friendID, true)
    }

    return (
        <div className={`w-[100%] ${!hide ? 'grow-animation' : 'shrink-animation'} mb-10`} onAnimationEnd={handleAnimationEnd}>

            <h2 className="flex font-bold justify-self-center mr-auto ml-[10px] mb-[10px] text-secondary opacity-80 "> AMIGOS
                <div className="flex items-center self-center me-auto px-[10px] rounded-[10px] ml-[10px] bg-secondary text-background opacity-80">
                    {friends.filter(friend => friend.active).length + "/" + friends.length}
                </div>
            </h2>
            <div className="list-container bg-foreground shadow-md" style={{ height: '340px' }}>

                <div className=" my-[10px] mx-[5px] flex flex-row">

                    <input className="p-[10px] ml-[5px] pl-[20px] rounded-l-[10px] bg-background text-base w-[93%] h-[45px] placeholder-secondary outline-none focus:outline-none"

                        type="text"
                        placeholder="Buscar amigo"
                        value={chatSearch}
                        onChange={(e)=>{ setChatSearch(e.target.value) }}
                    />
                    <button className="bg-background flex items-center pr-[20px] rounded-r-[10px] hover:text-accent" type="submit">
                        <AiOutlineSearch />
                        </button>
                </div>

                {(chatSearch === "" ? friends : friends.filter(friend => friend.username.includes(chatSearch))).map((friend, index) => (
                    <button key={index} className="flex items-start border-b border-dotted border-background py-[20px] px-[10px]  hover:bg-primary hover:text-foreground" onClick={() => openChat(friend.id)}>

                        <img className="ml-[6px] mr-[20px] w-[50px] h-[50px] rounded-lg" src={friend.foto_perfil} alt={`${friend.username}'s profile`} />
                        <h2 className="mt-[13px] mr-[10px] font-bold truncate">{friend.username.charAt(0).toUpperCase() + friend.username.slice(1)}</h2>
                        <div className="flex items-center self-center ml-auto mr-[10px]"> <AiOutlineComment className={`w-[1.5rem] h-[1.5rem] ${!friend.active ? 'text-accent' : "inherit"} `} /></div>

                    </button>
                ))}
            </div>
        </div>
    );
};