import React, { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (content: string) => void;
}

const NewPost: React.FC<ModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [content, setContent] = useState<string>('');

    if (!isOpen) {
        return null;
    }

    const handleCreate = () => {
        onCreate(content);
        setContent('');
    };

    const handleCancel = () => {
        setContent('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-100 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-6 transform transition-all duration-300 scale-100">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Crear Nueva Publicación</h2>

                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    placeholder="Escribe el contenido de tu publicación aquí..."
                    rows={5}
                ></textarea>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={handleCreate}
                        disabled={!content.trim()}
                    >
                        Crear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewPost;