export interface CloudLayer {
    code: string;
    text: string;
    base_feet_agl: number;
    base_meters_agl: number;
}

export interface Wind {
    degrees: number;
    speed_kts: number;
    speed_mps: number;
    gust_kts?: number;
    gust_mps?: number;
}

export interface Visibility {
    meters: number;
    meters_float: number;
    miles: number;
    miles_float: number;
}

export interface Temperature {
    celsius: number;
    fahrenheit: number;
}

export interface Pressure {
    hg: number;
    hpa: number;
    kpa: number;
    mb: number;
}

export interface MetarData {
    raw_text: string;
    station: {
        icao: string;
        name: string;
        location: string;
        country: string;
        latitude: number;
        longitude: number;
        elevation_m: number;
        elevation_ft: number;
    };
    time: {
        dt: string;
        observed: string;
        bulletin: string;
    };
    remarks: string;
    wind: Wind;
    visibility: Visibility;
    clouds: CloudLayer[];
    temperature: Temperature;
    dewpoint: Temperature;
    humidity_percent: number;
    pressure: Pressure;
    flight_rules: string;
    other: string[];
}

export interface TafForecast {
    time: {
        dt: string;
        from: string;
        to: string;
    };
    wind: Wind;
    visibility: Visibility;
    clouds: CloudLayer[];
    other: string[];
    flight_rules: string;
}

export interface TafData {
    raw_text: string;
    station: {
        icao: string;
        name: string;
        location: string;
        country: string;
        latitude: number;
        longitude: number;
        elevation_m: number;
        elevation_ft: number;
    };
    time: {
        dt: string;
        bulletin: string;
        valid_from: string;
        valid_to: string;
    };
    remarks: string;
    forecast: TafForecast[];
}

export interface ForecastPeriod {
    name: string;
    startTime: string;
    endTime: string;
    temperature: number;
    temperatureUnit: string;
    windSpeed: string;
    windDirection: string;
    shortForecast: string;
    detailedForecast: string;
    probabilityOfPrecipitation: {
        unitCode: string;
        value: number | null;
    };
    relativeHumidity: {
        unitCode: string;
        value: number;
    };
}

export interface ForecastData {
    properties: {
        periods: ForecastPeriod[];
        updateTime: string;
        validTimes: string;
    };
}

export interface ForecastError {
    error: string;
}

export type ForecastResponse = ForecastData | ForecastError; 