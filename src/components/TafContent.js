import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Clock } from "lucide-react";
import { formatTaf } from '../utils/FormatUtils';

const getCurrentZuluTime = () => {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}Z`;
};

const TafContent = ({ taf, isError, airportCode }) => {
    const [showDecoded, setShowDecoded] = useState(false);

    if (isError || !taf || !taf.data || taf.data.length === 0) {
        return (
            <Card className="bg-destructive/10">
                <CardContent className="p-4 text-destructive">
                    Error fetching TAF data for {airportCode}
                </CardContent>
            </Card>
        );
    }

    const data = taf.data[0];
    const rawTaf = data;
    const formattedTaf = formatTaf(data);
    const zuluTime = getCurrentZuluTime();

    return (
        <Card className="bg-card/50 mb-4">
            <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    TAF - Now {zuluTime}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                <div className="p-3 rounded-md bg-muted font-mono text-sm">
                    {rawTaf.split('FM').map((line, index) => (
                        <div key={index} className="mt-1">FM{line}</div>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowDecoded(!showDecoded)}
                >
                    {showDecoded ? 'Hide Decoded TAF' : 'Show Decoded TAF'}
                </Button>

                {showDecoded && (
                    <div className="text-sm space-y-2">
                        {formattedTaf.split('<br>').map((line, index) => (
                            <div 
                                key={index} 
                                className="p-2 rounded-md bg-muted/50"
                                dangerouslySetInnerHTML={{ __html: line }}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TafContent;
