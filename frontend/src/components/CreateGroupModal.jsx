import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { hasForbiddenWords } from "@/utils/validationUtils";

export default function CreateGroupModal({
  isOpen,
  setModalOpen,
  onConfirm,
  refetch,
  userId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [grupo, setGrupo] = useState({
    nombre: "",
    descripcion: "",
    banner: "",
    icono: "",
    privacidad: "publico",
  });

  const CREATE_GROUP = gql`
    mutation crearGrupo(
      $nombre: String!
      $descripcion: String!
      $banner: String!
      $icono: String!
      $privacidad: String!
      $admins: [ID]!
    ) {
      crearGrupo(
        nombre: $nombre
        descripcion: $descripcion
        banner: $banner
        icono: $icono
        privacidad: $privacidad
        admins: $admins
      ) {
        id
        nombre
        descripcion
        banner
        icono
        privacidad
      }
    }
  `;

  const [crearGrupo, { loading: loadingCreate, error: errorCreate }] =
    useMutation(CREATE_GROUP, {
      variables: {
        nombre: grupo.nombre,
        descripcion: grupo.descripcion,
        banner: grupo.banner,
        icono: grupo.icono,
        privacidad: grupo.privacidad,
        admins: [userId],
      },
    });

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (grupo.nombre.length < 3 || grupo.nombre.length > 20) {
      alert("El nombre debe tener entre 3 y 20 caracteres");
      setIsLoading(false);

      return;
    }
    if (grupo.descripcion.length < 3 || grupo.descripcion.length > 100) {
      alert("La descripción debe tener entre 3 y 100 caracteres");
      setIsLoading(false);

      return;
    }
    if (hasForbiddenWords(grupo.nombre)) {
      alert("El nombre del grupo no puede contener palabras prohibidas");
      setIsLoading(false);
      return;
    }
    if (hasForbiddenWords(grupo.descripcion)) {
      alert("La descripción del grupo no puede contener palabras prohibidas");
      setIsLoading(false);
      return;
    }
    if (hasSpecialChars(grupo.nombre)) {
      alert("El nombre del grupo no puede contener caracteres especiales");
      setIsLoading(false);
      return;
    }
    if (hasSpecialChars(grupo.descripcion)) {
      alert("La descripción del grupo no puede contener caracteres especiales");
      setIsLoading(false);
      return;
    }
    console.log("grupo", grupo);

    crearGrupo();

    if (errorCreate) {
      alert(errorCreate.message);
      return;
    }

    setIsLoading(false);
    onConfirm();
    refetch();
    setModalOpen(!isOpen);
  };

  const specialCharsRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
  const hasSpecialChars = (input) => {
    return specialCharsRegex.test(input);
  };

  //las imagenes se guardan como base64
  const handleIconChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setGrupo({ ...grupo, icono: reader.result });
      }
    };

    if (file) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBannerChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setGrupo({ ...grupo, banner: reader.result });
      }
    };

    if (file) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center   ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div className="fixed inset-0 bg-background opacity-60" />
      <div className={`fixed inset-0 flex items-center justify-center`}>
        <div className="w-[300px] max-w-[100vw] rounded-[10px] bg-background p-4 text-center shadow-2xl">
          <div className="mt-4 justify-end">
            {isLoading ? (
              <>
                <h2 className="mb-4 text-lg font-bold">
                  Ejecutando cambios...
                </h2>
                <svg
                  className="mx-auto h-[30px] w-[30px] animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20c3.042 0 5.824-1.135 7.938-3l-2.647-3A7.962 7.962 0 0112 16v4zM20 12a8 8 0 01-8 8v-4c2.206 0 4.2-.9 5.657-2.343l2.647 3z"
                  />
                </svg>
              </>
            ) : (
              <>
                <h2 className="mb-4 text-lg font-bold text-accent">
                  Crear Grupo
                </h2>
                <form action="" className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="nombre" className="text-lg font-bold">
                      Nombre del grupo
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={grupo.nombre}
                      onChange={(e) =>
                        setGrupo({ ...grupo, nombre: e.target.value })
                      }
                      className="rounded-[10px] border-2 border-accent p-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="descripcion" className="text-lg font-bold">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      id="descripcion"
                      rows="2"
                      value={grupo.descripcion}
                      onChange={(e) =>
                        setGrupo({ ...grupo, descripcion: e.target.value })
                      }
                      className="resize-none rounded-[10px] border-2 border-accent p-2"
                    ></textarea>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="banner" className="text-lg font-bold">
                      Banner
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="banner"
                      id="banner"
                      onChange={handleBannerChange}
                      className=" rounded-[10px] border-2 border-accent p-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="banner" className="text-lg font-bold">
                      Icono
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="icono"
                      id="icono"
                      onChange={handleIconChange}
                      className=" rounded-[10px] border-2 border-accent p-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="privacidad" className="text-lg font-bold">
                      Privacidad
                    </label>
                    <select
                      name="privacidad"
                      id="privacidad"
                      value={grupo.privacidad}
                      onSelect={(e) =>
                        setGrupo({ ...grupo, privacidad: e.target.value })
                      }
                      className="rounded-[10px] border-2 border-accent p-2"
                    >
                      <option value="publico">Público</option>
                      <option value="privado">Privado</option>
                    </select>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      className="mx-auto rounded-[10px] bg-accent px-4 py-2 font-bold hover:bg-background"
                      onClick={handleConfirm}
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setModalOpen(!isOpen)}
                      className="mx-auto rounded-[10px] bg-secondary px-4 py-2 font-bold hover:bg-background"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
