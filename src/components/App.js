import React, { useState, useEffect } from 'react';
import { fetchSpreadsheetData, fetchWeatherData } from '../utils/fetchUtils.ts';
import { timeSince } from '../utils/timeUtils'; // Ensure timeUtils is imported
import Zone from './Zone';
import CustomModal from './Modal';
import { Button } from "../components/ui/button";
import { Toggle } from "../components/ui/toggle";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";
import { CloudSun } from "lucide-react";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const App = () => {
    const [data, setData] = useState([]);
    const [lastUpdateTime, setLastUpdateTime] = useState(null);
    const [modalSrc, setModalSrc] = useState('');
    const [forceRefresh, setForceRefresh] = useState(false);
    const [selectedZone, setSelectedZone] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadGoogleAPI = () => {
            window.gapi.load('client', initClient);
        };

        const initClient = () => {
            window.gapi.client.init({
                apiKey: GOOGLE_API_KEY,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            }).then(() => {
                fetchData();
            }).catch(error => {
                console.error('Error initializing GAPI client:', error);
            });
        };

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const zones = await fetchSpreadsheetData(window.gapi, forceRefresh);
                const weatherData = await fetchWeatherData(zones, forceRefresh);

                setData(weatherData);
                if (zones.length > 0) {
                    setSelectedZone(zones[0].title);
                }
                setLastUpdateTime(new Date());
                setForceRefresh(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setIsLoading(false);
        };

        loadGoogleAPI();
    }, [forceRefresh]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (lastUpdateTime) {
                document.getElementById("clock").textContent = `Data last updated ${timeSince(lastUpdateTime)} ago`;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastUpdateTime]);

    const handleModalOpen = (src) => {
        setModalSrc(src);
    };

    const handleModalClose = () => {
        setModalSrc('');
    };

    const handleZoneChange = (zone) => {
        if (zone !== null) {
            setSelectedZone(zone);
        }
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="weathermatt-theme">
            <div className="min-h-screen bg-background text-foreground">
                <Button
                    variant="outline"
                    className="absolute top-4 left-4"
                    onClick={() => window.location.href = 'https://www.122point8.com'}
                >
                    122point8.com
                </Button>
                <div className="border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <h1 className="text-4xl font-bold flex items-center gap-2">
                                    <CloudSun className="w-8 h-8" />
                                    Bay area pilot WX
                                </h1>
                                <div className="flex flex-wrap gap-2">
                                    {data.map((zone, index) => (
                                        <Toggle
                                            key={index}
                                            pressed={selectedZone === zone.title}
                                            onPressedChange={() => handleZoneChange(zone.title)}
                                            aria-label={zone.title}
                                            className="px-4 py-2 rounded-md bg-background hover:bg-accent text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                        >
                                            {zone.title}
                                        </Toggle>
                                    ))
                                    }
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className="text-center py-4 text-sm">The application is loading... please wait</div>
                ) : (
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div id="zones" className="space-y-6">
                            {data.map((zone, index) => (
                                selectedZone === zone.title && (
                                    <Zone zone={zone} handleModalOpen={handleModalOpen} />
                                )
                            ))}
                        </div>

                        <div className="text-center mt-6 text-muted-foreground" id="clock"></div>
                        <CustomModal modalSrc={modalSrc} handleModalClose={handleModalClose} />
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
};

export default App;
