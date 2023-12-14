/** 
 * Necesita: nombre, apellido, username, correo, carrera
 * Puede tener: chats, fecha_nacimiento, grupos, amigos, publicaciones, likes, comentarios 
 */
export const crearUsuario = retornar => {
    return `mutation CrearUsuario($nombre: String!, $apellido: String!, $foto_perfil: String, $username: String!, $correo: String!, $fecha_nacimiento: Date, $chats: [Chat], $carrera: Carrera!, $grupos: [Grupo], $amigos: [Usuario], $publicaciones: [Publicacion], $likes: [Publicacion], $comentarios: [Publicacion]) {
        crearUsuario(nombre: $nombre, apellido: $apellido, foto_perfil: $foto_perfil, username: $username, correo: $correo, fecha_nacimiento: $fecha_nacimiento, chats: $chats, carrera: $carrera, grupos: $grupos, amigos: $amigos, publicaciones: $publicaciones, likes: $likes, comentarios: $comentarios) {
        id
        ${retornar}
      }
    }`
}

/**
 * Necesita: nombre, acronimo
 */
export const crearCarrera = retornar => {
  return `mutation CrearCarrera($nombre: String!, $acronimo: String!, $alumnos: [ID]) {
      crearCarrera(nombre: $nombre, acronimo: $acronimo, alumnos: $alumnos) {
        id
        ${retornar}
      }
    }`
}

/**
 * Necesita: usuario, fecha, texto
 * Puede tener: imagenes, votacion, comentarios, likes
 */
export const crearPublicacion = retornar => {
  return `mutation CrearPublicacion($usuario: Usuario!, $fecha: Date!, $texto: String, $imagenes: [String], $votacion: VotacionInput, $comentarios:[Publicacion], $likes: [Usuario]) {
      crearPublicacion(usuario: $usuario, fecha: $fecha, texto: $texto, imagenes: $imagenes, votacion: $votacion, comentarios:$comentarios, likes: $likes) {
        id
        ${retornar}
      }
    }`
}

/**
 * Necesita: pregunta, opciones
 */
export const crearVotacion = retornar => {
  return `mutation CrearVotacion($pregunta: String!, $opciones: [OpcionInput]!) {
      crearVotacion(pregunta: $pregunta, opciones: $opciones) {
        id
        ${retornar}
      }
    }`
}

/**
 * Necesita: texto
 */
export const crearOpcion = retornar => {
  return `mutation CrearOpcion($texto: String!) {
      crearOpcion(texto: $texto) {
        id
        ${retornar}
      }
    }`
}

/**
 * Necesita: nombre, privacidad, chat, admins
 * Puede tener: vencimiento, descripcion, miembros
 */
export const crearGrupo = retornar => {
  return `mutation CrearGrupo($nombre: String!, $privacidad: String!, $vencimiento: Date, $descripcion: String, $chat: Chat!, $admins: [Usuario!]!, $miembros: [Usuario]) {
      crearGrupo(nombre: $nombre, privacidad: $privacidad, vencimiento: $vencimiento, descripcion: $descripcion, chat: $chat, admins: $admins,  miembros: $miembros) {
        id
        ${retornar}
      }
    }`
}

/**
 * Necesita: usuarios, mensajes
 */
export const crearChat = retornar => {
  return `mutation CrearChat($usuarios: [Usuario!]!, $mensajes: [Mensaje]) {
      crearChat(usuarios: $usuarios, mensajes: $mensajes) {
        id
        ${retornar}
      }
    }`
}

/**
 * Necesita: fecha, usuario
 * Puede tener: texto, imagenes, visto
 */
export const crearMensaje = retornar => {
  return `mutation CrearMensaje($fecha: Date!, $usuario: Usuario!, $texto: String, $imagenes: [String], $visto: [Usuario!]) {
      crearMensaje(fecha: $fecha, usuario: $usuario, texto: $texto, imagenes: $imagenes, visto: $visto) {
        id
        ${retornar}
      }
    }`
}

/** 
 * Puede tener:nombre, apellido, username, correo, carrera, chats, fecha_nacimiento, grupos, amigos, publicaciones, likes, comentarios 
 */
export const editarUsuario = retornar => {
  return `mutation EditarUsuario($id: ID!, $nombre: String, $apellido: String, $foto_perfil: String, $username: String, $correo: String, $fecha_nacimiento: Date, $chats: [Chat], $carrera: Carrera, $grupos: [Grupo], $amigos: [Usuario], $publicaciones: [Publicacion], $likes: [Publicacion], $comentarios: [Publicacion]) {
      editarUsuario($id: ID!, nombre: $nombre, apellido: $apellido, foto_perfil: $foto_perfil, username: $username, correo: $correo, fecha_nacimiento: $fecha_nacimiento, chats: $chats, carrera: $carrera, grupos: $grupos, amigos: $amigos, publicaciones: $publicaciones, likes: $likes, comentarios: $comentarios) {
        id
        ${retornar}
      }
    }`
}
/** PuedeTener: nombre, acronimo y alumnos
 */
export const editarCarrera = retornar => {
  return `mutation EditarCarrera($id: ID!, $nombre: String, $acronimo: String, $alumnos: [ID]) {
      editarCarrera($id: ID!, nombre: $nombre, acronimo: $acronimo, alumnos: $alumnos) {
        id
        ${retornar}
      }
    }`
}
/** PuedeTener: usuario, fecha, imagenes, texto, votacion, comentarios y likes
 */
export const editarPublicacion = retornar => {
  return `mutation EditarPublicacion($id: ID!, $usuario: Usuario, $fecha: Date, $imagenes: [String], $texto: String, $votacion: VotacionInput, $comentarios: [Publicacion], $likes: [Usuario]) {
      editarPublicacion($id: ID!, usuario: $usuario, fecha: $fecha, imagenes: $imagenes, texto: $texto, votacion: $votacion, comentarios: $comentarios, likes: $likes) {
        id
        ${retornar}
      }
    }`
}


/* * PuedeTener: pregunta y opciones
 */
export const editarVotacion = retornar => {
  return `mutation EditarVotacion($id: ID!, $pregunta: String, $opciones: [OpcionInput]) {
      editarVotacion($id: ID!, pregunta: $pregunta, opciones: $opciones) {
        id
        ${retornar}
      }
    }`
}
/** PuedeTener: texto y votos
 */
export const editarOpcion = retornar => {
  return `mutation EditarOpcion($id: ID!, $texto: String, $votos: [Usuario]) {
      editarOpcion($id: ID!, texto: $texto, votos: $votos) {
        id
        ${retornar}
      }
    }`
}

/* * PuedeTener: nombre, privacidad, vencimiento, descripcion, chat, admins y miembros
 */
export const editarGrupo = retornar => {
  return `mutation EditarGrupo($id: ID!, $nombre: String, $privacidad: String, $vencimiento: Date, $descripcion: String, $chat: Chat, $admins: [Usuario], $miembros: [Usuario]) {
      editarGrupo($id: ID!, nombre: $nombre, privacidad: $privacidad, vencimiento: $vencimiento, descripcion: $descripcion, chat: $chat, admins: $admins, miembros: $miembros) {
        id
        ${retornar}
      }
    }`
}


/** PuedeTener: usuarios y mensajes
 */
export const editarChat = retornar => {
  return `mutation EditarChat($id: ID!, $usuarios: [Usuario], $mensajes: [Mensaje]) {
      editarChat($id: ID!, usuarios: $usuarios, mensajes: $mensajes) {
        id
        ${retornar}
      }
    }`
}

/** PuedeTener: fecha, usuario, texto, imagenes y visto
 */
export const editarMensaje = retornar => {
  return `mutation EditarMensaje($id: ID!, $fecha: Date, $usuario: Usuario, $texto: String, $imagenes: [String], $visto: [Usuario]) {
      editarMensaje($id: ID!, fecha: $fecha, usuario: $usuario, texto: $texto, imagenes: $imagenes, visto: $visto) {
        id
        ${retornar}
      }
    }`
}

export const eliminarUsuario = () => {
  return `mutation EliminarUsuario($id: ID!) {
      eliminarUsuario(id: $id)
    }`
}

export const eliminarCarrera = () => {
  return `mutation EliminarCarrera($id: ID!) {
      eliminarCarrera(id: $id)
    }`
}

export const eliminarPublicacion = () => {
  return `mutation EliminarPublicacion($id: ID!) {
      eliminarPublicacion(id: $id)
    }`
}

export const eliminarVotacion = () => {
  return `mutation EliminarVotacion($id: ID!) {
      eliminarVotacion(id: $id)
    }`
}

export const eliminarOpcion = () => {
  return `mutation EliminarOpcion($id: ID!) {
      eliminarOpcion(id: $id)
    }`
}

export const eliminarGrupo = () => {
  return `mutation EliminarGrupo($id: ID!) {
      eliminarGrupo(id: $id)
    }`
}

export const eliminarChat = () => {
  return `mutation EliminarChat($id: ID!) {
      eliminarChat(id: $id)
    }`
}

export const eliminarMensaje = () => {
  return `mutation EliminarMensaje($id: ID!) {
      eliminarMensaje(id: $id)
    }`
}

/* const Nombre =  {
  //  de creación
  crearUsuario: `
      mutation CrearUsuario($nombre: String!, $apellido: String!, $username: String!, $correo: String!, $carrera: ID!) {
        crearUsuario(nombre: $nombre, apellido: $apellido, username: $username, correo: $correo, carrera: $carrera) {
          id
        }
      }
    `,
  crearCarrera: `
      mutation CrearCarrera($nombre: String!, $acronimo: String!) {
        crearCarrera(nombre: $nombre, acronimo: $acronimo) {
          id
        }
      }
    `,
  crearPublicacion: `
      mutation CrearPublicacion($usuario: ID!, $fecha: Date!, $texto: String) {
        crearPublicacion(usuario: $usuario, fecha: $fecha, texto: $texto) {
          id
        }
      }
    `,
  crearVotacion: `
      mutation CrearVotacion($pregunta: String!, $opciones: [OpcionInput]!) {
        crearVotacion(pregunta: $pregunta, opciones: $opciones) {
          id
        }
      }
    `,
  crearOpcion: `
      mutation CrearOpcion($texto: String!) {
        crearOpcion(texto: $texto) {
          id
        }
      }
    `,
  crearGrupo: `
      mutation CrearGrupo($nombre: String!, $privacidad: String!, $vencimiento: Date, $descripcion: String, $chat: Chat!, $admins: [ID!]!) {
        crearGrupo(nombre: $nombre, privacidad: $privacidad, vencimiento: $vencimiento, descripcion: $descripcion, chat: $chat, admins: $admins) {
          id
        }
      }
    `,
  crearChat: `
      mutation CrearChat($usuarios: [ID!]!, $mensajes: [Mensaje]) {
        crearChat(usuarios: $usuarios, mensajes: $mensajes) {
          id
        }
      }
    `,
  crearMensaje: `
      mutation CrearMensaje($fecha: Date!, $usuario: ID!, $texto: String, $imagenes: [String], $visto: [ID!]) {
        crearMensaje(fecha: $fecha, usuario: $usuario, texto: $texto, imagenes: $imagenes, visto: $visto) {
          id
        }
      }
    `,
  editarUsuario: `
    mutation EditarUsuario($id: ID!, $nombre: String, $apellido: String, $foto_perfil: String, $username: String, $correo: String, $fecha_nacimiento: Date, $chats: [Chat], $carrera: Carrera, $grupos: [Grupo], $amigos: [Usuario], $publicaciones: [Publicacion], $likes: [Publicacion], $comentarios: [Publicacion]) {
      editarUsuario(id: $id, nombre: $nombre, apellido: $apellido, foto_perfil: $foto_perfil, username: $username, correo: $correo, fecha_nacimiento: $fecha_nacimiento, chats: $chats, carrera: $carrera, grupos: $grupos, amigos: $amigos, publicaciones: $publicaciones, likes: $likes, comentarios: $comentarios){
        id
      }
    }`,

  editarCarra: `mutation EditarCarrera($id: ID!, $nombre: String, $acronimo: String, $alumnos: [Usuario]) {
      editarCarrera(id: $id, nombre: $nombre, acronimo: $acronimo, alumnos: $alumnos){
        id
      }
    }`,

  editarPublicacion: `mutation EditarPublicacion($id: ID!, $usuario: Usuario, $fecha: Date, $imagenes: [String], $texto: String, $votacion: VotacionInput, $comentarios: [Publicacion], $likes: [Usuario]) {
      editarPublicacion(id: $id, usuario: $usuario, fecha: $fecha, imagenes: $imagenes, texto: $texto, votacion: $votacion, comentarios: $comentarios, likes: $likes){
        id
      }
    }`,

  editarVotacion: `mutation EditarVotacion($id: ID!, $pregunta: String, $opciones: [OpcionInput]) {
      editarVotacion(id: $id, pregunta: $pregunta, opciones: $opciones){
        id
      }
    }`,

  editarOpcion: `mutation EditarOpcion($id: ID!, $texto: String, $votos: [Usuario]) {
      editarOpcion(id: $id, texto: $texto, votos: $votos){
        id
      }
    }`,

  editarGrupo: `mutation EditarGrupo($id: ID!, $nombre: String, $privacidad: String, $vencimiento: Date, $descripcion: String, $chat: Chat, $admins: [Usuario], $miembros: [Usuario]) {
      editarGrupo(id: $id, nombre: $nombre, privacidad: $privacidad, vencimiento: $vencimiento, descripcion: $descripcion, chat: $chat, admins: $admins, miembros: $miembros){
        id
      }
    }`,

  editarChat: `mutation EditarChat($id: ID!, $usuarios: [Usuario], $mensajes: [Mensaje]) {
      editarChat(id: $id, usuarios: $usuarios, mensajes: $mensajes){
        id
      }
    }`,

  editarMensaje: `mutation EditarMensaje($id: ID!, $fecha: Date, $usuario: Usuario, $texto: String, $imagenes: [String], $visto: [Usuario]) {
      editarMensaje(id: $id, fecha: $fecha, usuario: $usuario, texto: $texto, imagenes: $imagenes, visto: $visto){
        id
      }
    }`,

  eliminarUsuario: `
      mutation EliminarUsuario($id: ID!) {
        eliminarUsuario(id: $id)
      }
    `,
  eliminarCarrera: `
      mutation EliminarCarrera($id: ID!) {
        eliminarCarrera(id: $id)
      }
    `,
  eliminarPublicacion: `
      mutation EliminarPublicacion($id: ID!) {
        eliminarPublicacion(id: $id)
      }
    `,
  eliminarVotacion: `
      mutation EliminarVotacion($id: ID!) {
        eliminarVotacion(id: $id)
      }
    `,
  eliminarOpcion: `
      mutation EliminarOpcion($id: ID!) {
        eliminarOpcion(id: $id)
      }
    `,
  eliminarGrupo: `
      mutation EliminarGrupo($id: ID!) {
        eliminarGrupo(id: $id)
      }
    `,
  eliminarChat: `
      mutation EliminarChat($id: ID!) {
        eliminarChat(id: $id)
      }
    `,
  eliminarMensaje: `
      mutation EliminarMensaje($id: ID!) {
        eliminarMensaje(id: $id)
      }
    `
}
 */
