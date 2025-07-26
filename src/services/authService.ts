interface LoginResponse {
    access_token: string;
    type: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    lastName?: string;
    role?: string;
    status?: string;
}

const API_BASE_URL = 'http://localhost:3000';

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error la inicia sesion');
            }

            const data: LoginResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error en authService login:', error);
            throw error;
        }
    },
    getAuthenticatedUser: async (token: string): Promise<User | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData: User = await response.json();
                console.log('Datos de usuario obtenidos:', userData);
                return userData;
            } else if (response.status === 401 || response.status === 403) {
                console.warn('Token inválido o expirado detectado por el backend.');
                return null;
            } else {
                const errorData = await response.json();
                console.error('Error al verificar token:', response.status, errorData.message);
                return null;
            }
        } catch (error) {
            console.error('Error en red al intentar verificar el token:', error);
            return null;
        }
    }
}