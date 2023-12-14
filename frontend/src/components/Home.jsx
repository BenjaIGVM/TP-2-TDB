import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineCalendar,
  AiOutlineApartment,
  AiOutlineMenu,
  AiOutlineBook,
  AiOutlineRead,
  AiOutlineSchedule,
  AiOutlineWarning,
} from "react-icons/ai";

import { useRouter } from "next/router";
import React, { useState, useEffect, useContext, use } from "react";
import { UserContext } from "../utils/userContext";
import { gql, useLazyQuery } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { useVerifyAdmin } from "../utils/validationUtils";

import Header from "./Header";
import Chat from "../components/Chat";
import FriendsList from "../components/FriendList";
import EventList from "./EventList";

export default function Home({ screenWidth, children }) {
  const router = useRouter();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  const [actPage, setActPage] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const { userInfo, user, chats } = useContext(UserContext);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!user) {
      userInfo().then((info) => {
        // console.log("Usuario Conectado", info);
        // setUserId(info.id);
      });
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname != "/Feed" && actPage == 0) {
      setActPage(-1);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isHeaderVisible =
        prevScrollPos > currentScrollPos || currentScrollPos < 20;

      setPrevScrollPos(currentScrollPos);
      setHeaderVisible(isHeaderVisible);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const handleMenuTransitions = (idx) => {
    if (idx === actPage || isNavigating) {
      return;
    }

    setIsNavigating(true);
    setActPage(idx);
  };

  useEffect(() => {
    let navigationTimeout = null;

    if (isNavigating) {
      document.title = "Cargando..."; // Set the title to show the spinner

      navigationTimeout = setTimeout(() => {
        let href = actPage == 0 ? "/Feed" : "/Friends";
        switch (actPage) {
          case 0:
            href = "/Feed";
            break;
          case 1:
            href = "/Friends";
            break;
          case 2:
            href = "/Events";
            break;
          case 3:
            href = "/GroupPage";
            break;
          case 4:
            href = "/Notas";
            break;
          case 5:
            href = "/EditarUsuario";
            break;
          case 6:
            href = "/Calendar";
            break;
          case 7:
            href = "/CheckReportes";
            break;
          default:
            href = "/Feed";
            break;
        }
        router.push(href);
      }, 200);
    } else {
      document.title = "uChat - Home"; // Restore the original title
    }

    return () => {
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
        setIsNavigating(false);
      }
    };
  }, [isNavigating, actPage, router]);

  return (
    <>
      {user && (
        <div className="flex items-start justify-center ">
          {/* Seccion Izquierda */}
          {screenWidth >= 1024 && (
            <>
              <div
                className={`z-2 fixed left-8 flex w-[20vw] flex-col items-center ${
                  headerVisible
                    ? "translate-y-[90px] transform transition-transform duration-100 ease-in-out"
                    : "translate-y-[30px] transform transition-transform duration-100 ease-in-out"
                }`}
              >
                {/* Boton Perfil */}
                <div
                  onClick={() => handleMenuTransitions(5)}
                  className="flex h-[100px] w-full cursor-pointer items-center justify-start overflow-hidden rounded-[10px] bg-foreground shadow-md hover:bg-primary hover:text-foreground"
                >
                  <img
                    className="ml-4 mr-4 h-[60px] w-[60px] rounded-[6px] object-cover"
                    src={user.foto_perfil}
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

                {/* Menu isquierdo */}
                <div className="mt-[30px] flex w-full flex-col overflow-hidden rounded-lg bg-foreground shadow-md">
                  {homeMenuElements({
                    actPage,
                    handleMenuTransitions,
                    userId,
                  })}
                </div>
              </div>
              <div
                className={`mod-scroll z-2 fixed right-8 flex w-[20vw] flex-col items-center  overflow-y-auto 
                            ${
                              headerVisible
                                ? "translate-y-[90px] transform transition-transform duration-100 ease-in-out"
                                : "translate-y-[30px] transform transition-transform duration-100 ease-in-out"
                            }`}
                style={{ maxHeight: "99vh" }}
              >
                {/*Seccion derecha*/
                /* AKI VA MI COMPONENTE*/}

                <EventList />
                <HorarioList />
                <FriendsList friends={user.amigos} hide={actPage === 1} />
              </div>
            </>
          )}

          {/* Chats */}
          <div className="pointer-events-none fixed bottom-0 right-0 z-20 flex items-end">
            {chats
              .filter((x) => x.active)
              .map((chat) => (
                <Chat key={chat.id} chatInfo={chat} user={user} />
              ))}
          </div>
          <Header
            headerVisible={headerVisible}
            screenWidth={screenWidth}
            user={user}
            menuElements={homeMenuElements({
              actPage,
              handleMenuTransitions,
              userId,
            })}
          />

          <div className="overflow-hidden ">
            <div
              className={`absolute left-0 right-0 z-[-1] flex items-start justify-center ${
                isNavigating ? "animate-verticalOut" : "animate-verticalIn"
              }`}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const homeMenuElements = ({ actPage, handleMenuTransitions, userId }) => {
  const buttStyle =
    "flex justify-start items-center w-full h-[60px] p-[20px] pl-[30px] text-lg font-bold text-secondary transition-colors border-b border-background hover:bg-primary hover:text-foreground";

  const actButtonStyle = (idx) => {
    if (idx == actPage) {
      return {
        style: {
          color: "var(--text-color)",
          borderLeft: "4px solid var(--text-color)",
        },
        onMouseEnter: (e) => {
          e.target.style.color = "var(--accent-color)";
        },
        onMouseLeave: (e) => {
          e.target.style.color = "var(--text-color)";
        },
      };
    } else {
      return {};
    }
  };

  return (
    <>
      <button
        className={buttStyle}
        {...actButtonStyle(0)}
        onClick={() => handleMenuTransitions(0)}
      >
        <AiOutlineHome className="mr-[3vw] h-[25px] w-[25px]" /> Feed{" "}
      </button>

      <button
        className={buttStyle}
        {...actButtonStyle(1)}
        onClick={() => handleMenuTransitions(1)}
      >
        <AiOutlineUser className="mr-[3vw] h-[25px] w-[25px]" /> Amigos{" "}
      </button>

      <button
        className={buttStyle}
        {...actButtonStyle(3)}
        onClick={() => handleMenuTransitions(3)}
      >
        <AiOutlineApartment className="mr-[3vw] h-[25px] w-[25px]" />{" "}
        Comunidades{" "}
      </button>

      <button
        className={buttStyle}
        {...actButtonStyle(2)}
        onClick={() => handleMenuTransitions(2)}
      >
        <AiOutlineCalendar className="mr-[3vw] h-[25px] w-[25px]" /> Horario{" "}
      </button>

      <button
        className={buttStyle}
        {...actButtonStyle(4)}
        onClick={() => handleMenuTransitions(4)}
      >
        <AiOutlineRead className="mr-[3vw] h-[25px] w-[25px]" /> Notas{" "}
      </button>

      <button
        className={buttStyle}
        {...actButtonStyle(6)}
        onClick={() => handleMenuTransitions(6)}
      >
        <AiOutlineSchedule className="mr-[3vw] h-[25px] w-[25px]" /> Calendario{" "}
      </button>

      <button
        className={buttStyle}
        {...actButtonStyle(7)}
        onClick={() => handleMenuTransitions(7)}
      >
        <AiOutlineWarning className="mr-[3vw] h-[25px] w-[25px]" /> Reportes
      </button>
    </>
  );
};

const HorarioList = () => {
  const { user } = useContext(UserContext);
  const [horario, setHorario] = useState([]);

  const BUSCAR_HORARIO_USUARIOID = gql`
    query BuscarHorarioUsuario($usuario: ID!) {
      buscarHorarioUsuario(usuario: $usuario) {
        id
        dia
        hora_inicio
        hora_termino
        asignatura
        sala
        acronimo
      }
    }
  `;

  const [buscarHorarioUsuario, { loading, data }] = useLazyQuery(
    BUSCAR_HORARIO_USUARIOID,
    {
      variables: { usuario: user.id },
      onCompleted: (data) => {
        setHorario(data.buscarHorarioUsuario);
      },
    }
  );

  useEffect(() => {
    buscarHorarioUsuario();
  }, []);

  const formatHour = (time) => {
    const formattedTime = new Date(time);
    return formattedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const removeTildes = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const today = new Date().toLocaleDateString("es-ES", { weekday: "long" });
  const todayWithoutTildes = removeTildes(today);

  const eventList = horario.map((event) => {
    const eventDia = event.dia.toLowerCase();
    const eventDiaWithoutTildes = removeTildes(eventDia);
    if (eventDiaWithoutTildes === todayWithoutTildes.toLowerCase()) {
      return (
        <li
          key={event.id}
          className="flex snap-start flex-row border-b border-dotted border-background p-2 hover:bg-primary hover:text-background"
        >
          <div className="relative mt-[5px] flex">
            <AiOutlineBook className="text-8xl text-secondary" />
            <h1 className="absolute bottom-6 left-[20px] w-[55px] text-center text-[11px] font-bold text-secondary">
              {event.dia}
            </h1>
          </div>
          <div className="m-2 h-[85px] max-w-[60%] grow flex-col flex-wrap overflow-hidden text-ellipsis">
            <h1 className="text-xl font-bold">{event.asignatura}</h1>
            <h1 className="line-clamp-3 w-[100%] max-w-[100%] text-justify text-sm ">
              {event.sala}
            </h1>
            <h1 className="line-clamp-3 w-[100%] max-w-[100%] text-justify text-sm ">
              {event.acronimo}
            </h1>
            <h1 className="line-clamp-3 w-[100%] max-w-[100%] text-justify text-sm ">
              {formatHour(event.hora_inicio)} - {formatHour(event.hora_termino)}
            </h1>
          </div>
        </li>
      );
    } else {
      return null;
    }
  });

  const hasClasses = eventList.some((event) => event !== null);

  return (
    <>
      <div className="mb-2 w-[100%]">
        <h2 className="mb-[10px] ml-[10px] mr-auto flex justify-self-center font-bold text-secondary opacity-80 ">
          {" "}
          HORARIOS{" "}
        </h2>
        <ul className="list-container flex max-h-64 snap-y flex-col overflow-hidden overflow-y-scroll rounded-md bg-foreground">
          {hasClasses ? (
            eventList
          ) : (
            <p className=" flex  h-64 items-center justify-center font-bold">
              ¡Hoy no tienes clases!
            </p>
          )}
        </ul>
      </div>
    </>
  );
};
