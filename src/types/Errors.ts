export class WeatherError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WeatherError';
    }
}

export class SpreadsheetError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SpreadsheetError';
    }
}

export class ForecastError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ForecastError';
    }
}

export class CacheError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CacheError';
    }
}

export class APIError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public response?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
} 