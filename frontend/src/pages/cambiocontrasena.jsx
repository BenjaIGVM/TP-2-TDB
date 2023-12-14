import React, { useState, useEffect } from "react";
import Head from "next/head";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

const CambioContrasena = ({ screenWidth }) => {
  const [updateFailedMessage, setUpdateFailedMessage] = useState("");
  const { resolvedTheme, setTheme } = useTheme();
  const [correo, setCorreo] = useState("");
  const [temporalKey, setTemporalKey] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [correoError, setCorreoError] = useState("");
  const router = useRouter();
  const ACTUALIZAR_CONTRASENA = gql`
    mutation ActualizarContrasena(
      $correo: String!
      $temporalKey: String!
      $nuevaClave: String!
    ) {
      actualizarContrasena(
        correo: $correo
        temporalKey: $temporalKey
        nuevaClave: $nuevaClave
      )
    }
  `;
  const [actualizarContrasena] = useMutation(ACTUALIZAR_CONTRASENA);
  const GET_CORREOS_REGISTRADOS = gql`
  query {
    all_usuarios {
      correo
    }
  }
  `;
  const { data: correosRegistradosData } = useQuery(GET_CORREOS_REGISTRADOS);
  const correosRegistrados = correosRegistradosData ? correosRegistradosData.all_usuarios.map(user => user.correo) : [];


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correosRegistrados.includes(correo)) {
      setCorreoError("El correo no está registrado.");
      return false;
    }
    if (nuevaClave.length < 8) {
      setErrorMessage("La nueva contraseña debe tener al menos 8 caracteres");
      console.error("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!/[A-Z]/.test(nuevaClave)) {
      setErrorMessage("La nueva contraseña debe contener al menos una letra mayúscula");
      console.error("La nueva contraseña debe contener al menos una letra mayúscula");
      return;
    }

    try {
      const { data } = await actualizarContrasena({
        variables: {
          correo,
          temporalKey,
          nuevaClave
        }
      });

      if (data.actualizarContrasena) {
        setSuccessMessage("¡La contraseña se ha actualizado con éxito!");
      }
    } catch (error) {
      setUpdateFailedMessage("No se pudo actualizar la contraseña. Verifica la clave temporal.");

    }
  };
  useEffect(() => {
    if (updateFailedMessage) {
      const timer = setTimeout(() => {
        setUpdateFailedMessage(false);
      }, 5000); 

      return () => clearTimeout(timer);
    }
  }, [updateFailedMessage]);
  useEffect(() => {
    if (updateFailedMessage) {
      const timer = setTimeout(() => {
        setUpdateFailedMessage(false);
      }, 5000); 

      return () => clearTimeout(timer);
    }
  }, [updateFailedMessage]);
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(false);
      }, 5000); 

      return () => clearTimeout(timer);
    }
  }, [updateFailedMessage]);
  useEffect(() => {
    if (correoError) {
      const timer = setTimeout(() => {
        setCorreoError(false);
      }, 5000); 

      return () => clearTimeout(timer);
    }
  }, [correoError]);


  if (screenWidth == 0) {
    return null;
  }

  return (
    <>
      <div
        className={`z-1 fixed bottom-0 left-0 right-0 top-0 ${resolvedTheme === "light" ? "" : " opacity-70 "} bg-background bg-cover bg-fixed`}
      ></div>

      <Head>
        <title>Cambio de Contraseña</title>
      </Head>
      <main>
        <div className="h-screen w-screen">
          <form
            onSubmit={handleSubmit}
            className="flex h-full w-full flex-row items-center justify-center "
          >
            {screenWidth > 767 && (
              <div className="z-10 flex h-[80%]  w-[45%] flex-col items-center justify-center rounded-l-[10px] bg-foreground p-4 text-[10px] text-primary shadow-2xl">
                <div
                  className="box-border w-[98%] min-w-[98%] max-w-[98%] overflow-hidden rounded-[10px]"
                  style={{ maxHeight: `90%` }}
                >
                  <img
                    className="mt-[-10%] min-w-full rounded-[10px] object-cover "
                    style={{ minHeight: "80vh" }}
                    src="/MainSplash.png"
                  />
                </div>
                <div className="absolute bottom-[20vh]">
                  {" "}
                  Red social creada para la Universidad del Bio-Bio
                </div>
              </div>
            )}

            <div
              className="z-10 flex h-[80%] w-[80%] flex-col rounded-l-[10px] rounded-r-[10px] bg-foreground p-[2vw] pl-[12vw] shadow-2xl md:w-[40%] md:rounded-l-[0] md:pl-[5vw]"
            >
              <h1 className="my-6  mt-[5vh] text-4xl font-semibold text-primary ">
                Cambio de Contraseña
              </h1>



              <div >
                <div>
                <input
                    type="email"
                    className="my-2 w-5/6 max-w-[400px] rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                    placeholder="correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)} required
                  />
                </div>
                {correoError && <div className="text-red-500">{correoError}</div>}

              </div>

              <div>
              <input
                    type="text"
                    className="my-2 w-5/6 max-w-[400px] rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                    placeholder="Clave temporal"
                    id="temporalKey"
                    value={temporalKey}
                    onChange={(e) => setTemporalKey(e.target.value)}
                    required
                  />
              </div>
              <div>
              <input
                    type="password"
                    className="my-2 w-5/6 max-w-[400px] rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                    placeholder="Nueva contraseña"
                    id="nuevaClave"
                    value={nuevaClave}
                    onChange={(e) => setNuevaClave(e.target.value)}
                    required
                  />
                
              </div>
              {errorMessage && <div className="text-red-500">{errorMessage}</div>}
              <button
                type="submit"
                className=" my-2 w-5/6 max-w-[400px] rounded-[10px] ] bg-accent p-3  font-semibold hover:bg-primary hover:text-background active:bg-background active:text-primary"
              >
                Cambiar Contraseña
              </button>
              {successMessage && (
                <p className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md mb-4">
                  {successMessage}
                </p>
              )}

              {updateFailedMessage && (
                <p className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md mb-4">
                  {updateFailedMessage}
                </p>
              )}
              <p>
                ¿Lograste actualizar la contraseña?{" "}
                <a href="/login">Inicia sesión</a>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CambioContrasena;