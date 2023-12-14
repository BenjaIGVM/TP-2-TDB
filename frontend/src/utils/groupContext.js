import { createContext, useState, useEffect, useContext } from "react";

export const GroupContext = createContext();
import { clientMutator, clientRequester } from "./graphqlManager.js";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import {UserContext} from "./userContext.js";

const GET_GROUP_INFO = gql`
  query buscarGrupoId($id: ID!) {
    buscarGrupoId(id: $id) {
      id
      nombre
      icono
      banner
      admins {
        id
        nombre
        apellido
        username
        foto_perfil
      }
      miembros {
        id
        nombre
        apellido
        username
        foto_perfil
      }
      solicitudes {
        id
        nombre
        apellido
        username
        foto_perfil
      }
    }
  }
`;

const GET_GROUP_POSTS = gql`
  query buscarPublicacionGrupo($grupo: ID!, $skip: Int) {
    buscarPublicacionGrupo(grupo: $grupo, skip: $skip) {
      id
      fecha
      imagenes
      texto
      likes{
          id
      }
      comentarios{
          id
          usuario{
              id
              username
              foto_perfil
          }
          texto
          imagenes
          fecha
          likes{
              id
          }
      }
      usuario{
          id
          username
          foto_perfil
      }
    }
  }
`;

export const GroupProvider = (props) => {

  const {user,setFriendsPosts,setUser} = useContext(UserContext);
  const [group, setGroup] = useState();
  const [groupPost, setGroupPost] = useState([]);

  const router = useRouter();
  const { groupId } = router.query;

  useEffect(() => {
    if (!group) {
      requestGroup().then((data) => {
        setGroup(data);
      });
    }
  }, [groupId, group]);
  
  const updateGroupContext = () => {
    requestGroup().then((data) => {
      setGroup(data);
    });
  };

  const requestGroupPost = async (id, skip) => {
    var skips=0;
    if (skip == undefined||skip == null) {
      skips=skip.value;
    }
    console.log("skips",skips);
    console.log("id requestGroup",id);
    const { buscarPublicacionGrupo } = await clientRequester(
      `query buscarPublicacionGrupo($grupo: ID!, $skip: Int) {
        buscarPublicacionGrupo(grupo: $grupo, skip: $skip) {
            id
            fecha
            imagenes
            texto
            likes{
                id
            }
            comentarios{
                id
                usuario{
                    id
                    username
                    foto_perfil
                }
                texto
                imagenes
                fecha
                likes{
                    id
                }
            }
            usuario{
                id
                username
                foto_perfil
            }
        }
    }`,
      { grupo: groupId, },
      true,
    ).then((data) => {
      return data;
    });

    console.log("publicaciones grupo", buscarPublicacionGrupo);
    return buscarPublicacionGrupo;
  };

  const addGroupPost = async ({ texto, imagenes, enGrupo}) => {
    setFriendsPosts((prevFriendsPosts) => [{ waiting: true }, ...prevFriendsPosts])

    const { crearPublicacion } = await clientMutator(
        `mutation CrearPublicacion($usuario: ID!, $fecha: Date!, $texto: String, $imagenes: [String], $votacion: ID,$enGrupo: ID) {
            crearPublicacion(usuario: $usuario, fecha: $fecha, texto: $texto, imagenes: $imagenes, votacion: $votacion,enGrupo: $enGrupo ) {
                id
                fecha
                imagenes
                texto
                tagInfo{
                    tag{
                        nombre
                        id
                    }
                    valor
                }
            }
        }`, { usuario: user.id, fecha: new Date(), texto: texto, imagenes: imagenes, enGrupo: enGrupo })
        .then((data) => { return data; })
        .catch((error) => { throw error; });


    console.log("Nueva Publicacion", crearPublicacion);
    if (!crearPublicacion || crearPublicacion === null) { return }



    setUser((prevUser) => {
        return {
            ...prevUser,
            publicaciones: [...prevUser.publicaciones, crearPublicacion.id]
        }
    })

    setFriendsPosts((prevFriendsPosts) => {
        const updatedPosts = prevFriendsPosts.filter((post) => post.waiting !== true);

        return [{
            ...crearPublicacion, likes: [], comentarios: [],
            usuario: { id: user.id, username: user.username, foto_perfil: user.foto_perfil }
        },
        ...updatedPosts,
        ]

    })
    return crearPublicacion;
}




  const requestGroup = async () => {
    const { buscarGrupoId } = await clientRequester(
      `query buscarGrupoId($id: ID!) {
        buscarGrupoId(id: $id) {
            id
            nombre
            icono
            banner
            descripcion
            admins {
                id
                nombre
                apellido
                username
                foto_perfil
            }
            miembros {
                id
                nombre
                apellido
                username
                foto_perfil
            }
            solicitudes {
                id
                nombre
                apellido
                username
                foto_perfil
            }
        }
    }`,
      { id: groupId },
      false
    ).then((data) => {
      return data;
    });

    console.log("request", buscarGrupoId);
    return buscarGrupoId;
  };



  return (
    <GroupContext.Provider
      value={{
        group,
        setGroup,
        requestGroup,
        updateGroupContext,
        requestGroupPost,
        addGroupPost,
        groupPost,
      }}
    >
      {props.children}
    </GroupContext.Provider>
  );
};
