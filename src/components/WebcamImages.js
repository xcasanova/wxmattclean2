import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Video } from "lucide-react";

const WebcamImages = ({ webcamUrls, handleModalOpen }) => {
    return (
        <div className="space-y-4">
            {webcamUrls.map((webcam, idx) => (
                <Card key={idx} className="bg-card/50">
                    <CardHeader className="m-0 pr-4 pl-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            {webcam.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <img 
                            src={webcam.url} 
                            alt={`Webcam view`} 
                            className="w-full rounded-md cursor-pointer hover:opacity-90 transition-opacity" 
                            onClick={() => handleModalOpen(webcam.url)} 
                        />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default WebcamImages;
