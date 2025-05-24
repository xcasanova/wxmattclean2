import { Camera } from 'lucide-react';
import React, { useState } from 'react';

const WebcamImages = ({ webcamUrls, handleModalOpen }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleImages = 5; // Number of images to show at once

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : webcamUrls.length - visibleImages));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev < webcamUrls.length - visibleImages ? prev + 1 : 0));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
                <Camera className="w-4 h-4 mr-2 inline-block" />
                Webcams
            </h3>
            <div className="relative">
                {/* Navigation Arrows */}
                {webcamUrls.length > visibleImages && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            aria-label="Previous webcams"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            aria-label="Next webcams"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
                
                {/* Images Container */}
                <div className="flex gap-4 overflow-hidden">
                    {webcamUrls.slice(currentIndex, currentIndex + visibleImages).map((webcam, index) => (
                        <div 
                            key={currentIndex + index}
                            className="flex-none w-1/5 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleModalOpen(
                                webcam.url, 
                                webcamUrls.map(w => w.url), 
                                webcamUrls.map(w => w.name),
                                webcamUrls.map(w => w.zoom)
                            )}
                        >
                            <div className="w-full h-32 overflow-hidden rounded-lg">
                                <img 
                                    src={webcam.url} 
                                    alt={`Webcam view ${currentIndex + index + 1}`}
                                    className="w-full h-full object-cover"
                                    style={webcam.zoom ? {
                                        objectPosition: `${(webcam.zoom.x * 100)}% ${(webcam.zoom.y * 100)}%`,
                                        objectFit: 'cover',
                                        transform: `scale(${webcam.zoom.percent})`,
                                        transformOrigin: `${webcam.zoom.x * 100}% ${webcam.zoom.y * 100}%`
                                    } : undefined}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WebcamImages;
