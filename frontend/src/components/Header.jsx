import {
  AiOutlineComment,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineBulb,
  AiFillCaretLeft,
  AiOutlineMenu,
  AiOutlineUserAdd,
  AiOutlineUser,
  AiOutlineExport,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../utils/userContext";
import { useTheme } from "next-themes";
import {
  useSearchUsers,
  useSearchGroups,
  useSendJoinRequest,
} from "../utils/searchUtils";
import { useComponentVisible } from "@/hooks/useComponentVisible";
import { HiOutlineUserGroup } from "react-icons/hi";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { is } from "date-fns/locale";

export default function Header({
  handleMenuTransitions,
  headerVisible,
  screenWidth,
  user,
  menuElements,
}) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const {
    lastMsgChats,
    getLastMsgChats,
    changeChatState,
    isNewMsgs,
    setIsNewMsgs,
    userInfo,
    agregarAmigo: agregarAmigoUserContext,
  } = useContext(UserContext);

  const handleCerrarSesion = () => {
    Cookies.remove("user");
    router.push("/login");
  };

  const [chatsMenuOpen, setChatsMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [onHoverLi, setOnHoverLi] = useState(-1);

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const {
    loading: loadingUser,
    error: errorUser,
    searchResults: userSearchResults,
    refetch: refetchUser,
  } = useSearchUsers(search);
  const {
    loading: loadingGroup,
    error: errorGroup,
    searchResults: groupSearchResults,
    refetch: refetchGroup,
  } = useSearchGroups(search);
  const {
    loading: loadingJoin,
    error: errorJoin,
    sendJoinRequest,
  } = useSendJoinRequest();



  // funcion para actualizar las queries (refetch) cada vez que se hace una busqueda
  const refecthQueries = () => {
    refetchUser();
    refetchGroup();
  };

  // la funcion handleSubmit se ejecuta cuando se da click en el boton de buscar
  // o se presiona enter en el input
  const handleSubmit = (e) => {
    e.preventDefault();
    // refetch para volver a hacer la consulta
    refecthQueries();
    // activa el dropdown
    if (search !== "") {
      setShowResults(true);
    }
  };

  // este useEffect se ejecuta cada vez que se cambia el valor del input
  // y si el valor es vacio cierra el dropdown para no generar otra consulta
  useEffect(() => {
    if (search === "") {
      setShowResults(false);
    }
  }, [search]);

  useEffect(() => {
    if (!lastMsgChats || lastMsgChats.length == 0) {
      getLastMsgChats();
    }
  }, []);

  const handleLastMsgs = () => {
    setChatsMenuOpen(!chatsMenuOpen);
  };

  // la funcion Groups recibe los datos de la consulta y los muestra en pantalla
  function Groups({ groupSearchResults, errorGroup, loadingGroup }) {
    if (loadingGroup) return <p>Loading...</p>;
    if (errorGroup) return <p>Error :</p>;
    // console.log("Grupos", groupSearchResults);

    // sacar el id del usuario logueado del local storage
    // console.log("ID del usuario logueado", loggedUserId);
    if (groupSearchResults.length === 0) {
      return (
        <div className="m-2 flex flex-grow justify-between rounded-md bg-background p-2">
          <div className="flex flex-col">
            <h1>No se encontraron grupos</h1>
          </div>
        </div>
      );
    }

    return groupSearchResults.map(({ id, nombre, descripcion, miembros }) => {
      // funcion que envia la solicitud de unirse al grupo
      const handleResquestGroup = () => {
        // e.preventDefault();
        console.log("Solicitando unirse al grupo", id);
        console.log("ID del usuario logueado", user.id);
        sendJoinRequest(id, user.id);
        // refetch para que se actualice el icono
        refecthQueries();
      };

      // console.log("Miembros", miembros);

      // determina si el usuario es miembro del grupo que busco
      // para renderizar un boton de unirse o no
      const checkUserIsMember = () => {
        // bool que determina si el usuario es miembro del grupo
        const isMember = miembros.some((miembro) => {
          return miembro.id === user.id;
        });

        // si es miembro se retorna el boton de unirse deshabilitado
        if (isMember) {
          console.log("Es miembro");
          return (
            <>
              <button
                className="rounded bg-green-500 px-4 py-2 font-bold text-white"
                disabled
              >
                <HiOutlineUserGroup />
              </button>
            </>
          );
        }

        return (
          <>
            <button
              onClick={handleResquestGroup}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              <AiOutlineUsergroupAdd />
            </button>
          </>
        );
      };

      return (
        <div
          key={id}
          className="m-2 flex flex-grow justify-between rounded-md bg-background p-2"
        >
          <div className="flex flex-col">
            {/* TODO: inserte aqui la foto (user no tiene foto) */}
            <h1>{nombre}</h1>
            <p className="hidden lg:flex">{descripcion}</p>
          </div>
          <div className="m-2 flex">{checkUserIsMember()}</div>
        </div>
      );
    });
  }

  const AGREGAR_AMIGO = gql`
    mutation agregarAmigo($id: ID!, $amigo: ID!) {
      agregarAmigo(id: $id, amigo: $amigo) {
        id
      }
    }
  `;

  // la funcion Users recibe los datos de la consulta y los muestra en pantalla
  function Users({ userSearchResults, errorUser, loadingUser }) {
    // checa si hay un error o si esta cargando
    if (loadingUser) return <p>Loading...</p>;
    if (errorUser) return <p>Error</p>;
    console.log("Usuarios", userSearchResults);

    // si no hay usuarios que mostrar, muestra un mensaje
    if (userSearchResults.length === 0) {
      return (
        <div className="m-2 flex flex-grow justify-between rounded-md bg-background p-2">
          <div className="flex flex-col">
            <h1>No se encontraron usuarios</h1>
          </div>
        </div>
      );
    }

    // mutation para agregar un amigo
    const [
      agregarAmigo,
      { loading: agregarLoading, error: errorAgregar, refetch: refetchAgregar },
    ] = useMutation(AGREGAR_AMIGO, {
      onCompleted: () => {
        console.log("Amigo agregado");
      },
    });

    return userSearchResults.map(({ id, nombre, apellido, correo }) => {
      // funcion que envia la solicitud de amistad
      const handleAddFriend = (e) => {
        e.preventDefault();
        console.log("Agregando amigo", id);

        agregarAmigo({ variables: { id: user.id, amigo: id } })
          .then(() => {
            setTimeout(() => {
              // userInfo();
              refecthQueries();
            }
            , 1000);
          })
          .catch((error) => {
            console.log(error);
          });

        if (errorAgregar) {
          console.log(errorAgregar);
        }

        console.log("Agregando amigo", id);
        // TODO: Agregar amigo

        // refetch para actualizar la lista de amigos
        // refecthQueries();
        // agregarAmigoUserContext(id);
      };

      // determina si el usuario encontrado es el mismo que esta logueado
      // para no mostrarlo en la lista de usuarios
      // sacar el id del usuario logueado del user context
      // si el id del usuario logueado es igual al id del usuario que se esta iterando
      // se retorna null para no mostrarlo en la lista
      if (user.id === id) {
        return ;
      }

      // bool que determina si el usuario es amigo
      const isFriend = user.amigos.some((amigo) => {
        return amigo.id === id;
      });
      console.log("Es amigo", isFriend);

      return (
        <div
          key={id}
          className="m-2 flex flex-grow justify-between rounded-md bg-background p-2"
        >
          <div className="flex flex-col">
            {/* TODO: inserte aqui la foto (user no tiene foto) */}
            <h1>
              {nombre} {apellido}
            </h1>
            <p className="hidden lg:flex">{correo}</p>
          </div>
          <div className="m-2 flex">
            {isFriend ? (
              <button
              disabled
              className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              <AiOutlineUser />
            </button>
              )
            : (
              <button
              onClick={handleAddFriend}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              <AiOutlineUserAdd />
            </button>
            )}
          </div>
        </div>
      );
    });
  }

  // la funcion DropDown es el componente que se muestra en pantalla
  // y que contiene los resultados de la busqueda y usa el hook useComponentVisible
  const DropDown = () => {
    const { ref, isComponentVisible, setIsComponentVisible } =
      useComponentVisible(showResults);

      useEffect(() => {
        if (!isComponentVisible) {
          // console.log("Componente no visible");
          setShowResults(false);
        }
      }, [isComponentVisible]);


    return (
      <div ref={ref}>
        {isComponentVisible && (
          // el posicionamiento del dropdown se hace con tailwind y absolute pa que
          // se vea abajo del input y no se mueva con el scroll
          <div className="absolute left-1/4 top-20 z-50   w-1/2 rounded-lg bg-foreground  p-4 shadow-2xl shadow-background dark:text-[#a9dacb]  ">
            <h1 className="text-xl ">Personas</h1>
            <div className="flex flex-col gap-2">
              <Users
                userSearchResults={userSearchResults}
                errorUser={errorUser}
                loadingUser={loadingUser}
              />
            </div>
            <h1 className="text-xl ">Grupos</h1>
            <div className="flex flex-col gap-2">
              <Groups
                groupSearchResults={groupSearchResults}
                errorGroup={errorGroup}
                loadingGroup={loadingGroup}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header
        className={`z-45 fixed flex h-[70px] w-screen items-center bg-foreground shadow-md ${
          headerVisible
            ? "-translate-y-0 transform transition-transform duration-100 ease-in-out"
            : "-translate-y-[70px] transform transition-transform duration-100 ease-in-out"
        }`}
      >
        {(screenWidth >= 1024 && (
          <div className="w-200 flex items-center">
            <img
              className="relative ml-[7vw] mt-[7px] h-[50px] w-[140px]"
              src="/LogoUchat.png"
              alt="Your Logo"
            />
            {/* <img className="mask" /></div> */}
          </div>
        )) || (
          <button
            onClick={() => setSideMenuOpen(true)}
            className="my-[14px] ml-[10vw]"
          >
            <img
              className=" h-[4vw] min-h-[40px] w-[4vw] min-w-[40px] rounded-[6px] "
              src={user?.foto_perfil}
              alt={`${user.username}'s profile picture`}
            />
            {/* <AiOutlineMenu className="text-secondary w-[2rem] h-[2rem] hover:text-accent" /> */}
          </button>
        )}

        <div
          className={
            " left-1/2 flex w-0 flex-grow items-center justify-center " +
            (screenWidth < 768 ? "ml-[8vw]" : "")
          }
        >
          <form
            className="m-[30px] flex w-[30vw] min-w-[60vw] items-center rounded-[10px] bg-background md:min-w-[30vw]"
            action="#"
            onSubmit={handleSubmit}
          >
            <input
              className="max-[w-100%] w-[92%] flex-grow rounded-[10px] border-none  bg-background p-[10px] pl-[20px] text-base placeholder-secondary focus:outline-none"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar"
            />
            {
              <button
                className="text-inherit w-[8%] min-w-[30px] border-none bg-transparent text-base"
                type="submit"
              >
                <AiOutlineSearch className="h-[1.5rem] w-[1.5rem]" />
              </button>
            }
          </form>
          <DropDown />
        </div>

        {screenWidth > 768 && (
          <div className="ml-auto mr-[5vw] flex w-[18vw] min-w-[150px] items-center justify-between lg:w-[15vw]">
            <button
              className="relative inline-block h-[45px] w-[45px] min-w-[45px] rounded-[10px] bg-primary text-background hover:bg-background hover:text-primary"
              onClick={() => {
                handleLastMsgs();
                setIsNewMsgs(false);
              }}
            >
              <AiOutlineComment className="ml-[11px] h-[1.5rem] w-[1.5rem] " />
              {isNewMsgs && (
                <div className="absolute right-[3px] top-[3px]  h-3 w-3 rounded-full bg-accent">
                  <div className=" absolute h-3  w-3 animate-ping rounded-full bg-accent" />
                </div>
              )}
            </button>
            <button
              className="relative inline-block h-[45px] w-[45px] min-w-[45px] rounded-[10px] bg-background text-primary hover:bg-primary hover:text-background"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <AiOutlineBulb className="ml-[11px] h-[1.5rem] w-[1.5rem] " />
            </button>
            <button
              className="relative inline-block h-[45px] w-[45px] min-w-[45px] rounded-[10px] bg-background text-primary hover:bg-primary hover:text-background"
              onClick={handleCerrarSesion}
            >
              <AiOutlineExport className="ml-[11px] h-[1.5rem] w-[1.5rem] " />
            </button>
          </div>
        )}

        <div className="absolute left-0 mb-[-90px] h-[20px] w-full bg-gradient-to-t from-transparent to-background" />
        {chatsMenuOpen &&
          PrevChats(lastMsgChats, setOnHoverLi, onHoverLi, changeChatState)}
      </header>

      {screenWidth < 1024 && (
        <SideMenu
          user={user}
          handleMenuTransitions={handleMenuTransitions}
          sideMenuOpen={sideMenuOpen}
          setSideMenuOpen={setSideMenuOpen}
          menuElements={menuElements}
          setTheme={setTheme}
          handleLastMsgs={handleLastMsgs}
        />
      )}
    </>
  );
}

const PrevChats = (lastMsgChats, setOnHoverLi, onHoverLi, changeChatState) => {
  return (
    <ul
      className="list-container fixed top-[76px] h-[400px] max-w-[100vw] rounded-[10px] border-[1px] border-foreground
        bg-background shadow-2xl sm:right-0 md:right-[5vw]  md:max-w-[300px] xl:right-[8vw]"
      onMouseOut={() => setOnHoverLi(-1)}
    >
      {lastMsgChats.map((chat, index) => (
        <li
          key={chat.id}
          className="flex h-[60px] cursor-pointer snap-start flex-row items-center border-b border-dotted border-secondary p-2 hover:bg-primary hover:text-background "
          onMouseOver={() => setOnHoverLi(index)}
          onClick={() => changeChatState(chat.id, true)}
        >
          <img
            src={chat.mensajes[0].usuario.foto_perfil}
            className="ml-[1rem] mr-[1rem] h-[40px] w-[40px] rounded-[10px] md:mr-[0.5rem]"
            alt={`${chat.mensajes[0].usuario.username}'s profile picture`}
          />
          <h1
            className={`text-[16px] font-bold ${
              index == onHoverLi ? "text-background" : "text-secondary"
            } mr-[10px]`}
          >
            {" "}
            {chat.mensajes[0].usuario.username.charAt(0).toUpperCase() +
              chat.mensajes[0].usuario.username.slice(1) +
              ":   "}{" "}
          </h1>
          <h1 className="truncate text-[16px] font-thin">
            {" "}
            {chat.mensajes[0].texto}{" "}
          </h1>
          {chat.newMsg && (
            <div className="absolute right-3 h-3 w-3 rounded-full bg-accent">
              <div className="absolute h-3 w-3 animate-ping rounded-full bg-accent" />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

const SideMenu = ({
  handleMenuTransitions,
  user,
  sideMenuOpen,
  setSideMenuOpen,
  menuElements,
  setTheme,
  handleLastMsgs,
}) => {
  const buttStyle =
    "flex justify-start items-center w-full h-[60px] p-[20px] pl-[30px] text-lg font-bold text-secondary transition-colors hover:bg-primary hover:text-foreground";

  return (
    <div className="relative">
      <div
        className={`fixed left-0 top-0 h-full w-64 transform overflow-hidden bg-background shadow-2xl transition-transform duration-300 ease-in-out ${
          sideMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          onClick={() => {
            handleMenuTransitions(5);
          }}
          className="flex h-[100px] w-full cursor-pointer items-center justify-start overflow-hidden shadow-md hover:bg-primary hover:text-foreground"
        >
          <img
            className="ml-4 mr-4 h-[60px] w-[60px] rounded-[6px] object-cover"
            src={user?.foto_perfil}
            alt={`${user.username}'s profile picture`}
          />

          <div className="mb-3 ml-1 mr-[20px] mt-3 flex w-[calc(100%-150px)]  flex-col">
            <h2 className="max-w-[100%] overflow-hidden overflow-ellipsis whitespace-nowrap text-[18px] font-bold">
              {user.username}
            </h2>
            <p className="mt-1 max-w-[100%] overflow-hidden overflow-ellipsis whitespace-nowrap text-base">
              {user.correo}
            </p>
          </div>
          <AiOutlineMenu className="mr-[15px] h-[1.5rem] w-[1.5rem]" />
        </div>

        <button
          className="z-10 w-full p-2 hover:bg-primary hover:text-background"
          onClick={() => setSideMenuOpen(false)}
        >
          <AiFillCaretLeft className="ml-auto mr-0 h-[2rem] w-[2rem]" />
        </button>

        <ul className="py-[1vh]">
          <button className={buttStyle} onClick={() => handleLastMsgs()}>
            <AiOutlineComment className="mr-[3vw] h-[25px] w-[25px]" /> Chats
          </button>
          <button className={buttStyle}>
            <AiOutlineBell className="mr-[3vw] h-[25px] w-[25px]" />{" "}
            Notificaciones
          </button>
        </ul>

        <div className="to-105% mx-auto mb-[10px] mt-[5px]  h-[1px] w-[90%] bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent" />

        <ul className="py-[1vh]">{menuElements}</ul>

        <div className="to-105% mx-auto mb-[10px] mt-[5px]  h-[1px] w-[90%] bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent" />

        <button
          className={
            "flex h-[60px] w-full items-center justify-start bg-primary p-[20px] py-[1vh] pl-[30px] text-lg  font-bold text-background transition-colors hover:bg-background hover:text-primary"
          }
          onClick={() =>
            setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
          }
        >
          <AiOutlineBulb className="mr-[3vw] h-[25px] w-[25px]" /> Cambiar tema
        </button>
      </div>
    </div>
  );
};
