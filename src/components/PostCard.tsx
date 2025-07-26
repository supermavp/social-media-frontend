import React, { useState } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import type { Post } from '../services/publicationService';

interface PostCardProps {
    key: number;
    post: Post;
    onLike: (postId: number) => void;
    likedByUser: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, likedByUser }) => {

    const [isLiked, setIsLiked] = useState(likedByUser);
    const [likeCount, setLikeCount] = useState(post.likeCount);

    const handleLikeClick = () => {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        onLike(post.id);
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        
        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(date);
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 max-w-lg mx-auto">
            <h5 className="text-2xl font-bold text-gray-800 mb-3">Creado por {post.user.name} {post.user.lastName}</h5>
            <p className="text-gray-700 text-base mb-4">{post.content}</p>

            <div className="flex items-center space-x-2">
                <button
                    onClick={handleLikeClick}
                    className="text-red-500 hover:text-red-600 focus:outline-none transition-colors duration-200"
                    aria-label={isLiked ? "Quitar me gusta" : "Dar me gusta"}
                >
                    {isLiked ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
                </button>
                <div className="w-full flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-lg">{likeCount} Me gusta</span>
                    <small className='text-zinc-500'>{formatDate(post.createdAt)}</small>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
