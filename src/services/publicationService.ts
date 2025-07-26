import type { User } from "./authService";

const API_BASE_URL = 'http://localhost:3000';

export interface PublicationQueryDTO {
    page?: number;
    limit?: number;
    userId?: number; // Filtro por ID del autor
}

export interface Post {
    id: number;
    content: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    hasLiked: boolean;
    user: User;
}

export interface PublicationPaginatedResponseDTO {
    publications: Post[];
    page: number;
    limit: number;
    total: number;
}

export const publicationService = {
    getPublications: async (token: string, queryParams: PublicationQueryDTO) => {
        try {
            const urlParams = new URLSearchParams();

            urlParams.append('page', (queryParams.page || 1).toString());
            urlParams.append('limit', (queryParams.limit || 10).toString());

            if (queryParams.userId) {
                urlParams.append('userId', queryParams.userId.toString());
            }

            const url = `${API_BASE_URL}/publication?${urlParams.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Incluye el token de autorización
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener publicaciones');
            }

            const data: PublicationPaginatedResponseDTO = await response.json();
            return data;
        } catch (error) {
            console.error('Error en publicationService.findAllPublications:', error);
            throw error;
        }
    },
    newPublication: async (content: string, userId: number, token: string, imageUrl?: string) => {
        try {
            const url = `${API_BASE_URL}/publication`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Incluye el token de autorización
                },
                body: JSON.stringify({ content, imageUrl, userId })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar la publicacion');
            }
            await response.json();
        } catch (error) {
            console.error('Error en publicationService.createPublication:', error);
            throw error;
        }
    },
    createLike: async (userId: number, publicationId: number, token: string) => {
        try {
            const url = `${API_BASE_URL}/publication/${publicationId}/like`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Incluye el token de autorización
                },
                body: JSON.stringify({ userId })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar la publicacion');
            }
        } catch (error) {
            console.error('Error en publicationService.createPublication:', error);
            throw error;
        }
    }
};