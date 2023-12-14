import React, { useState } from 'react';

export default function Modal({ isOpen, onClose, onConfirm, msg }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm();

        setIsLoading(false);
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center  ${isOpen ? 'visible' : 'invisible'}`} >
            <div className="fixed inset-0 bg-background opacity-60"/>
            <div className={`fixed inset-0 flex items-center justify-center`}>
                <div className="bg-background p-4 w-[300px] max-w-[100vw] shadow-2xl rounded-[10px] text-center">

                    <div className="justify-end mt-4">
                        {isLoading ? (
                            <>
                                <h2 className="text-lg font-bold mb-4">Ejecutando cambios...</h2>
                                <svg className="animate-spin h-[30px] w-[30px] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20c3.042 0 5.824-1.135 7.938-3l-2.647-3A7.962 7.962 0 0112 16v4zM20 12a8 8 0 01-8 8v-4c2.206 0 4.2-.9 5.657-2.343l2.647 3z"
                                    />
                                </svg>
                            </>) : (
                            <>
                                <h2 className="text-lg text-accent font-bold mb-4">Advertencia</h2>
                                <p>{msg}</p>
                                <div className='flex justify-end mt-4  mt-[20px]'>
                                    <button className="bg-accent hover:bg-background px-4 py-2 rounded-[10px] font-bold mx-auto" onClick={handleConfirm} >
                                        Confirmar
                                    </button>
                                    <button className="bg-secondary hover:bg-background px-4 py-2 rounded-[10px] font-bold mx-auto" onClick={onClose}>
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
