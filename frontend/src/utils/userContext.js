import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();
import { clientMutator, clientRequester, } from "./graphqlManager.js";
import { socketPromise } from "@/utils/socketManager.js";

const chatContent = `
id
usuarios {
    id
    username
    foto_perfil
}
nombre
mensajes {
    id
    fecha
    usuario{
        id
    }
    texto
    imagenes
    visto{
        id
    }
    recibido{
        id
    }
}
`

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [chats, setChats] = useState([]);
    const [socket, setSocket] = useState();
    const [recomendations, setRecomendations] = useState([]);
    const [friendsPosts, setFriendsPosts] = useState([]);
    const [lastMsgChats, setLastMsgChats] = useState([])
    const [isNewMsgs, setIsNewMsgs] = useState(false)

    const userInfo = async () => { //ONCE PER START OF PAGE
        if (!user) {

            /* const savedUser = localStorage.getItem('user');
            if(savedUser){
                const us = JSON.parse(savedUser);
                setUser(us);
                return us;
            }else{ */
            console.log(document.cookie.toString().split('; ').find((cookie) => cookie.startsWith(`user=`)).split("=")[1], "USERRRRRRRRRRRRRR")

            return await requestUser(document.cookie.toString().split('; ').find((cookie) => cookie.startsWith(`user=`)).split("=")[1]).
                then((us) => {
                    if(!us){
                        document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                        window.location.reload();
                        return 
                    }
                    
                    setUser(us);

                    const nChats = us.chats.map((chat) => {
                        return { ...chat, active: false }
                    })
                    setChats(nChats);

                    //localStorage.setItem('user', JSON.stringify(us));
                    return us;
                });
            //}

        } else {
            return user
        }
    }

    const agregarAmigo = (friend) => {
      setUser((prevUser) => ({
        ...prevUser,
        amigos: [...prevUser.amigos, friend]
      }));
    };

    const requestUser = async (token) => {
        const { descUsuario } = await clientRequester(
            `query DescUsuario($token: String!) {
                descUsuario(token: $token) {
                    id
                    nombre
                    apellido
                    username
                    correo
                    foto_perfil
                    carrera{
                        id
                    }
                    chats{
                        id
                        nombre
                        usuarios{
                            id
                        }
                    }
                    amigos{
                        id
                        username 
                        foto_perfil
                        nombre
                        apellido
                        carrera{
                            nombre
                        }
                    }
                    publicaciones{
                        id
                    }
                    comentarios{
                        id
                    }
                    intereses{
                        tag{
                            nombre
                        }
                        valor
                    }
                }
            }`,
            { token: token }, true).then((data) => { return data; })
            .catch((error) => { throw error; })

        return descUsuario;
    }

    const getLastMsgChats = async () => {
        if (!user) { return }
        const { getLastMsgChats } = await clientRequester(
            `query GetLastMsgChats($chats: [ID!]!) {
                getLastMsgChats(chats: $chats) {
                    id
                    nombre
                    usuarios{
                        id
                        username
                        foto_perfil
                    }
                    mensajes { 
                        id
                        fecha
                        usuario{
                            id
                            username
                            foto_perfil
                        }
                        texto
                        imagenes
                        visto{
                            id
                        }
                        recibido{
                            id
                        }
                    }
                }
            }`,
            { chats: user.chats.map((chat) => chat.id) }, false).then((data) => { return data; })
            .catch((error) => { throw error; })
        if(!getLastMsgChats){
            return []
        }
        let isNew = false;
        setLastMsgChats(getLastMsgChats.map((chat) => {
            const newMsg = chat.mensajes[0].usuario.id !== user.id && !chat.mensajes[0].visto.some((us) => us.id === user.id);
            if (newMsg) { isNew = true; }
            return { ...chat, newMsg: newMsg }
        }));

        setIsNewMsgs(isNew);

        return getLastMsgChats
    }

    const getRecomendations = async () => {
        const { feedRecomendations } = await clientRequester(
            `query FeedRecomendations($usuario: ID!) {
                feedRecomendations(usuario: $usuario) {
                    id
                    fecha
                    imagenes
                    texto
                    likes{
                        id
                    }
                    comentarios{
                        id
                        usuario{
                            id
                            username
                            foto_perfil
                        }
                        texto
                        imagenes
                        fecha
                        likes{
                            id
                        }
                    }
                    usuario{
                        id
                        username
                        foto_perfil
                    }
                    tagInfo{
                        tag{
                            nombre
                        }
                        valor
                    }
                    enGrupo{
                        nombre
                    }
                }
            }`,
            { usuario: user.id }, true).then((data) => { return data; })
            .catch((error) => { throw error; })

        setRecomendations(feedRecomendations);
        return feedRecomendations
    }

    const getFriendsPosts = async () => {
        const { feedFriends } = await clientRequester(
            `query FeedFriends($usuario: ID!) {
                feedFriends(usuario: $usuario) {
                    id
                    fecha
                    imagenes
                    texto
                    likes{
                        id
                    }
                    comentarios{
                        id
                        usuario{
                            id
                            username
                            foto_perfil
                        }
                        texto
                        imagenes
                        fecha
                        likes{
                            id
                        }
                    }
                    usuario{
                        id
                        username
                        foto_perfil
                    }
                    tagInfo{
                        tag{
                            nombre
                        }
                        valor
                    }
                    enGrupo{
                        nombre
                    }
                }
            }`,
            { usuario: user.id }, true).then((data) => { return data; })
            .catch((error) => { throw error; })

        setFriendsPosts(feedFriends);
        return feedFriends
    }



    useEffect(() => {
        if (user) {
            const handleBeforeUnload = async (event) => {
                await clientRequester(
                    `query LogOut($id: ID!) {
                    logOut(id: $id) {
                        id
                        username
                    }
                }`,
                    { id: user.id }, true).catch((error) => { throw error; })
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [user, socket]);



    const updateSockets = async () => {
        if (user) {
            const sock = socket != undefined ? socket : await socketPromise().then((rSocket) => {
                setSocket(rSocket);
                return rSocket;
            })
            if (sock == null) { return; }

            sock.on('connected friend', (userID) => {
                setUser((prevUser) => {
                    return {
                        ...prevUser, amigos: prevUser.amigos.map((friend) => {
                            if (friend.id == userID) {
                                return { ...friend, active: true }
                            } else {
                                return friend;
                            }
                        })
                    }
                })
                setChats((prevChats) =>
                    prevChats.map((chat) => {
                        let oked = true;
                        if (chat.mensajes && chat.usuarios.some((us) => us.id === userID)) {
                            return {
                                ...chat, mensajes: [...chat.mensajes].reverse().map((msg) => {
                                    if (oked) {
                                        if (msg.recibido.includes(userID)) {
                                            oked = false;
                                            return msg;
                                        } else {
                                            return { ...msg, recibido: [...msg.recibido, userID] }
                                        }
                                    } else {
                                        return msg;
                                    }
                                }).reverse()
                            }
                        } else {
                            return { ...chat, }
                        }
                    })
                )
            });

            sock.on('disconnected friend', (userID) => {
                setUser((prevUser) => {
                    return {
                        ...prevUser, amigos: prevUser.amigos.map((friend) => {
                            if (friend.id == userID) {
                                return { ...friend, active: false }
                            } else {
                                return friend;
                            }
                        })
                    }
                })
            });

            sock.on('chat message', async (content, callback) => {
                callback();

                await reciveMessage(content);
            });

            sock.on('read mark', (chatID, msgID, userID) => {
                let idx = 0;
                if (chats[idx = chats.findIndex((chat) => chat.id === chatID)].mensajes && chats[idx].active) {
                    markStateMsg(chatID, msgID, [userID], [userID]);
                }
            })

            sock.emit('connected user', { id: user.id, friends: user.amigos });
            return sock;
        }
    }

    useEffect(() => {
        updateSockets();
        if (socket) {
            return () => {
                socket.off('connected friend');
                socket.off('chat message');
                socket.off('read mark');
            }
        }
    }, [chats, user, lastMsgChats]);



    const changeFriendChatState = async (friendID, state) => {
        let idx
        if ((idx = chats.findIndex((chat) => chat.usuarios.length === 2 && chat.nombre === '*'
            && chat.usuarios.findIndex((x) => x.id === friendID) > -1 && chat.usuarios.findIndex((x) => x.id === user.id) > -1)) > -1) {

            if (!chats[idx].id) {
                setChats((prevChats) => prevChats.filter((chat) => chat !== chats[idx]));
            } else {
                changeChatState(chats[idx].id, state);
            }
        } else {

            const { buscarChat } = await clientRequester(
                `query buscarFriendChat($users: [ID!]!) {
                    buscarChat(users: $users) {
                        ${chatContent}
                    }
                }`, { users: [user.id, friendID] }, false).then((data) => { return data; })
                .catch((error) => { throw error; });

            if (buscarChat && buscarChat.length > 0) {
                setChats((prevChats) => [...prevChats, { ...buscarChat, active: true }]);

            } else {
                if (!buscarChat) {
                    console.log("Error al buscar amigo");
                    console.log("No se encontro el chat", buscarChat);
                    // return
                }
                // const nChat = {
                //     usuarios: [user.amigos.find((friend) => friend.id === friendID),
                //     { id: user.id, foto_perfil: user.foto_perfil, username: user.username }],
                //     nombre: '*',
                //     mensajes: [],
                //     active: true
                // }

                // setChats((prevChats) => [...prevChats, nChat]);

                addChat([friendID, user.id], '*', undefined);
            }
        }
    }

    const changeChatState = async (chatID, state) => {
        let setted = false;

        await setChats((prevChats) => prevChats.map((chat) => {
            if (chatID === chat.id) {
                if(chat.active == state){
                    setted = true;
                }
                return { ...chat, active: state }
            } else {
                return chat
            }
        }))
        
        if(setted){ return }

        if (state) {
            let idx = 0;
            if (!chats[idx = chats.findIndex((chat) => chat.id === chatID)].mensajes) {
            

                const { openChat } = await clientMutator(
                    `mutation OpenChat($id: ID!, $usuario: ID!) {
                    openChat(id: $id, usuario: $usuario) {
                        ${chatContent}
                    }
                }`, { id: chatID, usuario: user.id })
                    .then((data) => { return data; }).catch((error) => { throw error; });


                if (!openChat) {
                    console.log("No se encontro el Chat");
                    return
                } else if (openChat.mensajes.length > 0) {
                    setLastMsgChats((prevChats)=> prevChats.map((chat)=>{
                        if(chatID === chat.id){
                            return{...chat, newMsg : false}
                        }else{
                            return chat;
                        }
                    }))
                    socket.emit('read mark', openChat.usuarios.map((us) => us.id).filter((ids) => ids != user.id), chatID, openChat.mensajes[openChat.mensajes.length - 1].id, user.id);
                }

                console.log("Se encontro el chat", openChat);

                setChats((prevChats) => prevChats.map((chat) => {
                    if (chatID === chat.id) {
                        return { ...openChat, active: true }
                    } else {
                        return chat
                    }
                }))

            } else if (chats[idx].mensajes.length > 0) {
                setLastMsgChats((prevChats)=> prevChats.map((chat)=>{
                    if(chatID === chat.id){
                        return{...chat, newMsg : false}
                    }else{
                        return chat;
                    }
                }))
                socket.emit('read mark', chats[idx].usuarios.map((us) => us.id).filter((ids) => ids != user.id), chatID, chats[idx].mensajes[chats[idx].mensajes.length - 1].id, user.id);
            }
        }

    }

    const reciveMessage = async ({ chatID, msg }) => {//recive index to know when to modify the chat and when to wait

        let idx = 0;

        console.log("Mensaje Recibido", chatID, msg, chats)
        if ((idx = chats.findIndex((chat) => chat.id === chatID)) > -1) {
            setLastMsgChats((prevChats) => prevChats.map((chat) => {
                if (chatID === chat.id) {
                    return { ...chat, mensajes: [{ ...msg, usuario: chat.usuarios.find((us) => us.id == msg.usuario.id) }], newMsg: true }
                } else {
                    return chat
                }
            }))

            if (chats[idx].mensajes) {
                setChats((prevChats) => prevChats.map((chat) => {
                    if (chatID === chat.id) {
                        return { ...chat, mensajes: [...chat.mensajes, msg] }
                    } else {
                        return chat
                    }
                }))

                if (chats[idx].active) {

                    const { markRead } = await clientMutator(
                        `mutation MarkRead($id: ID!, $usuario: ID!) {
                        markRead(id: $id, usuario: $usuario) {
                            id
                            visto{
                                id
                            }
                            recibido{
                                id
                            }
                        }
                    }`, { id: msg.id, usuario: user.id }).then((data) => { return data; }).catch((error) => { throw error; });
                    
                    socket.emit('read mark', chats[idx].usuarios.map((us) => us.id).filter((ids) => ids != user.id), chatID, msg.id, user.id);

                    setChats((prevChats) => prevChats.map((chat) => {
                        if (chatID === chat.id) {
                            return {
                                ...chat, mensajes: chat.mensajes.map((mensaje) => {
                                    if (mensaje.id === msg.id) {
                                        return { ...mensaje, recibido: markRead.recibido, visto: markRead.visto }
                                    } else {
                                        return mensaje;
                                    }
                                })
                            }
                        } else {
                            return chat
                        }
                    }))

                } else {
                    setIsNewMsgs(true);
                }

            } else {
                setIsNewMsgs(true);
            }

        } else {
            const { buscarChat } = await clientRequester(
                `query BuscarChat($id: ID!) {
                    buscarChat(id: $id) {
                        ${chatContent}
                    }
                }`, { id: chatID }, false).then((data) => { return data; })
                .catch((error) => { throw error; });

            setChats((prevChats) => [...prevChats, { ...buscarChat, active: false }])

            setLastMsgChats((prevChats) => [...prevChats,
            {
                ...buscarChat, mensajes:
                    [{
                        ...buscarChat.mensajes[buscarChat.mensajes - 1],
                        usuario: buscarChat.usuarios.find((us) => us.id == buscarChat.mensajes[buscarChat.mensajes - 1].usuario.id), 
                        newMsg: true
                    }]
            }
            ])
        }
    }

    const sendMessage = async ({ chatID, msg, toUsers }) => {
        if (!chatID) { return; }
        const prevMens = { ...msg, usuario: { id: msg.usuario }, recibido: [], visto: [] }

        setChats((prevChats) => prevChats.map((chat) => { //ESTADO DE ENVIANDO ANTES DE ENVIAR COMPLETAMNETE
            if (chatID === chat.id) {
                return { ...chat, mensajes: [...chat.mensajes, prevMens] }
            } else {
                return chat
            }
        }))


        const { addMensaje } = await clientMutator(
            `mutation AddMensaje($id: ID!, $mensaje: MensajeInput!) {
                    addMensaje(id: $id, mensaje: $mensaje) {
                        id
                        fecha
                        usuario{
                            id
                        }
                        texto
                        imagenes
                        visto{
                            id
                        }
                        recibido{
                            id
                        }
                    }
                }`, { id: chatID, mensaje: msg })
            .then((data) => { return data; }).catch((error) => { throw error; });

        if (!addMensaje) {
            setChats((prevChats) => prevChats.map((chat) => {
                if (chatID === chat.id) {
                    return { ...chat, mensajes: chat.mensajes.filter((mensaje) => mensaje != prevMens) }
                } else {
                    return chat
                }
            }))

        } else {
            setLastMsgChats((prevChats) => prevChats.map((chat) => { //ESTADO DE ENVIANDO ANTES DE ENVIAR COMPLETAMNETE
                if (chatID === chat.id) {
                    return { ...chat, mensajes: [{ ...msg, usuario: chat.usuarios.find((us) => us.id == msg.usuario) }] }
                } else {
                    return chat
                }
            }))

            setChats((prevChats) => prevChats.map((chat) => {
                if (chatID === chat.id) {
                    return {
                        ...chat, mensajes: chat.mensajes.map((mensaje) => {
                            if (mensaje == prevMens) {
                                return addMensaje;
                            } else {
                                return mensaje;
                            }
                        })
                    }
                } else {
                    return chat
                }
            }))

            socket.emit('chat message', { toUsers, content: { chatID, msg: addMensaje } }, async (reciveds) => {
                if (reciveds.length == 0) {
                    return
                }

                markStateMsg(chatID, addMensaje.id, reciveds, []);

                const { markReciveds } = await clientMutator(
                    `mutation MarkReciveds($id: ID!, $usuarios: [ID!]!) {
                        markReciveds(id: $id, usuarios: $usuarios) {
                            id
                        }
                    }`, { id: addMensaje.id, usuarios: reciveds })
                    .then((data) => { return data; }).catch((error) => { throw error; });
            });
        }


    }

    const markStateMsg = (chatID, msgID, reciveds, readeds) => {

        let oked = false;
        setChats((prevChats) =>
            prevChats.map((chat) => {
                if (chat.id === chatID) {

                    return {
                        ...chat, mensajes: [...chat.mensajes].reverse().map((msg) => {
                            if (oked || msg.id === msgID) {
                                if (!oked) {
                                    oked = true;
                                }
                                if (readeds.every(item => msg.visto.includes(item)) && reciveds.every(item => msg.recibido.includes(item))) {
                                    oked = false;
                                    return msg;
                                } else {
                                    return { ...msg, visto: [...msg.visto, ...readeds], recibido: [...msg.recibido, ...reciveds] }
                                }
                            } else {
                                return msg;
                            }
                        }).reverse()
                    };
                } else {
                    return chat;
                }
            })
        );
    }

    const addChat = async (users, nombre, msg) => {

        const { crearChat } = await clientMutator(
            `mutation CrearChat($usuarios: [ID]!, $nombre: String!, $mensaje: MensajeInput ) {
                crearChat(usuarios: $usuarios, nombre: $nombre, mensaje: $mensaje) {
                    ${chatContent}
                }
            }`, { usuarios: users, nombre: nombre, mensaje: msg })
            .then((data) => { return data; })
            .catch((error) => { throw error; });

        setChats((prevChats) => [...prevChats, { ...crearChat, active: true }]);
        return crearChat;
    }

    const addPost = async ({ texto, imagenes }) => {
        setFriendsPosts((prevFriendsPosts) => [{ waiting: true }, ...prevFriendsPosts])

        const { crearPublicacion } = await clientMutator(
            `mutation CrearPublicacion($usuario: ID!, $fecha: Date!, $texto: String, $imagenes: [String], $votacion: ID) {
                crearPublicacion(usuario: $usuario, fecha: $fecha, texto: $texto, imagenes: $imagenes, votacion: $votacion) {
                    id
                    fecha
                    imagenes
                    texto
                    tagInfo{
                        tag{
                            nombre
                            id
                        }
                        valor
                    }
                    enGrupo{
                        nombre
                    }
                }
            }`, { usuario: user.id, fecha: new Date(), texto: texto, imagenes: imagenes })
            .then((data) => { return data; })
            .catch((error) => { throw error; });


        console.log("Nueva Publicacion", crearPublicacion);
        if (!crearPublicacion || crearPublicacion === null) { return }



        setUser((prevUser) => {
            return {
                ...prevUser,
                publicaciones: [...prevUser.publicaciones, crearPublicacion.id]
            }
        })

        setFriendsPosts((prevFriendsPosts) => {
            const updatedPosts = prevFriendsPosts.filter((post) => post.waiting !== true);

            return [{
                ...crearPublicacion, likes: [], comentarios: [],
                usuario: { id: user.id, username: user.username, foto_perfil: user.foto_perfil }
            },
            ...updatedPosts,
            ]

        })
        return crearPublicacion;
    }


    const removePost = async ({ id, inFriends }) => {
        const { eliminarPublicacion } = await clientMutator(
            `mutation EliminarPublicacion($id: ID!) {
                eliminarPublicacion(id : $id) {
                    id
                    esComentario{
                        id
                    }
                }
            }`, { id: id })
            .then((data) => { return data; })
            .catch((error) => { throw error; });

        console.log(eliminarPublicacion)
        if (!eliminarPublicacion || eliminarPublicacion === null) { return }

        const onPosts = inFriends ? setFriendsPosts : setRecomendations;

        if (eliminarPublicacion.esComentario && eliminarPublicacion.esComentario != null) {
            setUser((prevUser) => { return { ...prevUser, comentarios: prevUser.comentarios.filter((com) => com.id !== id) } })
            onPosts((prevFriendsPosts) => prevFriendsPosts.map((post) => {
                if (post.id == eliminarPublicacion.esComentario.id) {
                    return { ...post, comentarios: post.comentarios.filter((com) => com.id !== id) }
                } else {
                    return post;
                }
            }))

        } else {
            setUser((prevUser) => { return { ...prevUser, publicaciones: prevUser.publicaciones.filter((pub) => pub.id !== id) } })
            onPosts((prevFriendsPosts) => prevFriendsPosts.filter((pub) => pub.id !== id))
        }

        return eliminarPublicacion;
    }

    const addComment = async ({ texto, imagenes, esComentario, inFriends }) => {

        const { crearComentario } = await clientMutator(
            `mutation CrearComentario($usuario: ID!, $fecha: Date!, $texto: String, $imagenes: [String], $votacion: ID, $esComentario: ID!) {
                crearComentario(usuario: $usuario, fecha: $fecha, texto: $texto, imagenes: $imagenes, votacion: $votacion, esComentario: $esComentario) {
                    id
                    fecha
                    imagenes
                    texto
                    esComentario{
                        id
                    }
                }
            }`, { usuario: user.id, fecha: new Date(), texto: texto, imagenes: imagenes, esComentario: esComentario })
            .then((data) => { return data; })
            .catch((error) => { throw error; });


        console.log("Nuevo Comentario", crearComentario, inFriends);
        if (!crearComentario || crearComentario === null) { return }

        setUser((prevUser) => {
            return {
                ...prevUser,
                comentarios: [...prevUser.comentarios, crearComentario.id]
            }
        })


        const onPosts = inFriends ? setFriendsPosts : setRecomendations;

        onPosts((prevFriendsPosts) => prevFriendsPosts.map((post) => {
            if (post.id == esComentario) {
                return { ...post, comentarios: [...post.comentarios, { ...crearComentario, likes: [], usuario: { id: user.id, username: user.username, foto_perfil: user.foto_perfil } }] }
            } else {
                return post;
            }
        }))


        return crearComentario;
    }

    const likePost = async ({ id, dislike, inFriends }) => {

        const { likePublicacion } = await clientMutator(
            `mutation LikePublicacion($id: ID!, $usuario: ID!) {
                likePublicacion(id: $id, usuario: $usuario) {
                    id
                    likes{
                        id
                    }
                    esComentario{
                        id
                    }
                }
            }`, { id: id, usuario: user.id })
            .then((data) => { return data; })
            .catch((error) => { throw error; });

        if (!likePublicacion || likePublicacion === null) { return }

        /* setUser((prevUser) => {
            return {
                ...prevUser,
                likes: dislike ? prevUser.likes.filter((prevId) => prevId !== id) : [...prevUser.likes, id]
            }
        })
 */

        const onPosts = inFriends ? setFriendsPosts : setRecomendations;

        if (likePublicacion.esComentario && likePublicacion.esComentario != null) {
            onPosts((prevFriendsPosts) => prevFriendsPosts.map((post) => {
                if (post.id == likePublicacion.esComentario.id) {
                    return {
                        ...post, comentarios: post.comentarios.map((com) => {
                            if (com.id == id) {
                                return { ...com, likes: likePublicacion.likes }
                            } else {
                                return com;
                            }
                        })
                    }
                } else {
                    return post;
                }
            }))
        } else {
            onPosts((prevFriendsPosts) => prevFriendsPosts.map((post) => {
                if (post.id == id) {
                    return { ...post, likes: likePublicacion.likes }
                } else {
                    return post;
                }
            }))
        }

        return likePublicacion;
    }

    return (
        <UserContext.Provider value={{
            user, chats, recomendations, friendsPosts, lastMsgChats, isNewMsgs, userInfo,
            sendMessage, changeFriendChatState, changeChatState, setIsNewMsgs,
            addPost, removePost, addComment, likePost,
            getRecomendations, getFriendsPosts, getLastMsgChats,setFriendsPosts, setUser, agregarAmigo
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
