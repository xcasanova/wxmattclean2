import React, { useEffect, useState } from 'react';
import WebcamImages from './WebcamImages';
import MetarContent from './MetarContent';
import TafContent from './TafContent';
import { fetchForecast } from '../utils/fetchUtils.ts';
import ForecastContent from './ForecastContent';
import { Card, CardContent } from "../components/ui/card";

const Zone = ({ zone, handleModalOpen }) => {
    const { airports, cwa } = zone;
    const [forecast, setForecast] = useState(null);

    const getForecast = async () => {
        if (cwa) {
            const forecastData = await fetchForecast(cwa);
            setForecast(forecastData);
        }
    };

    useEffect(() => {
        getForecast();
    }, [cwa]);

    return (
        <Card className="bg-card">
            {/* <CardHeader>
                <CardTitle className="text-center text-xl font-bold text-primary">
                    Weather outlook for {title}
                </CardTitle>
            </CardHeader> */}
            <CardContent className="pr-6 pl-6">
                <div className="space-y-6">
                    <div>
                        <ForecastContent forecast={forecast} onRefresh={getForecast} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <WebcamImages webcamUrls={airports[0].webcamUrls} handleModalOpen={handleModalOpen} />
                        </div>
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
