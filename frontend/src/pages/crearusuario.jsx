import { useState, useEffect } from "react";
import Head from 'next/head';
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";



export default function crearUsuario(screenWidth) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [username, setNombreUsuario] = useState("");
  const [correo, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [carrera, setCarrera] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [apellidoError, setApellidoError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [correoError, setCorreoError] = useState("");
  const [contrasenaError, setContrasenaError] = useState("");
  const { resolvedTheme, setTheme } = useTheme();
  const [fechaError, setFechaError] = useState("");
  const router = useRouter();
  const CREATE_USER = gql`
    mutation{crearUsuario(nombre: "${nombre}",apellido: "${apellido}",username:"${username}",correo: "${correo}", contrasena:"${contrasena}", fecha_nacimiento: "${fecha_nacimiento}", carrera: "${carrera}"){
    id
    nombre
    apellido
    username
    correo
    contrasena
    fecha_nacimiento
  
      }
    }`;
  const GET_CARRERAS = gql`
query {
  all_carreras {
    id
    nombre
  }
}
`;

  const [crearUsuario, { error, reset }] = useMutation(CREATE_USER);
  const { data: carrerasData, loading: carrerasLoading } = useQuery(GET_CARRERAS);
  const validateForm = () => {
    const nameRegex = /\d/;
    if (nameRegex.test(nombre)) {
      setNombreError("El nombre no debe contener números");
      return false;
    }
    if (nameRegex.test(apellido)) {
      setApellidoError("El apellido no debe contener números");
      return false;
    }


    const emailRegex = /^[a-zA-Z0-9._%+-]+@alumnos\.ubiobio\.cl$/i;
    if (!emailRegex.test(correo)) {
      setCorreoError("El correo ingresado no es válido");
      return false;
    }

    if (contrasena.length < 8 || !/[A-Z]/.test(contrasena)) {
      setContrasenaError("La contraseña debe tener al menos 8 caracteres y una letra mayúscula");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      setContrasenaError("La contraseña debe tener al menos 8 caracteres, una mayuscula y un caracter especial");

      return false;
    }
    const birthDate = new Date(fecha_nacimiento);
    const today = new Date();
    const ageDifference = today.getFullYear() - birthDate.getFullYear();
    const hasPassedBirthday =
      today.getMonth() >= birthDate.getMonth() && today.getDate() >= birthDate.getDate();

    if (ageDifference < 17 || (ageDifference === 17 && !hasPassedBirthday)) {
      setFechaError("No cumples con la edad");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNombreError("");
    setApellidoError("");
    setUsernameError("");
    setCorreoError("");
    setContrasenaError("")
    if (!validateForm()) {
      return;
    }

    try {
      const { data } = await crearUsuario({
        variables: {
          nombre,
          apellido,
          username,
          correo,
          contrasena,
          fecha_nacimiento,
        },
      });

      if (data.crearUsuario) {
        router.push("/login");
      }

    } catch (error) {
      if (error.message.includes("Ya existe un usuario con este correo")) {
        setCorreoError("El correo ya está registrado");
      } else if (error.message.includes("El nombre de usuario ya está ocupado")) {
        setUsernameError("El nombre de usuario ya está ocupado");
      } else {
        console.log("Error al crear el usuario:");
      }
    }
  };

  useEffect(() => {
    if (nombreError) {
      const timeoutId = setTimeout(() => {
        setNombreError(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

  }, [nombreError]);
  useEffect(() => {
    if (apellidoError) {
      const timeoutId = setTimeout(() => {
        setApellidoError(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

  }, [apellidoError]);
  useEffect(() => {
    if (correoError) {
      const timeoutId = setTimeout(() => {
        setCorreoError(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

  }, [correoError]);
  useEffect(() => {
    if (contrasenaError) {
      const timeoutId = setTimeout(() => {
        setContrasenaError(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

  }, [contrasenaError]);
  useEffect(() => {
    if (fechaError) {
      const timeoutId = setTimeout(() => {
        setFechaError(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

  }, [fechaError]);
  useEffect(() => {
    if (usernameError) {
      const timeoutId = setTimeout(() => {
        setUsernameError(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

  }, [usernameError]);

  if (carrerasLoading) {
    return <p>Cargando carreras...</p>;
  }

  const carreras = carrerasData ? carrerasData.all_carreras : [];
  return (
    <>
      <div
        className={`z-1 fixed bottom-0 left-0 right-0 top-0 ${resolvedTheme === "light" ? "" : " opacity-70 "
          } 
            bg-background bg-cover bg-fixed`}
      ></div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute top-4 left-4 mb-4">
            <img
              src="/LogoUchat.png"
              alt="Logo UChat"
              className="h-12 w-32 mr-4"
            />
            <div className="text-center">Red social creada para la Universidad del Bio-Bio</div>
          </div>
          <div className="flex justify-center ">
            <div className="z-10  flex-col items-center justify-center rounded-[10px] bg-foreground  w-[30vw] p-4 text-primary shadow-2xl">
            <h1 className="text-2xl font-bold mb-4 bg-foreground mx-auto text-center y self-center">Crear Usuario</h1> 
              <form onSubmit={handleSubmit} className="space-y-4 bg-foreground justify-center items-center flex flex-col">
                <div>
                <div className="flex flex-col mb-2">
                  <label className="text-xl font-bold" htmlFor="nombre" style={{ fontSize: '14px' }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="my-2 w-[25vw] min-w-[400px] rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                    id="nombre"
                    placeholder="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                   </div>
                  {nombreError && <div className="text-red-500">{nombreError}</div>}
                </div>
                <div>
                <div className="flex flex-col mb-2">
                  <label className="text-xl font-bold" htmlFor="apellido" style={{ fontSize: '14px' }}>
                    Apellido
                  </label>
                  <input
                    type="text"
                    className="my-2 w-[25vw] min-w-[400px] rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                    id="apellido"
                    placeholder="apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                  /></div>

                  {apellidoError && <div className="text-red-500">{apellidoError}</div>}
                </div>
                <div>
                <div className="flex flex-col mb-2">
                  <label className="text-xl font-bold" htmlFor="username" style={{ fontSize: '14px' }}>
                   Nombre de usuario 
                  </label>
                  <input
                    type="text"
                    className="my-2  w-[25vw] min-w-[400px]  rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                    id="username"
                    placeholder="nombre de usuario"
                    value={username}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                  />
                  </div>
                  {usernameError && <div className="text-red-500">{usernameError}</div>}
                </div>
                <div>
                <div className="flex flex-col mb-2">
                  <label className="text-xl font-bold" htmlFor="correo" style={{ fontSize: '14px' }}>
                   Correo 
                  </label>
                  <input
                    type="correo"
                    className="my-2  w-[25vw] min-w-[400px]  rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                    placeholder="correo"
                    value={correo}
                    onChange={(e) => setEmail(e.target.value)} required
                  />
                  </div>
                  {correoError && <div className="text-red-500">{correoError}</div>}
                </div>
                <div>
                <div className="flex flex-col mb-2">
                  <label className="text-xl font-bold" htmlFor="contrasena" style={{ fontSize: '14px' }}>
                   Contraseña 
                  </label>
                  <input
                    type="password"
                    className="my-2  w-[25vw] min-w-[400px]  rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                    id="contrasena"
                    placeholder="contrasena"
                    value={contrasena}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  </div>

                  {contrasenaError && <div className="text-red-500">{contrasenaError}</div>}
                </div>
                <div>
                <div className="flex flex-col mb-2">
                  <label className="text-xl font-bold" htmlFor="fecha_nacimiento" style={{ fontSize: '14px' }}>
                   Fecha de nacimiento 
                  </label>
                  <input
                    type="date"
                    className="my-2  w-[25vw] min-w-[400px]  rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                    id="fecha_nacimiento"
                    placeholder="fecha_nacimiento"
                    value={fecha_nacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                  />
                  </div>
                  {fechaError && <div className="text-red-500">{fechaError}</div>}

                </div>
                <div>
                <div className="flex flex-col mb-2">
                  <label className="text-xl font-bold" htmlFor="carrera" style={{ fontSize: '14px' }}>
                  Carrera
                  </label>
                  <select
                    id="carrera"
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    required
                    className="my-2  w-[25vw] min-w-[400px]  rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                  >
                    <option value="">Selecciona una carrera</option>
                    {carreras.map(carrera => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="    w-[25vw] min-w-[400px]   rounded-[10px] bg-accent p-3  font-semibold hover:bg-primary hover:text-background active:bg-background active:text-primary"
                  >
                    Crear usuario
                  </button>
                </div>
              </form>
              <p className="text-center self-center">
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
              </p>
            </div>
          </div>
        </div>
      </div></>
  );
}