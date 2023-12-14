import React, { use } from "react";
import { useEffect, useState } from "react";
import { UserContext } from "@/utils/userContext";
import { gql, useQuery } from "@apollo/client";
import Home from "@/components/Home";
import { useContext } from "react";
import { VscLoading, VscError } from "react-icons/vsc";
import { HiOutlineUserGroup } from "react-icons/hi";
import { CgEnter } from "react-icons/cg";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import Link from "next/link";
import CreateGroupModal from "@/components/CreateGroupModal";

const GET_USER_GROUPS = gql`
  query gruposUsuario($usuario: ID!) {
    buscarGrupoUsuario(usuario: $usuario) {
      id
      nombre
      descripcion
      icono
    }
  }
`;

function GroupPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalComplete, setModalComplete] = useState(false);
  const { user } = useContext(UserContext);
  const { loading, error, data, refetch } = useQuery(GET_USER_GROUPS, {
    variables: { usuario: user.id },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (error) {
      console.log("error", error);
    }
  }, [error]);

  console.log("data", modalComplete);
  useEffect(() => {
    if (modalComplete) {
      setTimeout(() => {
        refetch();
      }, 5000);

      console.log("refetch", data);
      setModalComplete(false);
    }

  }, [modalComplete]);

  // para que compruebe cada [] segundo si hay cambios en la base de datos
  const interval = 60000;
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, interval);
    return () => clearTimeout(timer);
  }, []);


  if (loading) {
    return (
      <>
        <div className="z-10 mt-[80px]   w-[100vw] max-w-[100vw] text-current lg:w-[55vw] lg:max-w-[90vw] lg:px-10">
          <div className="ml-4 mt-[20px] flex w-[calc(100%-10px)] flex-row items-center justify-between ">
            <h1 className="text-[5vw] font-bold text-secondary sm:text-[18px]">
              Grupos
            </h1>
            <div className="ml-auto mr-[8px] flex h-[50px] rounded-[10px]  border-[2px]  border-b-0   border-secondary bg-background">
              <button className=" flex gap-2  rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-primary hover:text-foreground">
                <p className=" text-lg font-semibold max-md:hidden  ">
                  Crear Grupo
                </p>
                <AiOutlineUsergroupAdd className="text-3xl font-semibold " />
              </button>
            </div>
          </div>
          <div className="to-105% mb-2 mt-[-4px] h-[4px] w-[100%] bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent" />
          <div className="flex  flex-col gap-2 p-2">
            <div className="bg-bgDarkColorTrasparent flex flex-row justify-center  rounded-md p-2 dark:text-[#a9dacb]">
              <VscLoading className="animate-spin text-3xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* groups Cards*/}
        <div className="z-10 mt-[80px]   w-[100vw] max-w-[100vw] text-current lg:w-[55vw] lg:max-w-[90vw] lg:px-10">
          <div className="ml-4 mt-[20px] flex w-[calc(100%-10px)] flex-row items-center justify-between ">
            <h1 className="text-[5vw] font-bold text-secondary sm:text-[18px]">
              Grupos
            </h1>
            <div className="ml-auto mr-[8px] flex h-[50px] rounded-[10px]  border-[2px]  border-b-0   border-secondary bg-background">
              <button className=" flex gap-2  rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-primary hover:text-foreground">
                <p className=" text-lg font-semibold max-md:hidden  ">
                  Crear Grupo
                </p>
                <AiOutlineUsergroupAdd className="text-3xl font-semibold " />
              </button>
            </div>
          </div>
          <div className="to-105% mb-2 mt-[-4px] h-[4px] w-[100%] bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent" />
          <div className="grid grid-cols-1 gap-2 p-2">
            <div className="bg-bgDarkColorTrasparent flex flex-row justify-center gap-2  rounded-md p-2 dark:text-[#a9dacb]">
              <VscError className="animate-bounce text-3xl" />
              <p>Error: {error?.message}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  function iconRender(icon) {
    if (icon.icono === null || icon.icono === "") {
      return <HiOutlineUserGroup className="text-3xl" />;
    }
    // return <GrGroup className="text-3xl" />;
    // console.log("icon", toString(icon.icono));
    return (
      <img
        src={icon.icono}
        width={40}
        height={40}
        className="max-h-10 rounded-full"
      />
    );
  }

  return (
    <>
      {/* Modal */}
      {modalOpen && (
        <div className="h-screen ">
          <CreateGroupModal
            isOpen={modalOpen}
            setModalOpen={setModalOpen}
            onConfirm={() => {
              setModalComplete(!modalComplete);
            }}
            refetch={refetch}
            userId={user.id}
          />
        </div>
      )}

      {/* Publicaciones / feed */}
      <div className="z-10 mt-[80px]   w-[100vw] max-w-[100vw] text-current lg:w-[55vw] lg:max-w-[90vw] lg:px-10">
        <div className="ml-4 mt-[20px] flex w-[calc(100%-10px)] flex-row items-center justify-between ">
          <h1 className="text-[5vw] font-bold text-secondary sm:text-[18px]">
            Grupos
          </h1>
          <div className="ml-auto mr-[8px] flex h-[50px] rounded-[10px]  border-[2px]  border-b-0   border-secondary bg-background">
            <button
              onClick={() => setModalOpen(!modalOpen)}
              className=" flex gap-2  rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-primary hover:text-foreground"
            >
              <p className=" text-lg font-semibold max-md:hidden  ">
                Crear Grupo
              </p>
              <AiOutlineUsergroupAdd className="text-3xl font-semibold " />
            </button>
          </div>
        </div>
        <div className="to-105% mb-2 mt-[-4px] h-[4px] w-[100%] bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent" />
        {/* groups Cards*/}
        <div className="flex  flex-col gap-2 p-2">
          {data?.buscarGrupoUsuario.map((group) => (
            <div
              className="flex flex-row justify-between rounded-md border-secondary   bg-foreground  p-2 text-primary"
              key={group.id}
            >
              {/* icono del grupo */}
              <div className="flex ">
                <div className="m-2 flex items-center justify-center">
                  {iconRender(group)}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{group.nombre}</h2>
                  <p>{group.descripcion}</p>
                </div>
              </div>
              {/* Agrega un botón o enlace para redirigir a la página del grupo */}
              <div className="m-2 flex items-center justify-center">
                <Link
                  href={`/${group.id}/home`}
                  className="text-xl font-semibold"
                >
                  <CgEnter
                    className="
                    text-3xl font-semibold text-primary"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

GroupPage.getLayout = function getLayout(page, screenWidth) {
  return <Home screenWidth={screenWidth}>{page}</Home>;
};

export default GroupPage;