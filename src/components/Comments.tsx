'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHeart, 
  FaRegHeart, 
  FaEdit, 
  FaTrash, 
  FaReply,
  FaTimes
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Comment {
  id: number;
  content: string;
  user_name: string;
  user_email: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
}

interface CommentsProps {
  postId: number;
  currentUserId: number;
  currentUserEmail: string;
  isVisible: boolean;
  onClose: () => void;
}

const Comments: React.FC<CommentsProps> = ({
  postId,
  currentUserId,
  currentUserEmail,
  isVisible,
  onClose
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isVisible) {
      fetchComments();
    }
  }, [isVisible, postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/mur/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        
        // Check which comments the current user has liked
        const likedSet = new Set<number>();
        for (const comment of data.comments) {
          const likeResponse = await fetch(`/api/mur/likes?commentId=${comment.id}&userId=${currentUserId}`);
          if (likeResponse.ok) {
            const likeData = await likeResponse.json();
            if (likeData.liked) {
              likedSet.add(comment.id);
            }
          }
        }
        setLikedComments(likedSet);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/mur/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userId: currentUserId,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data.comment]);
        setNewComment('');
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de l\'ajout du commentaire');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Erreur lors de l\'ajout du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch('/api/mur/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          content: editContent.trim(),
          userId: currentUserId,
        }),
      });

      if (response.ok) {
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, content: editContent.trim(), updated_at: new Date().toISOString() }
              : comment
          )
        );
        setEditingComment(null);
        setEditContent('');
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la modification du commentaire');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Erreur lors de la modification du commentaire');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;

    try {
      const response = await fetch(`/api/mur/comments?commentId=${commentId}&userId=${currentUserId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la suppression du commentaire');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Erreur lors de la suppression du commentaire');
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      const response = await fetch('/api/mur/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: commentId, // postId is actually commentId here
          userId: currentUserId,
          type: 'comment',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  likes_count: data.liked 
                    ? comment.likes_count + 1 
                    : comment.likes_count - 1 
                }
              : comment
          )
        );
        
        setLikedComments(prev => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const isOwner = (comment: Comment) => comment.user_email === currentUserEmail;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Commentaires ({comments.length})
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun commentaire pour le moment. Soyez le premier à commenter !
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      {/* Comment Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {comment.user_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{comment.user_name}</p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(comment.created_at), { 
                                addSuffix: true, 
                                locale: fr 
                              })}
                              {comment.updated_at !== comment.created_at && ' (modifié)'}
                            </p>
                          </div>
                        </div>
                        
                        {isOwner(comment) && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(comment)}
                              className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                              title="Modifier"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                              title="Supprimer"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comment Content */}
                      {editingComment === comment.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows={3}
                            placeholder="Modifier votre commentaire..."
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditComment(comment.id)}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                      )}

                      {/* Comment Actions */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center space-x-2 transition-colors ${
                            likedComments.has(comment.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          {likedComments.has(comment.id) ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                          <span className="text-sm font-medium">{comment.likes_count}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Comment Form */}
            <div className="p-6 border-t border-gray-200">
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <FaReply size={14} />
                    <span>{isSubmitting ? 'Envoi...' : 'Commenter'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Comments;
