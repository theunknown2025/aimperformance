'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaRegHeart, 
  FaComment, 
  FaEdit, 
  FaTrash, 
  FaDownload,
  FaEye,
  FaTimes
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PostProps {
  post: {
    id: number;
    content: string;
    user_name: string;
    user_email: string;
    created_at: string;
    updated_at: string;
    likes_count: number;
    comments_count: number;
    images: Array<{
      id: number;
      image_url: string;
      image_name: string;
      image_size: number;
    }>;
    documents: Array<{
      id: number;
      document_url: string;
      document_name: string;
      document_size: number;
      document_type: string;
    }>;
  };
  currentUserId: number;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onEdit: (postId: number, content: string) => void;
  onDelete: (postId: number) => void;
  isLiked: boolean;
}

const Post: React.FC<PostProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onEdit,
  onDelete,
  isLiked
}) => {
  // Debug logging
  console.log('📝 Post component rendered:', {
    postId: post.id,
    content: post.content.substring(0, 50),
    imagesCount: post.images?.length || 0,
    images: post.images?.map(img => ({ url: img.image_url, name: img.image_name }))
  });

  // Log image URLs for debugging
  if (post.images && post.images.length > 0) {
    console.log('🖼️ Image URLs in this post:');
    post.images.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.image_url}`);
      console.log(`     Name: ${img.image_name}`);
      console.log(`     Size: ${(img.image_size / 1024).toFixed(1)} KB`);
    });
  }
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEdit(post.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const isOwner = post.user_email === 'bboslama@gmail.com'; // Replace with actual user check

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6"
      >
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {post.user_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.user_name}</h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { 
                  addSuffix: true, 
                  locale: fr 
                })}
                {post.updated_at !== post.created_at && ' (modifié)'}
              </p>
            </div>
          </div>
          
          {/* Edit/Delete Actions */}
          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                title="Modifier"
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Supprimer"
              >
                <FaTrash size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="mb-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Modifier votre publication..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          )}
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Images ({post.images.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {post.images.map((image, index) => {
                // Calculate width based on number of images
                let widthClass = 'w-full'; // Default for 1 image
                if (post.images.length === 2) widthClass = 'w-1/2';
                else if (post.images.length === 3) widthClass = 'w-1/3';
                else if (post.images.length === 4) widthClass = 'w-1/4';
                else if (post.images.length === 5) widthClass = 'w-1/5';
                
                                 return (
                   <div key={image.id} className={`relative group ${widthClass} min-w-0`}>
                     <img
                       src={image.image_url}
                       alt={image.image_name}
                       className="w-full h-48 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 bg-gray-50"
                       onClick={() => handleImageClick(image.image_url)}
                       onLoad={(e) => {
                         console.log('✅ Image loaded successfully:', image.image_url);
                         e.currentTarget.style.backgroundColor = 'transparent';
                       }}
                       onError={(e) => {
                         console.error('❌ Image failed to load:', image.image_url);
                         e.currentTarget.style.borderColor = '#ef4444';
                         e.currentTarget.style.backgroundColor = '#fee2e2';
                         e.currentTarget.style.display = 'flex';
                         e.currentTarget.style.alignItems = 'center';
                         e.currentTarget.style.justifyContent = 'center';
                         e.currentTarget.style.color = '#dc2626';
                         e.currentTarget.style.fontSize = '14px';
                         e.currentTarget.textContent = 'Image non disponible';
                       }}
                       style={{ 
                         minHeight: '192px',
                         display: 'block',
                         maxWidth: '100%'
                       }}
                     />
                                         {/* Hover overlay for eye icon - removed black background */}
                     <div className="absolute inset-0 bg-transparent group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center pointer-events-none">
                       <FaEye className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                     </div>
                    {/* Image counter */}
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {index + 1}/{post.images.length}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Documents */}
        {post.documents && post.documents.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Documents joints:</h4>
            <div className="space-y-2">
              {post.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <FaDownload className="text-blue-500" size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{doc.document_name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(doc.document_size)} • {doc.document_type}
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.document_url}
                    download
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Télécharger
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              {isLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
              <span className="text-sm font-medium">{post.likes_count}</span>
            </button>
            
            <button
              onClick={() => onComment(post.id)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FaComment size={18} />
              <span className="text-sm font-medium">{post.comments_count}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            {/* Close button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <FaTimes size={24} />
            </button>
            
                         {/* Image */}
             <img
               src={selectedImage}
               alt="Full size"
               className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl bg-gray-900"
               onClick={(e) => e.stopPropagation()}
               onLoad={() => {
                 console.log('✅ Modal image loaded successfully:', selectedImage);
               }}
               onError={(e) => {
                 console.error('❌ Modal image failed to load:', selectedImage);
                 e.currentTarget.style.display = 'none';
               }}
             />
            
            {/* Image info */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
              <p className="text-sm">Cliquez en dehors de l'image pour fermer</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
