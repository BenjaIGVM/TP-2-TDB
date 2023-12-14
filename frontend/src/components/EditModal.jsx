import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const EditModal = ({ reporte, closeModal, onSave }) => {

  const [editReporteData, setEditReporteData] = useState({
    id: reporte.id,
    usuario: reporte.usuario,
    titulo: reporte.titulo,
    fecha: reporte.fecha,
    descripcion: reporte.descripcion,
    tipo: reporte.tipo,
    resolucion: reporte.resolucion || '',
  });

  const EDITAR_REPORTE = gql`
    mutation editarReporte($id: ID!, $usuario: ID!,$titulo: String ,  $tipo: String!, $descripcion: String!, $fecha: Date!, $resolucion: String) {
      editarReporte(id: $id, usuario: $usuario, titulo: $titulo, descripcion: $descripcion, tipo: $tipo, fecha: $fecha, resolucion: $resolucion ) {
        id
      }
    }
  `;

  const [editarReporte, {error: editarError }] = useMutation(EDITAR_REPORTE);


  console.log("error" , editarError)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditReporteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log(editReporteData);
      editarReporte({
        variables: {
          id: editReporteData.id,
          usuario: editReporteData.usuario,
          titulo: editReporteData.titulo,
          descripcion: editReporteData.descripcion,
          tipo: editReporteData.tipo,
          fecha: editReporteData.fecha,
          resolucion: editReporteData.resolucion,
        },
      }).then((data) => {
        console.log('Reporte editado:', data.editarReporte);
      }).catch((error) => {
        console.error('Error al editar el reporte:', error.message);
      });

      // Cerrar el modal después de editar
      closeModal();
      onSave();
    } catch (error) {
      console.error('Error al editar el reporte:', error.message);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-foreground p-8 rounded-lg max-w-lg w-full">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Editar Reporte</h2>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="usuario" className="block text-gray-300 font-bold">
                Usuario:
              </label>
              <input
                id="usuario"
                name="usuario"
                value={editReporteData.usuario}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="titulo" className="block text-gray-300 font-bold">
                Título:
              </label>
              <input
                id="titulo"
                name="titulo"
                value={editReporteData.titulo}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fecha" className="block text-gray-300 font-bold">
                Fecha:
              </label>
              <input
                id="fecha"
                name="fecha"
                value={editReporteData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="descripcion" className="block text-gray-300 font-bold">
                Descripción:
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={editReporteData.descripcion}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="tipo" className="block text-gray-300 font-bold">
                Tipo:
              </label>
              <input
                id="tipo"
                name="tipo"
                value={editReporteData.tipo}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="resolucion" className="block text-gray-300 font-bold">
                Resolución:
              </label>
              <textarea
                id="resolucion"
                name="resolucion"
                value={editReporteData.resolucion}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-400"
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
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
