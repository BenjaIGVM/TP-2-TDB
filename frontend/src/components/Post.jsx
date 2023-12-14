import {
  AiFillHeart,
  AiOutlineComment,
  AiOutlineClose,
  AiOutlineSend,
  AiOutlineMenu,
  AiOutlinePicture,
} from "react-icons/ai";

import React, { useState, useEffect } from "react";
import ImgsDisplay from "@/components/ImgsDisplay";
import { debounce } from "lodash";
import CrearReporte from "./CrearReporte";

export default function Post({
  post,
  addComment,
  removePost,
  likePost,
  usuario,
  inFriends,
  modal,
}) {
  const date = new Date();
  const checkTimeStamp = (time) => {
    const secsAgo = (date - new Date(time)) / 1000;

    if (secsAgo < 60) {
      //min
      const res = Math.round(secsAgo);
      return "Hace " + res + " segundo" + (res > 1 ? "s" : "");
    } else if (secsAgo < 3600) {
      //hora
      const res = Math.round(secsAgo / 60);
      return "Hace " + res + " minuto" + (res > 1 ? "s" : "");
    } else if (secsAgo < 86400) {
      //dia
      const res = Math.round(secsAgo / 3600);
      return "Hace " + res + " hora" + (res > 1 ? "s" : "");
    } else if (secsAgo < 2592000) {
      //mes
      const res = Math.round(secsAgo / 86400);
      return "Hace " + res + " dia" + (res > 1 ? "s" : "");
    } else {
      const res = Math.round(secsAgo / 2592000);
      return "Hace " + res + " mes" + (res > 1 ? "es" : "");
    }
  };

  const [newComment, setNewComment] = useState({
    texto: "",
    imagenes: [],
    esComentario: post.id,
  });
  const handleCommentChange = (event) => {
    setNewComment({ ...newComment, texto: event.target.value });
  };
  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.texto != "") {
      addComment({ ...newComment, inFriends: inFriends });
      setNewComment({
        texto: "",
        imagenes: [],
        esComentario: post.id,
      });
    }
  };

  const [reporteModalVisible, setReporteModalVisible] = useState(false);

  // Función para abrir el modal de reporte
  const openReporteModal = () => {
    setReporteModalVisible(true);
  };

  // Función para cerrar el modal de reporte
  const closeReporteModal = () => {
    setReporteModalVisible(false);
  };

  const handleLike = (id, likes) => {
    likePost({
      id: id,
      dislike: likes.includes(usuario.id),
      inFriends: inFriends,
    });
  };

  const OptionsMenu = ({ userPostID, postID }) => {
    const [showOptionMenu, setShowOptionMenu] = useState(false);

    const handleOptionsButtonClick = () => {
      setShowOptionMenu(!showOptionMenu);
    };

    const clickOut = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setShowOptionMenu(false);
    };


    // console.log("userPostID", userPostID, "usuario.id", usuario.id);

    return (
      <div className="relative justify-self-center p-[10px]">
        <button
          className="ml-auto mr-[10px] flex items-center self-center font-bold opacity-80 hover:text-accent"
          onBlurCapture={() => clickOut()}
          onClick={() => handleOptionsButtonClick()}
        >
          <AiOutlineMenu
            style={{ marginLeft: "0.25rem", width: "1.5rem", height: "1.5rem" }}
          />
        </button>
        {showOptionMenu && (
          <div className="top-90 z-3 absolute left-[-170px] w-[200px] cursor-pointer overflow-hidden rounded-[10px] bg-background shadow-md">
            <ul>
              {userPostID == usuario.id && (
                <li
                  className="p-[10px] hover:bg-primary hover:text-background"
                  onClick={() =>
                    modal(
                      () => removePost({ id: postID, inFriends: inFriends }),
                      "¿Estas seguro de eliminar la publicacion?"
                    )
                  }
                >
                  Delete
                </li>
              )}
              <li
                className="p-[10px] hover:bg-primary hover:text-background"
                onClick={() => openReporteModal()}
              >
                Report
              </li>
            </ul>
          </div>
        )}
        {reporteModalVisible && (
          <CrearReporte
            usuarios={userPostID}
            closeModal={closeReporteModal}
            onReporteCreado={() => {}}
            idElemento={post.id} // Pasa el ID del post actual al componente CrearReporte
            idUsuarioActual={usuario.id} // Pasa el ID del usuario actual al componente CrearReporte
          />
        )}
      </div>
    );
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      let showAlert = false; // Variable para controlar la alerta

      const selectedImages = Array.from(files).slice(0, 4); // Limitar a 4 imágenes seleccionadas

      // Convertir las imágenes a base64
      const imagePromises = selectedImages.map((image) => {
        if (image.size > 700 * 1024) {
          if (!showAlert) {
            window.alert("Una o más imágenes superan los 700 KB de tamaño.");
            showAlert = true;
          }

          return null; // Retornar null para evitar procesar la imagen
        }

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(image);
        });
      });

      // Filtrar las promesas nulas y esperar a que las conversiones de base64 se completen
      Promise.allSettled(
        imagePromises.filter((promise) => promise !== null)
      ).then((results) => {
        const base64Images = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        setNewComment({ ...newComment, imagenes: base64Images });
      });
    }
    setImageKey((prevKey) => prevKey + 1);
  };

  const handleRemoveImage = (index) => {
    const newImages = newComment.imagenes.slice();
    newImages.splice(index, 1);
    setNewComment({ ...newComment, imagenes: newImages });
  };

  const [imageKey, setImageKey] = useState(0);

  return (
    <>
      <div className="my-[20px] rounded-[10px] bg-foreground px-[2vw] py-[20px] shadow-2xl lg:py-[40px]">
        <div className="mb-[1rem] flex w-full items-start">
          <img
            className="ml-[2vw] mr-[1rem] h-[4rem] w-[4rem] rounded-lg lg:ml-0"
            src={post.usuario.foto_perfil}
            alt={`${post.usuario.username}'s profile picture`}
          />
          <div className="flex-grow">
            <h2 className="mb-0 mr-[10px] font-bold">
              {post.usuario.username.charAt(0).toUpperCase() +
                post.usuario.username.slice(1)}
              {post.enGrupo && (
                <h2 className="mb-0 mr-[8px] font-thin text-secondary">
                  /{post.enGrupo.nombre}
                </h2>
              )}
            </h2>
            <p className="mt-[4px] opacity-70">{checkTimeStamp(post.fecha)}</p>
          </div>

          <OptionsMenu userPostID={post.usuario.id} postID={post.id} />
        </div>

        <div className="break-words text-base font-normal leading-6 opacity-100">
          <div className="ml-[2vw] mt-[20px] lg:ml-0">{post.texto}</div>
          {post.imagenes.length > 0 && (
            <div className=" mb-[-10px] mt-[20px] box-border flex flex-wrap items-start rounded-[10px]">
              {ImgsDisplay({
                images: post.imagenes,
                containerHeight: 500,
                containerMaxHeight: 1000,
              })}{" "}
            </div>
          )}
        </div>

        <div className="mb-[30px] ml-[2vw] mt-[20px] flex items-center justify-start lg:ml-[5px]">
          <DebouncedLikeButton
            id={post.id}
            likes={post.likes}
            onClick={handleLike}
            usID={usuario.id}
            isComment={false}
          />
          <div className="mr-[1.5rem] flex items-center font-bold opacity-80">
            <AiOutlineComment className="mr-[0.5rem] h-[1.5rem] w-[1.5rem] fill-current opacity-80" />
            <span>{post.comentarios.length}</span>
          </div>
        </div>

        <div className="mt-[1rem] flex flex-col">
          {post.comentarios.length > 0 && (
            <div className="m-0 list-none p-0">
              {post.comentarios.length > 3 && (
                <button
                  className="m-[10px]"
                  onClick={() => alert("Ver mas comentarios...")}
                >
                  Ver mas comentarios...
                </button>
              )}

              {post.comentarios
                .slice(
                  Math.max(0, post.comentarios.length - 3),
                  post.comentarios.length
                )
                .map((comment, index) => (
                  <div
                    key={index}
                    className="mb-[14px] flex w-full  items-start rounded-[10px] bg-backgroundAlpha pb-[10px] pr-[10px]"
                    style={{ borderTop: "1px solid var(--bg-color)" }}
                  >
                    <img
                      className="ml-[1rem] mt-[15px] h-[3rem] w-[3rem] rounded-[10px]"
                      src={comment.usuario.foto_perfil}
                      alt={`${comment.usuario.username}'s profile picture`}
                    />
                    <div className="mx-[2vw] mt-[10px] flex flex-grow flex-col rounded-lg">
                      <h2 className="my-[5px] mr-[10px]  font-bold">
                        {comment.usuario.username.charAt(0).toUpperCase() +
                          comment.usuario.username.slice(1)}
                      </h2>

                      {comment.imagenes.length > 0 && (
                        <div className="mx-auto mb-[5px] mt-[10px] box-border flex w-full flex-wrap items-start rounded-[10px]">
                          {" "}
                          {ImgsDisplay({
                            images: comment.imagenes,
                            containerHeight: 250,
                            containerMaxHeight: 250,
                          })}{" "}
                        </div>
                      )}

                      <div className="mb-[10px] flex w-full flex-row">
                        <div className="mr-[20px]">
                          <h2 className="break-words text-base font-normal leading-6 opacity-100">
                            {comment.texto}
                          </h2>
                          <p className="mt-[4px] opacity-70">
                            {checkTimeStamp(comment.fecha)}
                          </p>
                        </div>

                        <div className="ml-auto mr-[-20px] mt-[-20px] flex items-center self-center">
                          <DebouncedLikeButton
                            id={comment.id}
                            likes={comment.likes}
                            onClick={handleLike}
                            usID={usuario.id}
                            isComment={true}
                          />

                          <OptionsMenu
                            userPostID={comment.usuario.id}
                            postID={comment.id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <form
            className="flex flex-row border-t-[2px] border-dotted border-background pt-[20px]"
            onSubmit={handleCommentSubmit}
          >
            <label className="flex items-center rounded-l-[10px] bg-background pl-[20px] hover:text-accent">
              <AiOutlinePicture className="h-[1.3rem] w-[1.3rem] fill-current opacity-80" />
              <input
                key={imageKey}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                onDrop={handleImageChange}
              />
            </label>
            <textarea
              className="transition-height h-[45px] w-[93%] resize-none bg-background p-[10px] pl-[20px] text-base placeholder-secondary  outline-none duration-300 ease-in-out
                    focus:h-[110px] focus:pt-[20px] focus:outline-none "
              type="text"
              placeholder="Comenta algo..."
              value={newComment.texto}
              onChange={handleCommentChange}
            />
            <button
              className="flex items-center rounded-r-[10px] bg-background pr-[20px] hover:text-accent"
              type="submit"
            >
              <AiOutlineSend />
            </button>
          </form>
        </div>
        <div className="mt-4 flex space-x-2">
          {newComment.imagenes.map((base64Image, index) => (
            <div key={index} className="relative max-w-[20%]">
              <img
                src={base64Image}
                alt={`Imagen ${index + 1}`}
                className="h-20 w-20 rounded-md"
              />
              <button
                className="right absolute top-0 rounded-full p-1 text-white hover:bg-primary"
                onClick={() => handleRemoveImage(index)}
              >
                <AiOutlineClose className="h-4 w-4 text-black" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const debouncedClick = debounce(
  (id, likes, onClick) => {
    onClick(id, likes);
  },
  500,
  {
    leading: true,
    trailing: false,
  }
);

const DebouncedLikeButton = ({ id, likes, onClick, usID, isComment }) => {
  const handleClick = () => {
    debouncedClick(id, likes, onClick);
  };

  if (isComment) {
    return (
      <button
        className="ml-auto mr-[10px] flex items-center self-center font-bold opacity-80 hover:text-accent"
        onClick={handleClick}
      >
        <AiFillHeart
          style={{
            color: likes.some((lik) => lik.id == usID)
              ? "var(--primary-color)"
              : "inherit",
          }}
        />
        <span className="ml-[0.25rem]">{likes.length}</span>
      </button>
    );
  } else {
    return (
      <button
        className="mr-[1.5rem] flex items-center font-bold opacity-80 hover:text-accent"
        onClick={handleClick}
      >
        <AiFillHeart
          className={`${
            likes.some((lik) => lik.id == usID) ? "text-accent" : "inherit"
          } mr-[0.5rem] h-[1.5rem] w-[1.5rem] fill-current opacity-80`}
        />
        <span>{likes.length}</span>
      </button>
    );
  }
};
