import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Cloud, Plane, Wind } from "lucide-react";
import { timeSince } from '../utils/timeUtils';
import { cn } from '../lib/utils';

const MetarContent = ({ metar, isError, airportCode }) => {
    if (isError || !metar || !metar.data || metar.data.length === 0) {
        return (
            <Card className="bg-destructive/10">
                <CardContent className="p-4 text-destructive">
                    Error fetching METAR data for {airportCode}
                </CardContent>
            </Card>
        );
    }

    const data = metar.data[0];
    const reportedTime = new Date(data.observed + "Z");
    const timeAgo = timeSince(reportedTime);

    return (
        <Card className={cn("bg-card/50 mb-4", data.ceiling && "border-red-500/20 border bg-red-500/10")}>
            <CardHeader className="m-0 pr-4 pl-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    {data.station.name} ({data.icao})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                <div className="p-3 rounded-md font-mono text-sm bg-primary/10">
                    <span className="font-semibold">METAR:</span> {data.raw_text}
                </div>

                <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10">
                    <Wind className="h-4 w-4" />
                    <span className="text-sm">
                        Wind: {data.wind?.degrees}° at {data.wind?.speed_kts} knots {data.wind?.gust_kts ? `, Gusts ${data.wind.gust_kts} knots` : ''}
                    </span>
                </div>

                {data.ceiling && <div className="flex items-center gap-2 p-3 rounded-md bg-red-800 border border-red-500/20">
                    <Cloud className="h-4 w-4" />
                    <span className="text-sm">
                        Ceiling: {data.ceiling?.feet} feet
                    </span>
                </div>}

                <div className="text-right text-sm text-muted-foreground">
                    {timeAgo} ago
                </div>
                
            </CardContent>
        </Card>
    );
};

export default MetarContent;
