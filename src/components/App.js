import React, { useState, useEffect } from 'react';
import { fetchSpreadsheetData, fetchWeatherData } from '../utils/fetchUtils';
import { timeSince } from '../utils/timeUtils'; // Ensure timeUtils is imported
import Zone from './Zone';
import Modal from './Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ThemeProvider } from "./theme-provider";
import { config } from '../config';
import { Loader2 } from 'lucide-react';

const App = () => {
    const [data, setData] = useState([]);
    const [lastUpdateTime, setLastUpdateTime] = useState(null);
    const [modalSrc, setModalSrc] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentWebcamUrls, setCurrentWebcamUrls] = useState([]);
    const [currentWebcamNames, setCurrentWebcamNames] = useState([]);
    const [currentWebcamZooms, setCurrentWebcamZooms] = useState([]);
    const [forceRefresh, setForceRefresh] = useState(false);
    const [selectedZone, setSelectedZone] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGoogleAPI = () => {
            // Check if gapi is already loaded
            if (window.gapi) {
                window.gapi.load('client', initClient);
                return;
            }

            // If not loaded, wait for it to load
            const checkGapi = setInterval(() => {
                if (window.gapi) {
                    clearInterval(checkGapi);
                    window.gapi.load('client', initClient);
                }
            }, 100);

            // Set a timeout to prevent infinite checking
            setTimeout(() => {
                clearInterval(checkGapi);
                if (!window.gapi) {
                    console.error('Google API failed to load after timeout');
                    setError('Failed to load Google API. Please refresh the page.');
                }
            }, 10000); // 10 second timeout
        };

        const initClient = () => {
            if (!config.google.apiKey) {
                console.error('Google API key not set');
                setError('Google API key not configured');
                return;
            }

            window.gapi.client.init({
                apiKey: config.google.apiKey,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            }).then(() => {
                console.log('Google API client initialized successfully');
                fetchData();
            }).catch(error => {
                console.error('Error initializing GAPI client:', error);
                setError('Failed to initialize Google API client. Please refresh the page.');
            });
        };

        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (!config.google.spreadsheetId) {
                    throw new Error('Spreadsheet ID not set');
                }
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
                setError('Error fetching data. Please try again later.');
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

    const handleModalOpen = (src, webcamUrls, webcamNames, webcamZooms) => {
        setModalSrc(src);
        setCurrentWebcamUrls(webcamUrls);
        setCurrentImageIndex(webcamUrls.indexOf(src));
        setCurrentWebcamNames(webcamNames);
        setCurrentWebcamZooms(webcamZooms);
    };

    const handleModalClose = () => {
        setModalSrc('');
        setCurrentImageIndex(0);
        setCurrentWebcamUrls([]);
        setCurrentWebcamNames([]);
        setCurrentWebcamZooms([]);
    };

    const handleImageNavigate = (newIndex) => {
        setModalSrc(currentWebcamUrls[newIndex]);
        setCurrentImageIndex(newIndex);
    };

    const handleZoneChange = (zone) => {
        if (zone !== null) {
            setSelectedZone(zone);
        }
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="weathermatt-theme">
            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 items-center">
                        <div className="mr-4 flex">
                            <a className="mr-6 flex items-center space-x-2" href="/">
                                <span className="font-bold">SF Bay Pilot</span>
                            </a>
                        </div>
                        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                            <div className="w-full flex-1 md:w-auto md:flex-none">
                                <Select
                                    value={selectedZone}
                                    onValueChange={handleZoneChange}
                                >
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Select a region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {data.map((zone) => (
                                            <SelectItem key={zone.title} value={zone.title}>
                                                {zone.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="container py-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div className="space-y-8">
                            {data.map((zone) => (
                                selectedZone === zone.title && (
                                    <Zone 
                                        key={zone.title} 
                                        zone={zone} 
                                        handleModalOpen={handleModalOpen} 
                                    />
                                )
                            ))}
                        </div>
                    )}
                </main>
                <div className="text-center mt-6 text-muted-foreground" id="clock"></div>
                <Modal 
                    isOpen={!!modalSrc}
                    onClose={handleModalClose}
                    imageUrl={modalSrc}
                    imageUrls={currentWebcamUrls}
                    currentIndex={currentImageIndex}
                    onNavigate={handleImageNavigate}
                    imageNames={currentWebcamNames}
                    imageZooms={currentWebcamZooms}
                />
            </div>
        </ThemeProvider>
    );
};

export default App;
