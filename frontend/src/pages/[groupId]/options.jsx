import React from "react";
import GroupHeader from "../../components/groupHeader";
import { useEffect, useState,useContext } from "react";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import BannerPreview from "@/components/bannerPreview";
import IconPreview from "@/components/iconPreview";
import { hasForbiddenWords } from "@/utils/validationUtils";
import Home from "@/components/home";
import { UserContext } from "@/utils/userContext";
import { GroupContext } from "@/utils/groupContext";

export default function Options() {
  const { user } = useContext(UserContext);
  const { group, updateGroupContext } = useContext(GroupContext);
  
  // obtener el id del grupo desde la url
  const router = useRouter();
  const { groupId } = router.query;

  const isAdmin = () => {
    return group?.admins?.some(
      (admin) => admin.id === user.id
    );
  };

  const [groupInfo, setGroupInfo] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    privacidad: "",
    icono: "",
    banner: "",
  });

  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  //las imagenes se guardan como base64
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setSelectedIcon(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(e.target.files[0]);
    }
    // console.log("selectedIcon", selectedIcon);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setSelectedBanner(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const specialCharsRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;

  const hasSpecialChars = (input) => {
    return specialCharsRegex.test(input);
  };

  useEffect(() => {
    if (group) {
      setGroupInfo({
        id: group?.id,
        nombre: group?.nombre,
        descripcion: group?.descripcion,
        privacidad: group?.privacidad,
        icono: group?.icono,
        banner: group?.banner,
      });
    }
  }, [group]);

  //editarGrupo(id: ID!, nombre: String, privacidad: String, vencimiento: Date, descripcion: String, admins: [ID], miembros: [ID], icono: String, banner: String): Grupo

  const EDITAR_GRUPO_MUTATION = gql`
    mutation editarGrupo(
      $id: ID!
      $nombre: String
      $privacidad: String
      $descripcion: String
      $icono: String
      $banner: String
    ) {
      editarGrupo(
        id: $id
        nombre: $nombre
        privacidad: $privacidad
        descripcion: $descripcion
        icono: $icono
        banner: $banner
      ) {
        id
        nombre
        descripcion
        privacidad
        icono
        banner
      }
    }
  `;

  const [editarGrupo, { loading: loadingEdit, error: errorEdit }] = useMutation(
    EDITAR_GRUPO_MUTATION,
    {
      variables: {
        id: groupInfo.id,
        nombre: groupInfo.nombre,
        privacidad: groupInfo.privacidad,
        descripcion: groupInfo.descripcion,
        icono: selectedIcon,
        banner: selectedBanner,
      },
      onCompleted: () => {
        alert("Grupo editado correctamente");
        // requestGroup();
        updateGroupContext();
        router.push(`/${groupId}/options`);
      },
      onError: (error) => {
        alert(error.message);
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("groupInfo", groupInfo);
    if (hasForbiddenWords(groupInfo.nombre)) {
      alert("El nombre del grupo no puede contener palabras prohibidas");
      return;
    }
    if (hasForbiddenWords(groupInfo.descripcion)) {
      alert("La descripción del grupo no puede contener palabras prohibidas");
      return;
    }
    if (hasSpecialChars(groupInfo.nombre)) {
      alert("El nombre del grupo no puede contener caracteres especiales");
      return;
    }
    if (hasSpecialChars(groupInfo.descripcion)) {
      alert("La descripción del grupo no puede contener caracteres especiales");
      return;
    }

    editarGrupo();
  };

  return (
    <>
      <div className="z-10 mt-[80px]   w-[100vw] max-w-[100vw] text-current lg:w-[55vw] lg:max-w-[90vw] lg:px-10">
        <div className="mt-4 flex-col items-center m-4   justify-between text-[5vw] font-bold sm:text-[18px] ">
          <GroupHeader
            GroupName={group?.nombre}
            GroupId={groupId}
            isAdmin={isAdmin()}
            GroupBanner={group?.banner}
          />
          {/* listas container */}
          {/* Opciones container */}
          <div className="bg-foreground text-primary grid gap-4 rounded-md p-2 lg:grid-cols-2">
            <form
              action=""
              onSubmit={handleSubmit}
              className="flex  flex-col justify-between"
            >
              <div className="flex flex-col">
                <label htmlFor="nombre" className="text-xl font-semibold">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  className="rounded-md p-2 "
                  value={groupInfo.nombre}
                  onChange={(e) =>
                    setGroupInfo({
                      ...groupInfo,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="descripcion" className="text-xl  font-semibold">
                  Descripción
                </label>
                <input
                  type="text"
                  name="descripcion"
                  id="descripcion"
                  className="rounded-md p-2 "
                  value={groupInfo.descripcion}
                  onChange={(e) =>
                    setGroupInfo({
                      ...groupInfo,
                      descripcion: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="privacidad" className="text-xl font-semibold">
                  Privacidad
                </label>
                <select
                  name="privacidad"
                  id="privacidad"
                  className="rounded-md p-2 "
                  value={groupInfo.privacidad}
                  onChange={(e) =>
                    setGroupInfo({
                      ...groupInfo,
                      privacidad: e.target.value,
                    })
                  }
                >
                  <option value="publico">Público</option>
                  <option value="privado">Privado</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="icono" className="text-xl font-semibold">
                  Icono
                </label>
                <input
                  type="file"
                  name="icono"
                  id="icono"
                  accept="image/*"
                  className="max-sm:w-4/5 w-full rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none"
                  onChange={handleIconChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="banner" className="text-xl font-semibold">
                  Banner
                </label>
                <input
                  type="file"
                  name="banner"
                  id="banner"
                  accept="image/*"
                  className="rounded-md p-2 max-sm:w-4/5 w-full"
                  onChange={handleBannerChange}
                />
              </div>
              <div className="flex w-full justify-center">
                <button
                  type="submit"
                  className="bg-background hover:bg-primary hover:text-background transition-all ease-in-out duration-200 m-2 w-1/3 rounded-md p-2 text-xl font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
            {/* preview de icono y banenr */}
            <div className="grid grid-rows-2 ">
              <div className="flex flex-col gap-2">
                <h1 className="border-b text-2xl font-semibold">Icono</h1>
                <IconPreview
                  icon={selectedIcon ? selectedIcon : groupInfo.icono}
                  name={groupInfo.nombre}
                  descripcion={groupInfo.descripcion}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="border-b text-2xl  font-semibold">Banner</h1>
                <BannerPreview
                  name={groupInfo.nombre}
                  banner={selectedBanner ? selectedBanner : groupInfo.banner}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Options.getLayout = function getLayout(page, screenWidth) {
  return <Home screenWidth={screenWidth}>{page}</Home>;
};