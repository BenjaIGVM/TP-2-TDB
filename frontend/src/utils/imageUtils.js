/*
    Función que convierte una imagen a una cadena Base64
    @param {imageFile} file - Imagen
    @returns {String} - Cadena Base64
*/
export const imageToBase64 = (imageFile) => {
    const foto = imageFile;
    const reader = new FileReader();
    reader.onloadend = () => {
      const fotoBase64 = reader.result;
      console.log("Foto en base64:", fotoBase64);

      subirFotoPerfil({ variables: { usuarioId, foto: fotoBase64 } });
    };
    return reader.readAsDataURL(foto);
};

/*
  Función que convierte una cadena Base64 a una imagen
    @param {String} base64String - Cadena Base64
    @returns {Image} - Imagen
*/
export const base64ToImage = (base64String) => {
  if (base64String === null || base64String === undefined) return null;
  var image = `data:image/png;base64,${base64String}`;
  return image;
};
