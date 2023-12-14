import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { gql, useMutation } from "@apollo/client";

const ConfirmationModal = ({ reporteId ,onConfirm }) => {
    const [isOpen, setIsOpen] = useState(false);

    const DELETE_REPORTE = gql`
    mutation eliminarReporte( $id: ID!) {
        eliminarReporte(id: $id) {
            id
        }
    }
    `;

    const [eliminarReporte ] = useMutation(DELETE_REPORTE);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleConfirm = async () => {
        await eliminarReporte({
            variables: {
                id: reporteId
            },
        });
        onConfirm(); // Ejecutar la función que se pasa como prop
        console.log("Reporte eliminado:", reporteId);
        handleClose(); // Cerrar el modal después de la confirmación
    };

    return (
        <div>
            {/* Botón o icono que abre el modal de confirmación */}
            <AiOutlineDelete onClick={handleOpen} className="text-2xl cursor-pointer" />

            {/* Modal de confirmación */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-foreground p-8 rounded-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">Confirmación</h2>
                        <p className="mb-4">¿Estás seguro que deseas eliminar este reporte?</p>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                onClick={handleClose}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                type="button"
                                className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfirmationModal;
