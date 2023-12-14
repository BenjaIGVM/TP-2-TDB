import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import styles from "@/styles/Home.module.css";
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import Home from "@/components/Home";
import EditModal from "@/components/EditModal"; // Reemplaza esto con la ruta correcta al componente de modal de edición
import ConfirmationModal from "@/components/ConfirmationModal";

const CheckReportes = () => {
    const [reportes, setReportes] = useState([]);
    const [usuarioReportado, setUsuarioReportado] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedReporte, setSelectedReporte] = useState(null);

    const ALL_REPORTES = gql`
    query all_reportes {
        all_reportes {
            id
            titulo
            usuario
            fecha
            descripcion
            tipo
            resolucion
        }
    }
    `;

    const BUSCAR_USUARIO_ID = gql`
    query buscarUsuarioId($id: ID!) {
        buscarUsuarioId(id: $id) {
            id
            nombre
            apellido
            email
            username
            }
        }
    `;

    const openEditModal = (reporte) => {
        setSelectedReporte(reporte);
        setIsEditModalOpen(true);
        // Llamamos a la consulta para obtener la información del usuario reportado
    };

    const closeEditModal = () => {
        setSelectedReporte(null);
        setIsEditModalOpen(false);
    };

    const { loading, data } = useQuery(ALL_REPORTES);

    console.log("data", data);

    if (loading) {
        return <p>Cargando reportes...</p>;
    }

    return (
        <div>
            <div className="z-10 mt-[80px] w-[100vw] max-w-[100vw] text-current lg:w-[55vw] lg:max-w-[90vw] lg:px-10">
                <div className="mt-4 flex-col items-center justify-between m-4 rounded-lg bg-foreground text-[5vw] font-bold sm:text-[18px]">
                    <div className="">
                        <div className="page-container bg-foreground rounded-[20px] w-12/12">
                            <div className="p-6">
                                <table className="w-full border-collapse table-auto">
                                    <thead>
                                        <tr>
                                            <th className="border p-2">Título</th>
                                            <th className="border p-2">Descripción</th>
                                            <th className="border p-2">Fecha</th>
                                            <th className="border p-2">tipo</th>
                                            <th className="border p-2">Resolución</th>
                                            <th className="border p-2">Usuario</th>
                                            <th className="border p-2">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.all_reportes.map((reporte) => (
                                            <tr key={reporte.id}>
                                                <td className="border p-2">{reporte.titulo}</td>
                                                <td className="border p-2">{reporte.descripcion}</td>
                                                <td className="border p-2">{new Date(reporte.fecha).toLocaleDateString()}</td>
                                                <td className="border p-2">{reporte.tipo}</td>
                                                <td className="border p-2">{reporte.resolucion ? reporte.resolucion : "Pendiende por resolución "}</td>
                                                <td className="border p-2">{reporte.usuario}</td>
                                                <td className="border p-2">
                                                    <AiOutlineEdit onClick={() => openEditModal(reporte)} className="text-2xl cursor-pointer"/>
                                                    <ConfirmationModal reporteId={reporte.id} onConfirm={() => console.log("Eliminando reporte...")} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {isEditModalOpen && (
                                        <EditModal reporte={selectedReporte} closeModal={closeEditModal} />
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CheckReportes.getLayout = function getLayout(page, screenWidth) {
    return <Home screenWidth={screenWidth}>{page}</Home>;
};

export default CheckReportes;
