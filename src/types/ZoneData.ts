import { MetarData, TafData } from './WeatherData';

export interface WebcamUrl {
    name: string;
    url: string;
}

export interface ZoneData {
    title: string;
    codes: string[];
    webcamUrls: WebcamUrl[];
    cwa: string;
    satellite: string | null;
}

export interface AirportData {
    code: string;
    webcamUrls: WebcamUrl[];
    metarData: MetarData[];
    tafData: TafData[];
    isCached: boolean;
    isError: boolean;
}

export interface ZoneWithAirports extends Omit<ZoneData, 'codes'> {
    airports: AirportData[];
} 