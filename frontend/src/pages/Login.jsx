import Head from "next/head";
import { useTheme } from "next-themes";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../utils/userContext";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import Cookies from "js-cookie";

export default function Login({ screenWidth }) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const { userInfo } = useContext(UserContext);
  const [loginFallido, setLoginFallido] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const GET_TOKEN = gql`
    mutation Login($correo: String!, $contrasena: String!) {
      login(correo: $correo, contrasena: $contrasena) {
        value
      }
    }
  `;
  const [loginMutation, { error }] = useMutation(GET_TOKEN);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await loginMutation({
        variables: {
          correo: email,
          contrasena: password,
        },
      });

      const token = data.login.value;
      Cookies.set("user", token, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });
      await userInfo().then((user) => {
        console.log("userInfo", user);
      });
      window.location.reload();
    } catch (error) {
      setLoginFallido(true);

      console.log(error);
    }
  };

  const handleForgotPassword = () => {
    router.push("/recuperarcontrasena");
  };

  const handleCreateAccount = () => {
    router.push("/crearusuario");
  };
  if (screenWidth == 0) {
    return;
  }

  return (
    <>
      <div
        className={`z-1 fixed bottom-0 left-0 right-0 top-0 ${
          resolvedTheme === "light" ? "" : " opacity-70 "
        }
                bg-background bg-cover bg-fixed`}
      ></div>
      <Head>
        <title>Login</title>
      </Head>
      <main>
        <div className="h-screen w-screen">
          <form
            onSubmit={handleLogin}
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
              <h1 className="mt-[5vh] text-4xl font-semibold text-primary  items-center ">
                Iniciar Sesión
              </h1>
              <div className="mt-[10vh] flex flex-col">
                <h1 className="mt-[5px] text-lg font-semibold  text-primary ">
                Inicia sesión para continuar
              </h1>
                <input
                  type="email"
                  className="my-2 w-5/6 max-w-[400px] rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                  placeholder="correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="my-2 mt-[5vh] w-5/6 max-w-[400px] rounded-[10px] bg-background  p-2 placeholder-secondary outline-none focus:outline-secondary"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {loginFallido && (
                  <div className="mt-4 font-semibold text-red-500">
                    ¡Correo o contraseña incorrecta!
                  </div>
                )}
              </div>
              
              <div className="flex w-full flex-col gap-2  lg:flex-row lg:justify-between">
                <button
                  type="submit"
                  className=" my-2 mt-[10vh] w-5/6  max-w-[400px]  rounded-[10px] bg-accent p-3  font-semibold hover:bg-primary hover:text-background active:bg-background active:text-primary"
                >
                  Iniciar Sesión
                </button>
              </div>
              <div className="mt-8 space-x-2">
                <button
                  onClick={handleForgotPassword}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Recuperar contraseña
                </button>
                <button
                  onClick={handleCreateAccount}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
