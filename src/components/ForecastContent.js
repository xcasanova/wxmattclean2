import React, { useState } from 'react';
import { Cloud, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";

const keywordsDanger = ['Convective', 'Storm', 'Rain', 'Thunderstorm', 'LIFR'];
const keywordsWarning = ['Fog', 'Cloud', 'Visibility', 'Smoke', 'IFR'];
const keywordsInfo = ['Gust', 'marine layer', 'haze'];

const highlightKeywords = (text) => {
    const allKeywords = [...keywordsDanger, ...keywordsWarning, ...keywordsInfo];
    const regex = new RegExp(`(${allKeywords.join('|')})`, 'gi');
    
    const parts = text.split(regex);

    return parts.map((part, index) => {
        if (keywordsDanger.some(keyword => new RegExp(keyword, 'i').test(part))) {
            return (
                <span 
                    key={index} 
                    className="bg-destructive text-destructive-foreground rounded px-1 mx-0.5"
                >
                    {part}
                </span>
            );
        } else if (keywordsWarning.some(keyword => new RegExp(keyword, 'i').test(part))) {
            return (
                <span 
                    key={index} 
                    className="bg-yellow-500/20 text-yellow-500 rounded px-1 mx-0.5"
                >
                    {part}
                </span>
            );
        } else if (keywordsInfo.some(keyword => new RegExp(keyword, 'i').test(part))) {
            return (
                <span 
                    key={index} 
                    className="bg-blue-500/20 text-blue-500 rounded px-1 mx-0.5"
                >
                    {part}
                </span>
            );
        } else {
            return part;
        }
    });
};

const ForecastContent = ({ forecast, onRefresh }) => {
    const [showFull, setShowFull] = useState(false);
    const content = forecast ? (
        typeof forecast.data === 'string' ? forecast.data : JSON.stringify(forecast.data, null, 2)
    ) : (
        'Loading forecast...'
    );
    const trimmedContent = content.length > 250 ? content.substring(0, 250) + '...' : content;

    return (
        <div className="bg-card/50 rounded-lg">
            <div className="p-4 flex items-center justify-between">
                <div className="text-md font-medium flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    NWS Forecast
                </div>
                <Button 
                    variant="outline" 
                    onClick={onRefresh}
                    className="bg-primary hover:bg-primary/90 text-white"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>
            <div className="p-4 pt-0">
                <div className="text-sm">
                    {highlightKeywords(showFull ? content : trimmedContent)}
                </div>
                {content.length > 250 && (
                    <button
                        onClick={() => setShowFull(!showFull)}
                        className="mt-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        {showFull ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ForecastContent;
