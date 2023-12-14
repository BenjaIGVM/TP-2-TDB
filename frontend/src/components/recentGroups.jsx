import jwtDecode from "jwt-decode";
import Image from "next/image";
import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {HiOutlineUserGroup} from "react-icons/hi";


export default function RecentGroups() {

  function FindGroups() {
    const [userID, setUserId] = useState([]);
  
    useEffect(() => {
      const loggedUserId = jwtDecode(localStorage.getItem("token")).id;
      // console.log("user id", loggedUserId);
      setUserId(loggedUserId);
    }, []);
  
    // const loggedUserId = jwtDecode(localStorage.getItem("token")).id;
    // console.log("user id", loggedUserId);
  
    const FIND_USER_GROUPS = gql`
      query {
        buscarGrupoUsuario(usuario: "${userID}") {
          id
          nombre
          descripcion
          privacidad
          banner
          icono
        }
      }
    `;
  
    const { data, loading, error } = useQuery(FIND_USER_GROUPS);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
  
    console.log("data", data.icono);
  
    function iconRender(icon) {
      if(icon.icono === null){
        return <HiOutlineUserGroup className="text-2xl" />;
      }
      // return <GrGroup className="text-3xl" />;
      // console.log("icon", toString(icon.icono));
      return <img src={icon.icono}  width={40} height={40} className="rounded-full max-h-10" />;
    }
    
    return (
      <>
        {data.buscarGrupoUsuario.map((grupo) => {
          return (
            <Link
              href={`/${grupo.id}/home`}
              key={grupo.id}
              className="rounded-md transition-all  duration-200  ease-in-out hover:bg-[#D3D3D3] dark:hover:bg-textDarkColor dark:hover:text-bgDarkColor dark:active:bg-activeDarkColor"
            >
              <div className="flex items-center  gap-2 overflow-hidden rounded-md p-2 ">
                  {iconRender(grupo)}
                <h1 className="text- text-lg font-semibold">{grupo.nombre}</h1>
              </div>
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <>
      <div className="m-2 flex flex-col gap-2 rounded-md p-2  transition-all delay-150 duration-500 ease-in-out dark:bg-[#231842] dark:text-[#a9dacb]">
        <h1 className="text-lg font-semibold">Grupos recientes</h1>
        <div className="m-2 ml-4 flex flex-col gap-2">
          <FindGroups />
        </div>
      </div>
    </>
  );
}
