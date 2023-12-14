import { useState, useContext, useEffect  } from "react";
import Head from "next/head";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import { useTheme } from "next-themes";

import { UserContext } from "../utils/userContext";

export default function ForgotPassword({ screenWidth }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [correo, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [correoError, setCorreoError] = useState("");
  const router = useRouter();
  const FORGOT_PASSWORD = gql`
    mutation {
      forgotPassword(correo: "${correo}") {
        success
      }
    }
  `;
  const GET_CORREOS_REGISTRADOS = gql`
    query {
      all_usuarios {
        correo
      }
    }
  `;
  const { data: correosRegistradosData } = useQuery(GET_CORREOS_REGISTRADOS);
  const correosRegistrados = correosRegistradosData
    ? correosRegistradosData.all_usuarios.map((user) => user.correo)
    : [];

  const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\d{4}@alumnos\.ubiobio\.cl$/i;
  const [forgotPassword, { error }] = useMutation(FORGOT_PASSWORD);
  const validateForm = () => {
    if (!correosRegistrados.includes(correo)) {
      setCorreoError("El correo no está registrado.");
      return false;
    } else {
      if (!emailRegex.test(correo)) {
        setCorreoError(
          "Correo no valido, el correo debe pertenecer a la institucion"
        );
        return false;
      }
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    forgotPassword({ variables: { correo } })
      .then((response) => {
        setSuccessMessage("Se ha enviado una clave temporal a tu correo.");
      })
      .catch((error) => {
        setCorreoError("El correo ya está registrado");
        console.log(error);
      });
  };
  useEffect(() => {
    if (correoError) {
      const timeoutId = setTimeout(() => {
        setCorreoError(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
    
  }, [correoError]);
  const handleLogin = () => {
    router.push("/Login");
  };

  if (screenWidth == 0) {
    return null;
  }

  return (
    <>
      <div
        className={`z-1 fixed bottom-0 left-0 right-0 top-0 ${
          resolvedTheme === "light" ? "" : " opacity-70 "
        } 
            bg-background bg-cover bg-fixed`}
      ></div>

      {/* bg */}
      <Head>
        <title>Recuperar Contraseña</title>
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
              className="z-10 flex h-[80%] w-[80%] flex-col rounded-l-[10px] rounded-r-[10px] bg-foreground p-[2vw] pl-[12vw] 
        shadow-2xl md:w-[40%] md:rounded-l-[0] md:pl-[5vw]"
            >
              <h1 className="mt-[5vh] text-4xl font-semibold text-primary ">
                Recuperar Contraseña
              </h1>

              {successMessage ? (
                <p>{successMessage}</p>
              ) : (
                <>
                  <div className="mt-[10vh] flex flex-col">
                    <input
                      type="correo"
                      className="my-2 w-5/6 max-w-[400px] rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                      placeholder="correo"
                      value={correo}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {correoError && (
                    <div className="text-red-500">{correoError}</div>
                  )}
                  <div className="flex w-full flex-col gap-2  lg:flex-row lg:justify-between">
                    <button
                      type="submit"
                      className=" my-2 mt-[10vh] w-5/6  max-w-[400px]  rounded-[10px] bg-accent p-3  font-semibold hover:bg-primary hover:text-background active:bg-background active:text-primary"
                    >
                      Recuperar Contraseña
                    </button>
                  </div>
                </>
              )}
              <p>
                ¿Ya recibiste la contraseña temporal?{" "}
                <a href="/cambiocontrasena">Cambia la contraseña</a>
              </p>
              <p>
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
