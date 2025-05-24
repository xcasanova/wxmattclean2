import React from 'react';

const WebcamImages = ({ webcamUrls, handleModalOpen }) => {
    console.log(webcamUrls);
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Webcams</h3>
            <div className="grid grid-cols-2 gap-4">
                {webcamUrls.map((webcam, index) => (
                    <div 
                        key={index}
                        className="cursor-pointer hover:opacity-90 transition-opacity"
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
                                alt={`Webcam view ${index + 1}`}
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
    );
};

export default WebcamImages;
