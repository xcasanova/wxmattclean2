export const config = {
    google: {
        apiKey: 'AIzaSyAVd8hOm79lUcB-ZyZf0MlfT-XR3yTX5CI',
        spreadsheetId: '10OASKdt3-K49U2Gz5WKxZH0GQgDQBFxA2TdkmR7XZ68',
        range: 'Sheet1!A:E'
    },
    cache: {
        key: 'spreadsheet_data_cache',
        expiry: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
        enabled: false
    },
    checkwx: {
        apiKey: '0221e0aa85274a45a7e146377c'
    }
} as const;

// Debug logging
console.log('Config values:', {
    apiKey: config.google.apiKey ? 'Set' : 'Not set',
    spreadsheetId: config.google.spreadsheetId ? 'Set' : 'Not set',
    range: config.google.range
}); 