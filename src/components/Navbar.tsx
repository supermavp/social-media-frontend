import type { User } from "../services/authService";
import { AiOutlineLogout, AiFillPlusCircle } from 'react-icons/ai';

interface NavbarProps {
    onLogout: () => void;
    onNewPostCard: () => void;
    currentUser?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, onNewPostCard, currentUser }) => {
    return (
        <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <a href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                    Mi App Social
                </a>
                {/* Aquí podrías añadir otros enlaces de navegación si los tuvieras */}
                {/* <a href="/posts" className="text-gray-600 hover:text-blue-600">Publicaciones</a> */}
                {/* <a href="/profile" className="text-gray-600 hover:text-blue-600">Perfil</a> */}
            </div>

            <div className="flex items-center space-x-4">
                {currentUser && (
                    <span className="text-gray-700 font-medium hidden sm:block">
                        Hola, <span className="text-blue-600">{currentUser.name} {currentUser.lastName}</span>
                    </span>
                )}
                <button
                    onClick={onNewPostCard}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200">
                    <AiFillPlusCircle size={24} />
                </button>
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                >
                    <AiOutlineLogout size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;