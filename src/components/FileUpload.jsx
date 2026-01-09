import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, File } from 'lucide-react';
import { uploadAvatar, uploadAttachment } from '../api';

const FileUpload = ({ 
  type = 'avatar', 
  userId, 
  questionId, 
  onUpload, 
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = type === 'avatar' 
    ? ['image/jpeg', 'image/png', 'image/webp']
    : ['image/*', 'application/pdf', 'text/*', '.doc', '.docx']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file size
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Validate file type
    if (!acceptedTypes.includes(file.type) && !acceptedTypes.some(ext => file.name.toLowerCase().endsWith(ext))) {
      alert('File type not supported');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    setIsUploading(true);

    try {
      let result;
      if (type === 'avatar') {
        result = await uploadAvatar(file, userId);
      } else {
        result = await uploadAttachment(file, questionId);
      }

      if (onUpload) {
        onUpload(result);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removePreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {preview ? (
          <div className="space-y-4">
            {type === 'avatar' ? (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button
                  onClick={removePreview}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <File size={24} className="text-gray-400" />
                <span className="text-sm text-gray-600">File selected</span>
                <button
                  onClick={removePreview}
                  className="text-red-500 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              {type === 'avatar' ? (
                <ImageIcon size={48} className="text-gray-400" />
              ) : (
                <Upload size={48} className="text-gray-400" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isUploading ? 'Uploading...' : `Drop ${type === 'avatar' ? 'avatar' : 'file'} here`}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </button>

            <p className="text-xs text-gray-400">
              Max size: {maxSize / 1024 / 1024}MB
              {type === 'avatar' && ' (JPG, PNG, WebP)'}
              {type !== 'avatar' && ' (Images, PDF, Documents)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
