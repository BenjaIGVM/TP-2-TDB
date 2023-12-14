import {
    AiOutlineClose,
    AiOutlineSend, AiOutlineMenu, AiOutlinePicture
} from "react-icons/ai";

import React, { useState, useRef, useEffect } from 'react';
import { UserContext } from '../utils/userContext';
import { useContext } from 'react';


export default function Chat({ chatInfo, user }) {
    const chatRef = useRef(null);

    /* console.log("rendering ", chatInfo); */
    const [minimized, setMinimized] = useState(false);
    const [toUsers, setToUsers] = useState(chatInfo.usuarios.filter((cUser) => cUser.id != user.id).map((us) => { return us.id }))
    const { sendMessage, changeChatState, changeFriendChatState } = useContext(UserContext);

    const [newMsg, setNewMsg] = useState({ msg: { fecha: new Date(), usuario: user.id, texto: '', imagenes: [] }, chatID: chatInfo.id, toUsers: toUsers })

    useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [chatInfo])

    const processMessage = (event) => {
        console.log(newMsg);
        event.preventDefault();
        if (newMsg.msg.texto.trim() !== '') {
            sendMessage({ ...newMsg, msg: { ...newMsg.msg, fecha: new Date() } })
            setNewMsg({ msg: { usuario: user.id, texto: '', imagenes: [] }, chatID: chatInfo.id, toUsers: toUsers })
        }

    }
    const changeMessage = (event) => {
        setNewMsg({ ...newMsg, msg: { ...newMsg.msg, texto: event.target.value } });
    }

    const toggleMinimized = () => {
        setMinimized(!minimized);
    };

    const handleCloseChat = () => {
        if (!chatInfo.id) {
            changeFriendChatState(toUsers[0], false);
        } else {
            changeChatState(chatInfo.id, false);
        }
        setMinimized(true)
    };

    const handleOptions = () => {

    }

    const displayMsgs = () => {

        if (!chatInfo.mensajes || chatInfo.mensajes.length === 0) { return <></> } //PONER CARGANDO SI !MENSAJES 

        let buffMsgs = []
        let display = []
        buffMsgs.push(chatInfo.mensajes[0]);
        let auxIsNotUser = false;

        const msgDispl = (i) => {
            return <div key={i} className="flex items-end my-[10px]">
                {(auxIsNotUser = buffMsgs[0].usuario.id !== user.id) && <img src={chatInfo.usuarios.find((x) => x.id === buffMsgs[0].usuario.id).foto_perfil}
                    alt={`${buffMsgs[0].usuario}'s profile picture`}
                    className="object-cover w-[36px] h-[36px] rounded-[6px] ml-[10px] mb-[2px]" />}

                <div className={`${auxIsNotUser ? "ml-0 mr-auto" : "mr-0 ml-auto"} flex flex-col`}>
                    {buffMsgs.map((msg, index) => {
                        return (
                            <React.Fragment key={index}>
                                {msg.imagenes.map((imge, mIdx) => {
                                    return (<div key={-mIdx} className={`${auxIsNotUser ? "ml-[10px] mr-[30px] rounded-bl-[0] bg-background" : "mr-[10px] ml-[auto] max-w-[266px] rounded-br-[0] bg-primary text-background "}  flex flex-col w-fit  rounded-[10px] p-[10px] mt-[3px]`}>
                                        <div className={`inline-block mb-[5px] mt-[2px] box-border w-[full] min-w-full max-h-[200px] h-[200px] overflow-hidden rounded-[10px]`}>
                                            <img src={imge} alt={`${mIdx} picture`} className="rounded-[10px] object-cover min-w-full min-h-full" />
                                        </div>

                                        <h1 className={`${auxIsNotUser ? "text-secondary" : "text-foreground"} flex items-center font-semibold mr-0 ml-auto inline-block text-[12px]  mt-[5px]`}>{new Date(msg.fecha).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            <div className="ml-[5px] w-3 h-3 bg-secondary rounded-full opacity-50 border-foreground border-[1px]" />
                                            <div className="ml-[2px] w-3 h-3 bg-accent rounded-full opacity-50 border-foreground border-[1px]" />
                                        </h1>
                                    </div>)
                                })}

                                <div className={`${auxIsNotUser ? "ml-[10px] mr-[30px] rounded-bl-[0] bg-background" : "mr-[10px] ml-[auto] max-w-[266px] rounded-br-[0] bg-primary text-background "}  flex flex-col w-fit  rounded-[10px] p-[10px] mt-[3px]`}>
                                    <h1 className={`inline-block ml-[4px] text-[15px] font-medium ${msg.texto.length < 20 ? "mr-[30px]" : ""}`}>{msg.texto} </h1>
                                    <h1 className={`${auxIsNotUser ? "text-secondary" : "text-foreground"} flex items-center font-semibold mr-0 ml-auto inline-block text-[12px]  mt-[5px]`}>
                                        {!auxIsNotUser && <>
                                        
                                            {msg.recibido.length < (chatInfo.usuarios.length - 1) && <div className=" mr-[5px] w-[10px] h-[10px] bg-backgroundAlpha opacity-60 rounded-full border-background border-t-[2px] " />}
                                            {msg.recibido.length >= (chatInfo.usuarios.length - 1) && <div className="ml-[3px] mr-[3px] w-[9px] h-[9px] bg-secondary  rounded-full border-background border-t-[2px] " />}
                                            {msg.visto.length >= (chatInfo.usuarios.length - 1) && <div className=" mr-[5px] w-[9px] h-[9px] bg-accent opacity-90 rounded-full border-background border-t-[2px] " />}
                                        </>
                                        }
                                        {new Date(msg.fecha).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    </h1>
                                </div>
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        }

        for (let i = 1, st = 0; i < chatInfo.mensajes.length; i++) {
            if (chatInfo.mensajes[i - 1].usuario.id === chatInfo.mensajes[i].usuario.id
                && (chatInfo.mensajes[i - 1].usuario.id === user.id || (new Date(chatInfo.mensajes[i].fecha) - new Date(chatInfo.mensajes[st].fecha)) / 60000 <= 5)) {
                buffMsgs.push(chatInfo.mensajes[i])
            } else {
                display.push(msgDispl(i))

                buffMsgs = []
                buffMsgs.push(chatInfo.mensajes[i])
                st = i
            }
        }

        display.push(msgDispl(-1))

        return <div className='mt-[20px]'> {display} </div>;
    }

    return (
        <div className={`flex flex-col bg-foreground shadow-2xl border-[1px] border-background rounded-[10px] w-[340px] mr-[4px]
        overflow-hidden transition-all duration-300 ease-in-out pointer-events-auto 
        ${minimized ? 'h-[50px]' : 'h-[400px] '}`} >

            {/* chat header */}
            <div className="flex justify-between shadow-foreground items-center px-[14px] bg-background rounded-t-[10px] font-bold border-t-[1px] border-foreground">
                {/* <button onClick={handleOptions} className="my-[14px]">
                    <AiOutlineMenu className="text-secondary w-[1.5rem] h-[1.5rem] hover:text-accent" />
                </button> */}

                <button onClick={toggleMinimized} className="w-[100%] py-0 h-[100%]">
                    {chatInfo.nombre === '*' ? chatInfo.usuarios.find((us) => us.id != user.id).username : chatInfo.nombre}

                </button>
                <button onClick={handleCloseChat} className="my-[14px]">
                    <AiOutlineClose className="text-secondary w-[1.5rem] h-[1.5rem] hover:text-accent " />
                </button>
            </div>
            {/* chat messages */}
            <div ref={chatRef} className="mod-scroll h-(calc(100% - 100px)) p-[10] overflow-y-auto ">

                <div className="absolute z-1 t-0 h-[10px] w-[340px] bg-gradient-to-t from-transparent to-background" />
                {displayMsgs()}
            </div>
            {/* chat input */}
            <form onSubmit={processMessage} className="relative mt-auto mb-0 flex justify-between items-center h-[50] px-[10] bg-backgroundAlpha rounded-[10px]">
                {/* <button className="flex items-center pl-[20px] rounded-l-[10px]  hover:text-accent">
                    <AiOutlinePicture className="w-[1.3rem] h-[1.3rem] fill-current opacity-80" />
                </button> */}
                <input className="flex-grow mr-[10px] ml-[10px] border-none rounded-[10px] p-[16px] bg-backgroundAlpha placeholder-secondary  focus:outline-none"
                    type="text" value={newMsg.msg.texto} placeholder="Type your message..." onChange={changeMessage} />
                <button className=" flex items-center pr-[20px] rounded-r-[10px] hover:text-accent " type="submit">
                    <AiOutlineSend /></button>
            </form>
        </div>
    );
}