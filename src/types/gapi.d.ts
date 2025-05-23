declare namespace gapi {
    interface Client {
        load(api: string, version: string): Promise<void>;
        init(params: {
            apiKey: string;
            discoveryDocs: string[];
        }): Promise<void>;
    }

    interface SheetsResponse {
        result: {
            values: string[][];
        };
    }

    interface SheetsRequest {
        spreadsheetId: string;
        range: string;
        key: string;
    }

    interface Sheets {
        spreadsheets: {
            values: {
                get: (params: SheetsRequest) => Promise<SheetsResponse>;
            };
        };
    }

    const client: Client & {
        sheets: Sheets;
    };
} 