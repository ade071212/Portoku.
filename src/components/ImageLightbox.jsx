import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const ImageLightbox = ({ isOpen, imageUrl, altText, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling on body when lightbox is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
      >
        <FiX size={24} />
      </button>
      
      <div 
        className="relative max-w-5xl max-h-[90vh] w-full h-full p-4 flex items-center justify-center animate-scale-up"
        onClick={(e) => e.stopPropagation()} // Prevent clicks on image from closing
      >
        <img 
          src={imageUrl} 
          alt={altText || 'Expanded view'} 
          className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_50px_rgba(34,211,238,0.2)]"
        />
      </div>
    </div>
  );
};

export default ImageLightbox;
