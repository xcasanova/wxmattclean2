import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const CustomModal = ({ modalSrc, handleModalClose, webcamUrls, currentIndex, onNavigate, webcamName, webcamZoom }) => {
    if (!modalSrc) return null;

    const handlePrevious = () => {
        if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < webcamUrls.length - 1) {
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
                    onClick={handleModalClose}
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
                
                {currentIndex < webcamUrls.length - 1 && (
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
                    {webcamName}
                </h1>

                <img
                    src={modalSrc}
                    alt="Webcam view"
                    className="w-full h-full object-contain"
                    style={webcamZoom ? {
                        objectPosition: `${(webcamZoom.x * 100)}% ${(webcamZoom.y * 100)}%`,
                        objectFit: 'cover',
                        transform: `scale(${webcamZoom.percent})`,
                        transformOrigin: `${webcamZoom.x * 100}% ${webcamZoom.y * 100}%`
                    } : undefined}
                />
            </div>
        </div>
    );
};

export default CustomModal;
