import { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import styles from "@/styles/Home.module.css";
import { useMutation } from "@apollo/client";
import { clientMutator } from "@/utils/graphqlManager";
import {
  AiFillCloseCircle,
  AiFillDelete,
  GrFormAdd,
  AiFillPlusCircle,
} from "react-icons/ai";
import Home from "@/components/Home";
import { useContext } from "react";
import { UserContext } from "@/utils/userContext";

const Notas = () => {
  const { user } = useContext(UserContext);

  const userId = user.id;

  const [asignaturas, setAsignaturas] = useState([]);

  useEffect(() => {
    const storedAsignaturas = JSON.parse(
      localStorage.getItem(`asignaturas_${userId}`)
    );

    if (storedAsignaturas) {
      setAsignaturas(storedAsignaturas);
    } else {
      // Agregar una asignatura inicial vacía si no hay datos en el Local Storage
      setAsignaturas([{ nombre: "", notas: ["", "", ""], porcentajes: [] }]);
    }
  }, [userId]);

  const guardarAsignaturasEnLocalStorage = (asignaturasData) => {
    localStorage.setItem(
      `asignaturas_${userId}`,
      JSON.stringify(asignaturasData)
    );
  };

  const agregarAsignatura = () => {
    const newAsignaturas = [
      ...asignaturas,
      { nombre: "", notas: [], porcentajes: [] },
    ];
    setAsignaturas(newAsignaturas);

    guardarAsignaturasEnLocalStorage(newAsignaturas);
  };

  const eliminarAsignatura = (index) => {
    const newAsignaturas = [...asignaturas];
    newAsignaturas.splice(index, 1);
    setAsignaturas(newAsignaturas);

    guardarAsignaturasEnLocalStorage(newAsignaturas);
  };

  const handleAsignaturaChange = (e, index) => {
    const newAsignaturas = [...asignaturas];
    newAsignaturas[index].nombre = e.target.value;
    setAsignaturas(newAsignaturas);

    guardarAsignaturasEnLocalStorage(newAsignaturas);
  };

  const handleNotasChange = (e, asignaturaIndex, notaIndex) => {
    const newAsignaturas = [...asignaturas];
    newAsignaturas[asignaturaIndex].notas[notaIndex] = Number(e.target.value);
    setAsignaturas(newAsignaturas);

    guardarAsignaturasEnLocalStorage(newAsignaturas);
  };

  const handlePorcentajesChange = (e, asignaturaIndex, porcentajeIndex) => {
    const newAsignaturas = [...asignaturas];
    newAsignaturas[asignaturaIndex].porcentajes[porcentajeIndex] = Number(
      e.target.value
    );
    setAsignaturas(newAsignaturas);

    guardarAsignaturasEnLocalStorage(newAsignaturas);
  };

  const agregarNota = (asignaturaIndex) => {
    const newAsignaturas = [...asignaturas];
    newAsignaturas[asignaturaIndex].notas.push(0);
    newAsignaturas[asignaturaIndex].porcentajes.push(0);
    setAsignaturas(newAsignaturas);

    guardarAsignaturasEnLocalStorage(newAsignaturas);
  };

  const calcularPromedioAsignatura = (notas, porcentajes) => {
    const totalNotas = notas.reduce(
      (acc, nota, index) => acc + nota * porcentajes[index],
      0
    );
    const totalPorcentajes = porcentajes.reduce(
      (acc, porcentaje) => acc + porcentaje,
      0
    );
    return totalNotas / totalPorcentajes;
  };

  const eliminarNota = (asignaturaIndex, notaIndex) => {
    const newAsignaturas = [...asignaturas];
    newAsignaturas[asignaturaIndex].notas.splice(notaIndex, 1);
    newAsignaturas[asignaturaIndex].porcentajes.splice(notaIndex, 1);
    setAsignaturas(newAsignaturas);

    // Guardar las asignaturas actualizadas en el Local Storage al eliminar una nota
    guardarAsignaturasEnLocalStorage(newAsignaturas);
  };

  return (
    <>
      <div className="z-10 mt-[80px] w-[100vw] max-w-[100vw] text-current lg:w-[55vw] lg:max-w-[90vw] lg:px-10  ">
        <div className="m-4 mt-4 flex-col items-center justify-between rounded-lg bg-foreground text-[5vw] font-bold sm:text-[18px] ">
          <h1 className="text-center text-2xl">Notas</h1>
          <div className="flex items-center justify-center py-2">
            <div className="items-center justify-center text-sm">
              <span className="">Ejemplo:</span>
              <span className="ml-1 "></span>
              <input
                type="text"
                pattern="[0-9]*"
                maxLength="2"
                value="65"
                className="w-14 rounded-md border border-gray-300 px-2 py-1 "
                readOnly
              />
              <span className=""> </span>
              <input
                type="text"
                pattern="[0-9]*"
                maxLength="2"
                value="25"
                className="w-14 rounded-md border border-gray-300 px-2 py-1"
                readOnly
              />
              <span className="ml-1 ">%</span>
            </div>
          </div>
          <div className="rounded-[20px] bg-foreground ">
            <div className="flex flex-col items-center justify-center p-4">
              {asignaturas.map((asignatura, asignaturaIndex) => (
                <div key={asignaturaIndex} className="m-2">
                  <div className="flex items-center justify-center  p-2">
                    <input
                      type="text"
                      value={asignatura.nombre || ""}
                      onChange={(e) =>
                        handleAsignaturaChange(e, asignaturaIndex)
                      }
                      placeholder="Nombre de la Asignatura"
                      className="w-4/4  rounded-md border border-gray-300 py-1"
                      maxLength="32"
                    />
                  </div>
                  {asignatura.notas.map((nota, notaIndex) => (
                    <div
                      key={notaIndex}
                      className="mb-2 flex items-center justify-center space-x-2"
                    >
                      <h1>Nota{notaIndex + 1} </h1>
                      <input
                        type="text"
                        pattern="[0-9]*"
                        maxLength="2"
                        className="w-16 rounded-md border border-gray-300 px-2 py-1"
                        value={nota || ""}
                        onChange={(e) =>
                          handleNotasChange(e, asignaturaIndex, notaIndex)
                        }
                        placeholder="Nota"
                      />
                      <input
                        pattern="[0-9]*"
                        maxLength="2"
                        className="w-16 rounded-md border border-gray-300 px-2 py-1"
                        type="text"
                        value={asignatura.porcentajes[notaIndex] || ""}
                        onChange={(e) =>
                          handlePorcentajesChange(e, asignaturaIndex, notaIndex)
                        }
                        placeholder="%"
                      />
                      <span className="ml-2">%</span>
                      <button
                        className="ml-2 font-bold text-red-500"
                        onClick={() => eliminarNota(asignaturaIndex, notaIndex)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <div className="flex flex-col items-center justify-center">
                    {asignatura.notas.length > 0 && (
                      <p className="">
                        Promedio:{" "}
                        {calcularPromedioAsignatura(
                          asignatura.notas,
                          asignatura.porcentajes
                        ).toFixed(1)}
                      </p>
                    )}
                    <div className="flex gap-4">
                      <AiFillPlusCircle
                        onClick={() => agregarNota(asignaturaIndex)}
                      ></AiFillPlusCircle>
                      <AiFillDelete
                        onClick={() => eliminarAsignatura(asignaturaIndex)}
                      >
                        Borrar Asignatura
                      </AiFillDelete>
                    </div>
                    {/*
                                        <button onClick={() => calcularPromedioAsignatura(asignatura.notas, asignatura.porcentajes)}>
                                            Calcular Promedio
                                        </button>
                                         */}
                    <hr />
                  </div>
                </div>
              ))}
              <button
                className="m-2 flex  rounded-lg p-4 hover:bg-background"
                onClick={agregarAsignatura}
              >
                Agregar Asignatura
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Notas.getLayout = function getLayout(page, screenWidth) {
  return <Home screenWidth={screenWidth}>{page}</Home>;
};

export default Notas;
