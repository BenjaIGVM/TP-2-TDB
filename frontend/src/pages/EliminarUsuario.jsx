import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Cookies from "js-cookie";


const ELIMINAR_USUARIO = gql`
  mutation eliminarUsuario {
    eliminarUsuario {
      nombre
      apellido
      correo
      carrera {
        id
      }
    }
  }
`;

const EliminarUsuarioPage = () => {
  const router = useRouter();
  const [eliminarUsuario] = useMutation(ELIMINAR_USUARIO);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const handleEliminarUsuario = async () => {
    try {
      await eliminarUsuario();

      // Eliminar la cookie de autenticación
      Cookies.remove("token");

      // Redireccionar a la página de inicio de sesión u otra página deseada
      router.push("/login");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Eliminar Usuario</h2>
      {!mostrarConfirmacion ? (
        <button
          onClick={() => setMostrarConfirmacion(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
        >
          Eliminar cuenta
        </button>
      ) : (
        <div>
          <p className="mb-4">¿Estás seguro que deseas eliminar tu cuenta?</p>
          <button
            onClick={handleEliminarUsuario}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
          >
            Confirmar eliminación
          </button>
          <button
            onClick={() => setMostrarConfirmacion(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded ml-4"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default (EliminarUsuarioPage);
