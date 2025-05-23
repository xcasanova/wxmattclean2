const METAR_TAF_EXPIRATION_TIME = 3600000;

export function getStoredWeatherData(airportCode) {
    const storedData = JSON.parse(localStorage.getItem(airportCode));
    if (storedData && (new Date().getTime() - storedData.timestamp < METAR_TAF_EXPIRATION_TIME)) {
        return storedData;
    }
    return null;
}

export function storeWeatherData(airportCode, metarData, tafData) {
    const data = {
        metarData: [metarData], // Store as array
        tafData: [tafData], // Store as array
        timestamp: new Date().getTime()
    };
    localStorage.setItem(airportCode, JSON.stringify(data));
}
