import { getStoredWeatherData, storeWeatherData } from './StorageUtils';
import { ZoneData, ZoneWithAirports, AirportData } from '../types/ZoneData';
import { MetarData, TafData, ForecastResponse } from '../types/WeatherData';
import { SpreadsheetError, WeatherError, ForecastError, CacheError, APIError } from '../types/Errors';
import { config } from '../config';

declare global {
    interface Window {
        gapi: any;
    }
}

function getCachedSpreadsheetData(): ZoneData[] | null {
    if (!config.cache.enabled) return null;
    
    const cached = localStorage.getItem(config.cache.key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > config.cache.expiry) {
        localStorage.removeItem(config.cache.key);
        return null;
    }

    return data;
}

function setCachedSpreadsheetData(data: ZoneData[]): void {
    if (!config.cache.enabled) return;
    
    localStorage.setItem(config.cache.key, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
}

function parseSatelliteUrl(rowContent: { url?: string } | null): string | null {
    return rowContent?.url ?? null;
}

export async function fetchSpreadsheetData(gapi: any, forceRefresh: boolean = false): Promise<ZoneData[]> {
    try {
        // Check cache first if not forcing refresh
        if (!forceRefresh) {
            const cachedData = getCachedSpreadsheetData();
            if (cachedData) {
                return cachedData;
            }
        }

        if (!gapi?.client) {
            throw new SpreadsheetError('Google API client not initialized');
        }

        await gapi.client.load('sheets', 'v4');
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: config.google.spreadsheetId,
            range: config.google.range,
            key: config.google.apiKey
        });

        if (!response.result.values) {
            throw new SpreadsheetError('No data found in the spreadsheet');
        }

        const rows = response.result.values.slice(1); // Skip header row
        const zones = rows.map((row: string[]) => {
            let webcamUrls;
            try {
                webcamUrls = JSON.parse(row[2]); // Parse JSON object for webcam names and URLs
            } catch (error) {
                console.error(`Error parsing JSON for row ${row}:`, error);
                webcamUrls = [];
            }
            const satelliteJson = row[5] ? JSON.parse(row[5]) : null;
            return {
                title: row[0], // Zone title
                codes: row[1].split(',').map((code: string) => code.trim()), // Airport codes
                webcamUrls: webcamUrls, // Use parsed JSON or empty array
                cwa: row[4], // Extract CWA value from the 4th column (index 3)
                satellite: satelliteJson ? parseSatelliteUrl(satelliteJson) : null
            };
        });
        
        // Cache the fetched data
        setCachedSpreadsheetData(zones);
        
        return zones;
    } catch (error) {
        if (error instanceof SpreadsheetError || error instanceof CacheError) {
            throw error;
        }
        throw new SpreadsheetError('Error fetching spreadsheet data');
    }
}

export async function fetchWeatherData(zones: ZoneData[], forceRefresh: boolean = false): Promise<ZoneWithAirports[]> {
    const data: ZoneWithAirports[] = [];

    for (const zone of zones) {
        const zoneData: ZoneWithAirports = {
            title: zone.title,
            airports: [],
            cwa: zone.cwa,
            webcamUrls: zone.webcamUrls,
            satellite: zone.satellite
        };

        for (const code of zone.codes) {
            const storedData = getStoredWeatherData(code);
            const airportData: AirportData = {
                code,
                webcamUrls: zone.webcamUrls,
                metarData: [],
                tafData: [],
                isCached: false,
                isError: false
            };

            if (storedData && !forceRefresh) {
                airportData.metarData = storedData.metarData;
                airportData.tafData = storedData.tafData;
                airportData.isCached = true;
            } else {
                try {
                    const metarResponse = await fetch(`https://api.checkwx.com/metar/${code}/decoded`, {
                        headers: {
                            'X-API-Key': config.checkwx.apiKey
                        }
                    });
                    
                    if (!metarResponse.ok) {
                        throw new APIError('Failed to fetch METAR data', metarResponse.status);
                    }
                    
                    const metarData: MetarData = await metarResponse.json();
                    
                    const tafResponse = await fetch(`https://api.checkwx.com/taf/${code}/nearest`, {
                        headers: {
                            'X-API-Key': config.checkwx.apiKey
                        }
                    });
                    
                    if (!tafResponse.ok) {
                        throw new APIError('Failed to fetch TAF data', tafResponse.status);
                    }
                    
                    const tafData: TafData = await tafResponse.json();
                    storeWeatherData(code, metarData, tafData);
                    airportData.metarData.push(metarData);
                    airportData.tafData.push(tafData);
                } catch (error) {
                    console.error('Error fetching weather data for ', code, error);
                    airportData.isError = true;
                    if (error instanceof APIError) {
                        throw error;
                    }
                    throw new WeatherError(`Failed to fetch weather data for ${code}`);
                }
            }
            zoneData.airports.push(airportData);
        }
        data.push(zoneData);
    }

    return data;
}

export async function fetchForecast(cwa: string): Promise<ForecastResponse> {
    try {
        const response = await fetch(`https://q2yy4pt5bplu25bbb4gwrlhvgm0qytgn.lambda-url.us-east-2.on.aws/?cwa=${cwa}&type=forecast`);
        if (!response.ok) {
            throw new APIError('Failed to fetch forecast data', response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        if (error instanceof APIError) {
            throw error;
        }
        throw new ForecastError('Failed to fetch forecast data');
    }
} 