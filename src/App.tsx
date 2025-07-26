import { useState, useEffect, useCallback } from 'react'

import { authService, type User } from './services/authService';
import { publicationService, type Post, type PublicationQueryDTO } from './services/publicationService';

import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import NewPost from './components/NewPost';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPublications, setIsLoadingPublications] = useState<boolean>(false);

  const loadPublications = useCallback(async (token: string, userId?: number) => {
    setIsLoadingPublications(true);
    setError(null);
    try {
      const queryParams: PublicationQueryDTO = {
        page: 1,
        limit: 10,
        userId: userId, // Ahora puedes pasar el userId si lo necesitas
      };
      const response = await publicationService.getPublications(token, queryParams);
      setPosts(response.publications);
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
      setError('Error al cargar publicaciones. Por favor, inténtalo de nuevo.');
      setPosts([]); // Limpiar en caso de error
    } finally {
      setIsLoadingPublications(false);
    }
  }, []);

  useEffect(() => {
    const initializeAppData = async () => {
      // 1. Verificar el estado de autenticación
      const storedToken = localStorage.getItem('token');
      let tokenToUse: string | null = null;
      let authenticated = false;
      let user: User | null = null;

      if (storedToken) {
        try {
          const { access_token } = JSON.parse(storedToken);
          const userData = await authService.getAuthenticatedUser(access_token);
          if (userData) {
            authenticated = true;
            tokenToUse = access_token;
            user = userData;
          } else {
            // Token inválido o expirado, limpiar
            localStorage.removeItem('token');
            setError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          }
        } catch (parseError) {
          // Error al parsear el JSON del token
          console.error("Error al parsear token del localStorage:", parseError);
          localStorage.removeItem('token');
          setError('Formato de token inválido. Inicia sesión de nuevo.');
        }
      }

      // Actualizar estados de autenticación
      setIsAuthenticated(authenticated);
      setAccessToken(tokenToUse);
      setCurrentUser(user);

      // 2. Cargar publicaciones SOLO SI la autenticación fue exitosa
      if (authenticated && tokenToUse) {
        // Llama a loadPublications con el token y el ID de usuario obtenidos
        loadPublications(tokenToUse, user?.id);
      } else {
        setPosts([]); // Limpiar si no hay autenticación
      }
    };

    initializeAppData();
  }, [loadPublications]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    console.log(`Attempting login for: ${email}`);
    try {
      const { access_token, type } = await authService.login(email, password);
      if (access_token) {
        localStorage.setItem('token', JSON.stringify({ access_token, type }));
        setIsAuthenticated(true);
        setAccessToken(access_token);
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAccessToken(null);
  }

  const handlePostLike = async (publicationId: number) => {
    if (currentUser && accessToken) {
      await publicationService.createLike(currentUser.id, publicationId, accessToken);
      loadPublications(accessToken, currentUser.id);
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePublication = async (content: string) => {
    if (currentUser && accessToken) {
      await publicationService.newPublication(content, currentUser?.id, accessToken);
      loadPublications(accessToken, currentUser.id);
      handleCloseModal();
    }
  }

  return (
    <div>
      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} loading={loading} error={error} />
      ) : (
        <div>
          <Navbar onLogout={handleLogout} onNewPostCard={handleOpenModal} currentUser={currentUser}></Navbar>
          <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Publicaciones Recientes</h1>
            {isLoadingPublications ? (
              <p className="text-center text-blue-500">Cargando publicaciones...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : posts.length > 0 ? (
              <div className="space-y-6"> {/* Puedes añadir un espacio entre PostCards */}
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handlePostLike}
                    likedByUser={post.hasLiked}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No hay publicaciones disponibles.</p>
            )}
          </div>
          <NewPost isOpen={isModalOpen} onClose={handleCloseModal} onCreate={handleCreatePublication} />
        </div>
      )}
    </div>
  );
}

export default App
