import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { UserContext } from "@/utils/userContext";
import { useContext } from "react";
import { clientMutator } from "@/utils/graphqlManager";
import esMessages from "react-big-calendar/lib/localizers/moment";

import Home from "@/components/Home";

function CalendarScreen() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const localizer = momentLocalizer(moment);
  const [agendaData, setAgendaData] = useState([]);

  const GET_EVENTS = gql`
    query buscarEventoUsuario($usuario: ID!) {
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

  const ELIMINAR_EVENTO = gql`
    mutation EliminarEvento($id: ID!) {
      eliminarEvento(id: $id) {
        id
        titulo
        fecha_inicio
        fecha_fin
        creador
        descripcion
        invitados
      }
    }
  `;

  const requestEvento = async ({
    id,
    titulo,
    fecha_inicio,
    fecha_fin,
    descripcion,
    creador,
    invitados,
  }) => {
    const { crearEvento } = await clientMutator(
      `mutation CrearEvento($titulo: String!, $fecha_inicio: Date!, $fecha_fin: Date!, $descripcion: String, $creador: ID!, $invitados: [String]) {
        crearEvento(titulo: $titulo, fecha_inicio: $fecha_inicio, fecha_fin: $fecha_fin, descripcion: $descripcion, creador: $creador, invitados: $invitados) {
          id
          titulo
          fecha_inicio
          fecha_fin
          creador
          descripcion
          invitados
        }
      }`,
      {
        titulo: titulo,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        descripcion: descripcion,
        creador: user.id,
        invitados: invitados.length > 0 ? invitados.split(",") : [],
      }
    )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });

    return crearEvento;
  };

  const requestEditEvento = async ({
    id,
    titulo,
    fecha_inicio,
    fecha_fin,
    descripcion,
    creador,
    invitados,
  }) => {
    const { editarEvento } = await clientMutator(
      `mutation EditarEvento($id: ID!, $titulo: String!, $fecha_inicio: Date!, $fecha_fin: Date!, $descripcion: String, $creador: ID!, $invitados: [String]) {
        editarEvento(id: $id, titulo: $titulo, fecha_inicio: $fecha_inicio, fecha_fin: $fecha_fin, descripcion: $descripcion, creador: $creador, invitados: $invitados) {
          id
          titulo
          fecha_inicio
          fecha_fin
          creador
          descripcion
          invitados
        }
      }`,
      {
        id: id,
        titulo: titulo,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        descripcion: descripcion,
        creador: user.id,
        invitados: invitados.length > 0 ? invitados.split(",") : [],
      }
    )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });

    return editarEvento;
  };

  const { data, loading: loadingEvents } = useQuery(GET_EVENTS, {
    variables: { usuario: user.id },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [eliminarEvento] = useMutation(ELIMINAR_EVENTO);
  const [creatingEvent, setCreatingEvent] = useState(false);

  useEffect(() => {
    if (data && data.buscarEventoUsuario) {
      const formattedEvents = data.buscarEventoUsuario.map((event) => ({
        ...event,
        fecha_inicio: new Date(event.fecha_inicio),
        fecha_fin: new Date(event.fecha_fin),
      }));
      setEvents(formattedEvents);
    }
  }, [data]);

  const handleEliminarEvento = async (eventId) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este evento?"
    );

    if (confirmed) {
      try {
        const { data } = await eliminarEvento({
          variables: { id: eventId },
        });

        console.log("Evento eliminado:", data.eliminarEvento);

        const updatedEvents = events.filter((event) => event.id !== eventId);
        setEvents(updatedEvents);
        setIsModalOpen(false);
      } catch (error) {
        console.log("Error al eliminar el evento", error.message);
      }
    }
  };

  const handleEditEvento = async (e) => {
    e.preventDefault();
    const { titulo, fecha_inicio, fecha_fin, descripcion, invitados } =
      agendaData;
    const formattedFechaInicio = moment(fecha_inicio).toISOString();
    const formattedFechaFin = moment(fecha_fin).toISOString();

    if (moment(fecha_inicio).isAfter(fecha_fin)) {
      alert("La fecha de inicio no puede ser posterior a la fecha de término.");
      return;
    }

    try {
      if (creatingEvent) {
        // Crear nuevo evento
        await requestEvento({
          titulo: titulo,
          fecha_inicio: formattedFechaInicio,
          fecha_fin: formattedFechaFin,
          descripcion: descripcion,
          creador: user.id,
          invitados: invitados.length > 0 ? invitados : [],
        });
      } else {
        // Editar evento existente
        await requestEditEvento({
          id: selectedEvent.id,
          titulo: titulo,
          fecha_inicio: formattedFechaInicio,
          fecha_fin: formattedFechaFin,
          descripcion: descripcion,
          creador: user.id,
          invitados: invitados.length > 0 ? invitados : [],
        });
      }

      console.log("Evento creado o editado correctamente");
      window.location.reload();

      setIsModalOpen(false);
      setCreatingEvent(false);
    } catch (error) {
      console.log("Error al crear o editar el evento", error.message);
    }
  };

  const eventPropGetter = (event, start, end, isSelected) => {
    if (event.tipo === "creador") {
      return { style: { backgroundColor: "#001C30" } };
    } else if (event.tipo === "invitado") {
      return { style: { backgroundColor: "#FF4500" } };
    }
    return {}; 
  };

  const EventAgenda = ({ event }) => (
    <div>
      <strong>{event.titulo}</strong>
      <p>{event.descripcion}</p>
      <p>Invitados: {event.invitados.join(", ")}</p>
      <button onClick={() => handleEliminarEvento(event.id)}>Eliminar</button>
    </div>
  );

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);

    setAgendaData({
      titulo: event.titulo,
      fecha_inicio: moment(event.fecha_inicio).format("YYYY-MM-DDTHH:mm"),
      fecha_fin: moment(event.fecha_fin).format("YYYY-MM-DDTHH:mm"),
      descripcion: event.descripcion,
      invitados: event.invitados.join(", "),
    });

    setIsModalOpen(true);
  };

  const EventCell = ({ event }) => {
    const handleEditClick = () => {
      setSelectedEvent(event);

      setAgendaData({
        titulo: event.titulo,
        fecha_inicio: moment(event.fecha_inicio).format("YYYY-MM-DDTHH:mm"),
        fecha_fin: moment(event.fecha_fin).format("YYYY-MM-DDTHH:mm"),
        descripcion: event.descripcion,
        invitados: event.invitados.join(", "),
      });
      console.log("Tipo del evento:", event.tipo);
      setIsModalOpen(true);
    };

    return (
      <div onClick={handleEditClick}>
        <span>{event.titulo}</span>
      </div>
    );
  };

  const handleSelectSlot = ({ start, end }) => {
    setAgendaData({
      titulo: "",
      fecha_inicio: moment(start).format("YYYY-MM-DDTHH:mm"),
      fecha_fin: moment(end).format("YYYY-MM-DDTHH:mm"),
      descripcion: "",
      invitados: "",
    });
    setCreatingEvent(true);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgendaData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const currentDate = new Date();
  const currentMonth = localizer.format(currentDate, "MMMM", "es");
  const currentYear = localizer.format(currentDate, "YYYY");

  const dayPropGetter = (date) => {
    const currentDate = new Date();
    const isSameDay = moment(date).isSame(currentDate, "day");

    if (isSameDay) {
      return {
        style: {
          backgroundColor: "#fc5a8d",
        },
      };
    }
    return {};
  };

  return (
    <>
      <div className="z-10 mt-[80px]  w-[100vw] max-w-[100vw] text-current lg:w-[55vw] lg:max-w-[90vw] lg:px-10">
        <div className="m-4 flex-col items-center  justify-between text-[5vw] font-bold sm:text-[18px] ">
          <div className="flex w-full flex-col items-center justify-center  rounded-md bg-foreground text-center">
            <style>
              {`
              .rbc-month-header {
                font-size: 20px;
              }
              .form-group label {
                margin-right: 10px;
              }              
              @media screen and (max-width: 1340px) {
                .rbc-toolbar {
                  flex-direction: column; /* Cambiar la dirección del flex para apilar los elementos verticalmente */
                  align-items: center; /* Centrar elementos horizontalmente */
                }
              
                .rbc-btn-group {
                  margin-top: 10px; /* Agregar espacio entre los botones y el rbc-toolbar-label */
                }

                .rbc-calendar-wrapper .rbc-calendar {
                  width: 100%;
                }

                  .rbc-month-header {
                    font-size: 18px;
                  }
              
                  .form-group label {
                    margin-right: 5px;
                  }

              }
            `}
            </style>
            <Calendar
              localizer={localizer}
              dayPropGetter={dayPropGetter}
              messages={{
                today: "Hoy",
                previous: "Anterior",
                next: "Siguiente",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Evento",
                allDay: "Todo el día",
                showMore: (total) => `+ Ver más (${total})`,
              }}
              events={events}
              eventPropGetter={eventPropGetter}
              startAccessor="fecha_inicio"
              endAccessor="fecha_fin"
              style={{
                height: 600,
                width: "100%",
              }}
              selectable={true}
              onSelecting={(event) => false}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              views={["month", Views.DAY, Views.WEEK, "agenda"]}
              components={{
                agenda: {
                  event: (props) => <EventAgenda {...props} />,
                },
                event: EventCell,
                month: {
                  event: EventCell,
                },
                day: {
                  event: EventCell,
                },
              }}
            />
            <Modal
              open={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setCreatingEvent(false);
              }}
              styles={{
                modal: {
                  borderRadius: "8px",
                  padding: "20px",
                  backgroundColor: "var(--color-foreground)",
                },
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <form
                onSubmit={handleEditEvento}
                className="flex-col items-center justify-center bg-foreground text-[5vw] sm:text-[18px]"
                style={{
                  margin: 0,
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <h2 className="modal-label">
                  {creatingEvent ? "Nuevo Evento" : "Editar Evento"}{" "}
                </h2>
                <div className="form-group">
                  <label htmlFor="titulo" className="modal-label">
                    Título
                  </label>
                  <br />
                  <input
                    type="text"
                    name="titulo"
                    value={agendaData.titulo}
                    onChange={handleChange}
                    id="titulo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_inicio" className="modal-label">
                    Fecha de inicio
                  </label>
                  <br />
                  <input
                    type="datetime-local"
                    name="fecha_inicio"
                    value={agendaData.fecha_inicio}
                    onChange={handleChange}
                    id="fecha_inicio"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_fin" className="modal-label">
                    Fecha de fin
                  </label>
                  <br />
                  <input
                    type="datetime-local"
                    name="fecha_fin"
                    value={agendaData.fecha_fin}
                    onChange={handleChange}
                    id="fecha_fin"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="descripcion" className="modal-label">
                    Descripción
                  </label>
                  <br />
                  <textarea
                    name="descripcion"
                    value={agendaData.descripcion}
                    onChange={handleChange}
                    id="descripcion"
                    rows={4}
                    style={{
                      resize: "vertical",
                      padding: "5px",
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="invitados" className="modal-label">
                    Invitados
                  </label>
                  <br />
                  <textarea
                    name="invitados"
                    value={agendaData.invitados}
                    onChange={handleChange}
                    id="invitados"
                    disabled={!creatingEvent}
                    rows={4}
                    style={{
                      resize: "vertical",
                      padding: "5px",
                    }}
                  />
                </div>
                <div className="form-group" style={{ textAlign: "center" }}>
                  <button
                    type="submit"
                    style={{
                      fontSize: "1.5rem",
                      padding: "10px 20px",
                      backgroundColor: "var(--color-primary)",
                      color: "white",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {creatingEvent ? "Crear" : "Editar"}
                  </button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

CalendarScreen.getLayout = function getLayout(page, screenWidth) {
  return <Home screenWidth={screenWidth}>{page}</Home>;
};

export default CalendarScreen;
