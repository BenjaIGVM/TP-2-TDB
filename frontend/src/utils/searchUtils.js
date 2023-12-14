import { useQuery, useMutation, gql } from "@apollo/client";
import { useState,useEffect } from "react";

const GET_USER_BY_NAME = gql`
  query GetUserByName($search: String!) {
    buscarUsuario(buscar: $search) {
      id
      nombre
      apellido
      correo
    }
  }
`;

const GET_GROUP_BY_NAME = gql`
  query GetGroupByName($searchGroup: String!) {
    buscarGrupo(buscar: $searchGroup) {
      id
      nombre
      descripcion
      miembros {
        id
      }
    }
  }
`;

const SEND_JOIN_REQUEST = gql`
  mutation SendJoinRequest($idGrupo: ID!, $idUsuario: ID!) {
    solicitarUnirse(idGrupo: $idGrupo, idUsuario: $idUsuario) {
      id
    }
  }
`;

export const useSearchUsers = (search) => {
  const [searchResults, setSearchResults] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_USER_BY_NAME, {
    variables: { search },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data && data.buscarUsuario) {
      setSearchResults(data.buscarUsuario);
    }
  }, [data]);

  return {
    loading,
    error,
    searchResults,
    refetch,
  };
};

export const useSearchGroups = (searchGroup) => {
  const [searchResults, setSearchResults] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_GROUP_BY_NAME, {
    variables: { searchGroup },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data && data.buscarGrupo) {
      setSearchResults(data.buscarGrupo);
    }
  }, [data]);

  return {
    loading,
    error,
    searchResults,
    refetch,
  };
};

export const useSendJoinRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sendJoinRequestMutation] = useMutation(SEND_JOIN_REQUEST,{
    notifyOnNetworkStatusChange: true,
  });

  const sendJoinRequest = (groupId, userId) => {
    setLoading(true);

    sendJoinRequestMutation({
      variables: { idGrupo: groupId, idUsuario: userId },
    })
      .then((response) => {
        console.log("Solicitud enviada", response.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    error,
    sendJoinRequest,
  };
};
