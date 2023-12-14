import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { CgToday } from 'react-icons/cg';

const CrearReporte = ({ usuarios, closeModal, onReporteCreado, idElemento, idUsuarioActual }) => {
    const [nuevoReporte, setNuevoReporte] = useState({
        titulo: '',
        usuario: idUsuarioActual,
        tipo: '',
        descripcion: '',
        fecha: new Date().toLocaleDateString('en-CA'), // Obtener la fecha actual en formato "AAAA-MM-DD"
        id_elemento: idElemento,
    });

    const CREAR_REPORTE = gql`
        mutation crearReporte($titulo: String!, $usuario: ID!, $tipo: String!, $descripcion: String!, $fecha: Date!, $id_elemento: String) {
            crearReporte(titulo: $titulo, usuario: $usuario, tipo: $tipo, descripcion: $descripcion, fecha: $fecha, id_elemento: $id_elemento) {
                id
                titulo
                usuario
                fecha
                descripcion
                tipo
                id_elemento
            }
        }
    `;

    const [crearReporte] = useMutation(CREAR_REPORTE);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoReporte((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await crearReporte({
                variables: {
                    titulo: nuevoReporte.titulo,
                    usuario: nuevoReporte.usuario,
                    tipo: "Publicacion",
                    descripcion: nuevoReporte.descripcion,
                    fecha: nuevoReporte.fecha,
                    id_elemento: nuevoReporte.id_elemento,
                },
            });

            // Puedes realizar alguna acción después de crear el reporte, como mostrar una notificación
            console.log('Reporte creado:', data.crearReporte);

            // Cerrar el modal después de crear
            closeModal();
            onReporteCreado();
        } catch (error) {
            console.error('Error al crear el reporte:', error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-foreground p-8 rounded-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Crear Reporte</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="titulo" className="block text-gray-300 font-bold">
                            Título:
                        </label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={nuevoReporte.titulo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="usuario" className="block text-gray-300 font-bold">
                            Usuario:
                        </label>
                        <p className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400">
                            {nuevoReporte.usuario}
                        </p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tipo" className="block text-gray-300 font-bold">
                            Tipo:
                        </label>
                        {/* <select
                            id="tipo"
                            name="tipo"
                            value={nuevoReporte.tipo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400"
                            required
                        >
                            <option value="">Seleccione un tipo</option>
                            {tiposReporte.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select> */}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="descripcion" className="block text-gray-300 font-bold">
                            Descripción:
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={nuevoReporte.descripcion}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Crear Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearReporte;
