'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaImage, 
  FaFileAlt, 
  FaTimes, 
  FaUpload,
  FaSpinner
} from 'react-icons/fa';

interface CreatePostProps {
  userId: number;
  onPostCreated: () => void;
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ userId, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (images.length + selectedFiles.length > 5) {
      alert('Vous ne pouvez pas ajouter plus de 5 images');
      return;
    }

    setUploadingImages(true);
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('type', 'image');

      const response = await fetch('/api/mur/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImages(prev => [...prev, ...result.files]);
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors du téléchargement des images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Erreur lors du téléchargement des images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (documents.length + selectedFiles.length > 5) {
      alert('Vous ne pouvez pas ajouter plus de 5 documents');
      return;
    }

    setUploadingDocuments(true);
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('type', 'document');

      const response = await fetch('/api/mur/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments(prev => [...prev, ...result.files]);
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors du téléchargement des documents');
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Erreur lors du téléchargement des documents');
    } finally {
      setUploadingDocuments(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && images.length === 0 && documents.length === 0) {
      alert('Veuillez ajouter du contenu, des images ou des documents');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/mur/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          images,
          documents,
          userId,
        }),
      });

      if (response.ok) {
        setContent('');
        setImages([]);
        setDocuments([]);
        onPostCreated();
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la création de la publication');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Erreur lors de la création de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <form onSubmit={handleSubmit}>
        {/* Text Content */}
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partagez quelque chose avec la communauté..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={4}
          />
        </div>

        {/* Uploaded Images Preview */}
        {images.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Images ({images.length}/5):</h4>
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => {
                // Calculate width based on number of images
                let widthClass = 'w-full'; // Default for 1 image
                if (images.length === 2) widthClass = 'w-1/2';
                else if (images.length === 3) widthClass = 'w-1/3';
                else if (images.length === 4) widthClass = 'w-1/4';
                else if (images.length === 5) widthClass = 'w-1/5';
                
                return (
                                     <div key={index} className={`relative group ${widthClass} min-w-0`}>
                     <img
                       src={image.url}
                       alt={image.name}
                       className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
                       onLoad={(e) => {
                         console.log('✅ Preview image loaded successfully:', image.url);
                         e.currentTarget.style.backgroundColor = 'transparent';
                       }}
                       onError={(e) => {
                         console.error('❌ Preview image failed to load:', image.url);
                         e.currentTarget.style.display = 'none';
                       }}
                       style={{ 
                         minHeight: '192px'
                       }}
                     />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <FaTimes size={12} />
                    </button>
                                         <div className="absolute bottom-1 left-1 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                       {index + 1}/{images.length}
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Uploaded Documents Preview */}
        {documents.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Documents ({documents.length}/5):</h4>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <FaFileAlt className="text-blue-500" size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={images.length >= 5 || uploadingImages}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImages ? (
                <FaSpinner className="animate-spin" size={16} />
              ) : (
                <FaImage size={16} />
              )}
              <span>Images ({images.length}/5)</span>
            </button>
            
            <button
              type="button"
              onClick={() => documentInputRef.current?.click()}
              disabled={documents.length >= 5 || uploadingDocuments}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingDocuments ? (
                <FaSpinner className="animate-spin" size={16} />
              ) : (
                <FaFileAlt size={16} />
              )}
              <span>Documents ({documents.length}/5)</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && images.length === 0 && documents.length === 0)}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" size={16} />
                <span>Publication...</span>
              </>
            ) : (
              <>
                <FaUpload size={16} />
                <span>Publier</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={documentInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleDocumentUpload}
        className="hidden"
      />
    </motion.div>
  );
};

export default CreatePost;
