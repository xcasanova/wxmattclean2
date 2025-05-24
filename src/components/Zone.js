import React, { useEffect, useState, useCallback } from 'react';
import WebcamImages from './WebcamImages';
import MetarContent from './MetarContent';
import TafContent from './TafContent';
import { fetchForecast } from '../utils/fetchUtils.ts';
import ForecastContent from './ForecastContent';
import { Card, CardContent } from "../components/ui/card";

const Zone = ({ zone, handleModalOpen }) => {
    const { airports, cwa } = zone;
    const [forecast, setForecast] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getForecast = useCallback(async () => {
        if (cwa) {
            setIsLoading(true);
            const forecastData = await fetchForecast(cwa);
            setForecast(forecastData);
            setIsLoading(false);
        }
    }, [cwa]);

    useEffect(() => {
        getForecast();
    }, [getForecast]);

    return (
        <Card className="bg-card">
            <CardContent className="pr-6 pl-6">
                <div className="space-y-6">
                    <div>
                        {isLoading ? (
                            <div className="text-center py-4">Loading... please wait</div>
                        ) : (
                            <ForecastContent forecast={forecast} onRefresh={getForecast} />
                        )}
                    </div>
                    <div>
                        <WebcamImages webcamUrls={airports[0].webcamUrls} handleModalOpen={handleModalOpen} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            {airports.map((airportData, index) => (
                                <MetarContent
                                    key={index}
                                    metar={airportData.metarData[0]}
                                    isError={airportData.isError}
                                    airportCode={airportData.code}
                                />
                            ))}
                        </div>
                        <div>
                            {airports.map((airportData, index) => (
                                <TafContent
                                    key={index}
                                    taf={airportData.tafData[0]}
                                    isError={airportData.isError}
                                    airportCode={airportData.code}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Zone;
