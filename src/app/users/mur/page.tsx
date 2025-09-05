'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaBell, FaRss, FaShareAlt, FaSpinner } from 'react-icons/fa';
import CreatePost from '../../../components/CreatePost';
import Post from '../../../components/Post';
import Comments from '../../../components/Comments';

interface PostData {
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
}

const MurPage: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<number | null>(null);
  
  // Mock user data - replace with actual user session
  const currentUserId = 3; // Using existing user ID from database
  const currentUserEmail = 'bboslama@gmail.com'; // Using existing user email from database

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mur/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        
        // Check which posts the current user has liked
        const likedSet = new Set<number>();
        for (const post of data.posts) {
          const likeResponse = await fetch(`/api/mur/likes?postId=${post.id}&userId=${currentUserId}`);
          if (likeResponse.ok) {
            const likeData = await likeResponse.json();
            if (likeData.liked) {
              likedSet.add(post.id);
            }
          }
        }
        setLikedPosts(likedSet);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch('/api/mur/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userId: currentUserId,
          type: 'post',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likes_count: data.liked 
                    ? post.likes_count + 1 
                    : post.likes_count - 1 
                }
              : post
          )
        );
        
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = (postId: number) => {
    setShowComments(postId);
  };

  const handleEditPost = async (postId: number, content: string) => {
    try {
      const response = await fetch('/api/mur/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content,
          userId: currentUserId,
        }),
      });

      if (response.ok) {
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { ...post, content, updated_at: new Date().toISOString() }
              : post
          )
        );
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la modification de la publication');
      }
    } catch (error) {
      console.error('Error editing post:', error);
      alert('Erreur lors de la modification de la publication');
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) return;

    try {
      const response = await fetch(`/api/mur/posts?postId=${postId}&userId=${currentUserId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(prev => prev.filter(post => post.id !== postId));
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la suppression de la publication');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Erreur lors de la suppression de la publication');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FaNewspaper className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mur</h1>
              <p className="text-gray-600">Partagez vos actualités et mises à jour avec la communauté</p>
            </div>
          </div>
        </motion.div>

        {/* Create Post Section */}
        <CreatePost userId={currentUserId} onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex items-center space-x-3">
              <FaSpinner className="animate-spin text-green-500" size={24} />
              <span className="text-gray-600">Chargement des publications...</span>
            </div>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaNewspaper className="text-green-500 text-3xl" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aucune publication pour le moment
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Soyez le premier à partager quelque chose avec la communauté ! 
              Créez une publication ci-dessus pour commencer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaBell className="text-blue-500 text-lg" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">Recevez des alertes en temps réel</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaRss className="text-purple-500 text-lg" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Flux d'actualités</h3>
                <p className="text-sm text-gray-600">Suivez les dernières nouvelles</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaShareAlt className="text-orange-500 text-lg" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Partage</h3>
                <p className="text-sm text-gray-600">Partagez des informations importantes</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onLike={handleLike}
                onComment={handleComment}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                isLiked={likedPosts.has(post.id)}
              />
            ))}
          </div>
        )}

        {/* Comments Modal */}
        <Comments
          postId={showComments || 0}
          currentUserId={currentUserId}
          currentUserEmail={currentUserEmail}
          isVisible={showComments !== null}
          onClose={() => setShowComments(null)}
        />
      </div>
    </div>
  );
};

export default MurPage;
