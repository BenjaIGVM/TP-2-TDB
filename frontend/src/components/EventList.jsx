import React, { useContext, useEffect, useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { UserContext } from "@/utils/userContext";
import { gql, useQuery } from "@apollo/client";
import { format, isAfter } from "date-fns"; // Importa la función format y isAfter de date-fns

export default function Calendario() {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);

  // Define la consulta GraphQL
  const BUSCAR_EVENTO_USUARIOID = gql`
    query BuscarEventoUsuario($usuario: ID!) {
      buscarEventoUsuario(creador: $usuario) {
        id
        titulo
        fecha_inicio
        fecha_fin
        descripcion
        creador
        invitados
        tipo
      }
    }
  `;

  // Ejecuta la consulta GraphQL cuando el componente se monta
  const { data, loading: loadingEvents } = useQuery(BUSCAR_EVENTO_USUARIOID, {
    variables: { usuario: user.id },
  });

  useEffect(() => {
    if (data) {
      const eventosHoyYPosteriores = data.buscarEventoUsuario.filter((evento) => {
        // Filtra los eventos que ocurren desde hoy en adelante utilizando isAfter de date-fns
        const fechaInicio = new Date(evento.fecha_inicio);
        return isAfter(fechaInicio, new Date());
      });

      const eventosOrdenados = eventosHoyYPosteriores.slice().sort((a, b) => {
        // Ordena los eventos según la fecha de inicio ascendente
        const fechaInicioA = new Date(a.fecha_inicio);
        const fechaInicioB = new Date(b.fecha_inicio);
        return fechaInicioA - fechaInicioB;
      });

      // Limita la lista a solo las primeras 5 entradas
      const primerosCincoEventos = eventosOrdenados.slice(0, 5);

      setEventos(primerosCincoEventos);
    }
  }, [data]);

  // Procesa los datos del horario y muestra la lista
  const eventList = eventos.map((event) => {
    // Convierte la fecha de inicio a un objeto de fecha
    const fechaInicio = new Date(event.fecha_inicio);

    // Formatea la fecha en formato "dd/mm"
    const fechaInicioFormateada = format(fechaInicio, "dd/MM");

    return (
      <li
        key={event.id}
        className="flex flex-row border-b snap-start border-background border-dotted p-2 hover:bg-primary hover:text-background"
      >
        {/* Detalles del horario */}
        <div className="flex relative mt-[5px]">
          <AiOutlineCalendar className="text-8xl text-secondary" />
          <h1 className="absolute text-secondary text-[18px] text-center w-[55px] left-[20px] bottom-6 font-bold">
            {fechaInicioFormateada}
          </h1>
        </div>

        {/* Detalles del evento */}
        <div className="flex flex-col ml-4">
          <h1 className="text-secondary text-xl font-bold">{event.titulo}</h1>
          <h1 className="text-secondary text-lg">{event.descripcion}</h1>
        </div>
      </li>
    );
  });

  return (
    <>
      {/* Contenedor */}
      <div className="mb-2 w-[100%]">
        {/* Título */}
        <h2 className="flex font-bold justify-self-center mr-auto ml-[10px] mb-[10px] text-secondary opacity-80 ">
          {" "}
          EVENTOS{" "}
        </h2>
        {/* Lista de horarios */}
        <ul className="list-container flex flex-col snap-y max-h-64 overflow-hidden overflow-y-scroll rounded-md bg-foreground">
          {eventList}
        </ul>
      </div>
    </>
  );
}