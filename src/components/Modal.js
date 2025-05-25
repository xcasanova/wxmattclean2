import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const Modal = ({ isOpen, onClose, imageUrl, imageUrls, currentIndex, onNavigate, imageNames, imageZooms }) => {
    if (!isOpen) return null;

    const handlePrevious = () => {
        if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < imageUrls.length - 1) {
            onNavigate(currentIndex + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            <div className="relative w-full h-full">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </Button>
                
                {currentIndex > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white"
                        onClick={handlePrevious}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                )}
                
                {currentIndex < imageUrls.length - 1 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white"
                        onClick={handleNext}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                )}

                <h1 className="absolute top-4 left-4 z-50 bg-black/50 px-4 py-2 text-white text-2xl font-bold">
                    {imageNames[currentIndex]}
                </h1>

                <img
                    src={imageUrl}
                    alt="Webcam view"
                    className="w-full h-full object-contain"
                    style={imageZooms[currentIndex] ? {
                        objectPosition: `${(imageZooms[currentIndex].x * 100)}% ${(imageZooms[currentIndex].y * 100)}%`,
                        objectFit: 'cover',
                        transform: `scale(${imageZooms[currentIndex].percent})`,
                        transformOrigin: `${imageZooms[currentIndex].x * 100}% ${imageZooms[currentIndex].y * 100}%`
                    } : undefined}
                />
            </div>
        </div>
    );
};

export default Modal;
