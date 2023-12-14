import React from "react";
import { useRouter } from "next/router";

const FrontPage = () => {
  const router = useRouter();
  return (
    <>
      <header className="flex items-center justify-between bg-foreground px-6 py-4 z-99">
        <div className="w-200 flex items-center">
          <img
            className="relative ml-[7vw] mt-[7px] h-[50px] w-[140px]"
            src="/LogoUchat.png"
            alt="Your Logo"
          />
        </div>
        <div>
          <button onClick={()=>{ router.push("/Login") }}  className="mr-4 rounded border border-primary px-4 py-2 text-sm font-bold text-primary hover:border-0 hover:bg-background">
            Iniciar Sesión
          </button>
          <button onClick={()=>{ router.push("/crearusuario") }} className="rounded bg-accent px-4 py-2 text-sm font-bold text-foreground hover:bg-background hover:text-primary">
            Registrarse
          </button>
        </div>
      </header>
      <div className=" mx-auto flex h-[80vh]  w-[80vw] max-w-[80vw] flex-row items-center justify-center rounded-l-[10px] p-4 text-[10px] text-primary shadow-2xl">
        <div className="flex w-[30vw] min-w-[30vw] flex-col items-start justify-center mr-[5vw]">
          <p className="mb-4 text-xl font-semibold text-accent">Bienvenido a UChat!</p>
          <p className="text-lg">
            Plataforma social diseñada exclusivamente para los estudiantes de la
            Universidad del Bío-Bío. Explora, interactúa y comparte experiencias
            con tus compañeros universitarios en un entorno seguro y familiar.
            Descubre eventos, noticias y oportunidades académicas mientras te
            mantienes conectado con la comunidad estudiantil. ¡Únete a
            UChat y fortalece tus lazos en la Universidad del Bío-Bío
          </p>
          
        </div>
        <div className="flex h-[100%]  w-[45%] flex-col items-center justify-center rounded-l-[10px] p-4 text-[10px] text-primary shadow-2xl">
          <div
            className="box-border w-[98%] min-w-[98%] max-w-[50%] overflow-hidden rounded-[10px]"
            style={{ maxHeight: `90%` }}
          >
            <img
              className="mt-[-10%] min-w-full rounded-[10px] object-cover "
              style={{ minHeight: "60vh" }}
              src="/frontimageBack-transformed.png"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FrontPage;
