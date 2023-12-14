import React from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { CgEnter } from "react-icons/cg";


function IconPreview({ icon, name, descripcion  }) {
    function iconRender(icon) {
      if (icon === null) {
        return <HiOutlineUserGroup className="text-2xl" />;
      }
      // return <GrGroup className="text-3xl" />;
      // console.log("icon", toString(icon.icono));
      return <img src={icon} width={40} height={40} className="rounded-full max-h-10" />;
    }

    function iconRenderGroup(icon) {
      if (icon === null) {
        return <HiOutlineUserGroup className="text-3xl" />;
      }
      // return <GrGroup className="text-3xl" />;
      // console.log("icon", toString(icon.icono));
      return <img src={icon} width={40} height={40}  className="rounded-full max-h-10" />;
    }

    return (
      <div className="flex flex-col m-2 gap-2">
        <button className="rounded-md transition-all duration-200  ease-in-out hover:bg-primary hover:text-background dark:hover:bg-textDarkColor dark:hover:text-bgDarkColor dark:active:bg-activeDarkColor">
          <div className="flex items-center  gap-2 overflow-hidden rounded-md p-2 ">
            {iconRender(icon)}
            <h1 className="text- text-lg font-semibold">{name}</h1>
          </div>
        </button>
        <div
          className="flex flex-row justify-between rounded-md  bg-background p-2 text-primary"
        >
          {/* icono del grupo */}
          <div className="flex ">
            <div className="m-2 flex items-center justify-center">
              {iconRenderGroup(icon)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p>{descripcion}</p>
            </div>
          </div>
          {/* Agrega un botón o enlace para redirigir a la página del grupo */}
          <div className="m-2 flex items-center justify-center">
            <button className="text-xl font-semibold">
            <CgEnter
                      className="
                    text-3xl font-semibold text-primary"
                    />
            </button>
          </div>
        </div>
      </div>
    );
  }

export default IconPreview;