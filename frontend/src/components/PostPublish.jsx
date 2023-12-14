import { AiOutlineSend, AiOutlinePicture, AiOutlineUser, AiOutlineClose } from "react-icons/ai";
import React, { useState, useContext } from 'react';


export default function PostPublish({ user, addPost, groupId }) {

    const [newPost, setNewPost] = useState({
        texto: '',
        imagenes: []
    });

    const handlePostSubmit = (event) => {

        event.preventDefault();
        if (newPost.texto != "") {
            addPost(newPost).then((post) => { //CHARGE UNTIL POSTED

            })

            setNewPost({
                texto: "",
                imagenes: []
            });

        }

    };

    const profilePicRender = () => {
        if (!user.foto_perfil) {
            return <AiOutlineUser className="h-[30px] w-[30px] fill-current opacity-80" />
        }
        return <img className="   w-[50px] h-[50px] rounded-[6px] mr-4 ml-4" src={user.foto_perfil} alt={`${user.username}'s profile picture`} />
    }


    const handlePostChange = (event) => {
        setNewPost({ ...newPost, texto: event.target.value });
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            let showAlert = false; // Inicializar en falso para no mostrar alerta por defecto
    
            const selectedImages = Array.from(files).slice(0, 4); // Limitar a 4 imágenes seleccionadas
    
            const imagePromises = selectedImages.map((image) => {
                if (image.size > 700 * 1024) {
                    if (!showAlert) {
                        window.alert('Una o más imágenes superan los 700 KB de tamaño.');
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
    
            Promise.allSettled(imagePromises.filter((promise) => promise !== null)).then((results) => {
                const base64Images = results
                    .filter((result) => result.status === 'fulfilled')
                    .map((result) => result.value);
    
                setNewPost({ ...newPost, imagenes: base64Images });
            });
        }
    
        setImageKey((prevKey) => prevKey + 1);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...newPost.imagenes];
        newImages.pop(index);
        setNewPost({ ...newPost, imagenes: newImages });
    };

    const [imageKey, setImageKey] = useState(0);


    const [lightboxImage, setLightboxImage] = useState(null);

    const handleOpenLightbox = (image) => {
        setLightboxImage(image);
    };

    const handleCloseLightbox = () => {
        setLightboxImage(null);
    };



    return (
        <div className="flex flex-col w-full  items-center justify-evenly border-[2px] border-dotted border-background  px-[10px] mt-[20px] mb-[20px] bg-foreground rounded-[10px] shadow-2xl">
            <div className="flex w-full  items-center justify-evenly" >
                {profilePicRender()}
                <form className="w-[86%]  py-[20px] flex flex-row" onSubmit={handlePostSubmit}>

                    <label className="flex items-center pl-[20px] bg-background rounded-tl-lg rounded-bl-lg ml-[2px] hover:text-accent">
                        <AiOutlinePicture className="h-[1.3rem] w-[1.3rem] fill-current opacity-80" />
                        <input
                            key={imageKey}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>


                    <textarea className="p-[10px] pl-[20px] bg-background text-base w-[93%] h-[45px] outline-none focus:outline-none placeholder-secondary resize-none focus:h-[110px] focus:pt-[20px] transition-height duration-300 ease-in-out "
                        type="text"
                        placeholder="¿Que quieres decir?..."
                        value={newPost.texto}
                        onChange={handlePostChange}
                    />
                    <button
                        className="flex items-center pr-[20px] bg-background rounded-tr-lg rounded-br-lg mr-[2px] hover:text-accent" type="submit">
                        <AiOutlineSend className="h-[1.3rem] w-[1.3rem] fill-current opacity-80" /></button>

                </form>


            </div>
            <div className="flex  justify-evenly w-full p-2">
                {newPost.imagenes.map((base64Image, index) => (
                    <div key={index} className="relative">
                        <img src={base64Image} alt={`Imagen ${index + 1}`} className="w-40 h-40 rounded-md" />
                        <button
                            className="absolute top-0 right text-white rounded-full p-1 hover:bg-primary"
                            onClick={() => handleRemoveImage(index)}
                        >
                            <AiOutlineClose className="h-4 w-4  text-black" />
                        </button>
                    </div>
                ))}
            </div>


        </div>

    );
};

