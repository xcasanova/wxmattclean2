import React from 'react';
import { Box, Typography } from '@mui/material';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import { styled } from '@mui/system';
import { timeSince } from '../utils/timeUtils';

const AirportName = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: theme.spacing(1),
}));

const RawMetar = styled(Typography)(({ theme }) => ({
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    padding: theme.spacing(2),
    border: '1px solid #ddd',
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    marginTop: theme.spacing(1),
}));

const MetarContent = ({ metar, isError, airportCode }) => {
    if (isError || !metar || !metar.data || metar.data.length === 0) {
        return <Typography variant="body2" color="error">Error fetching METAR data for {airportCode}</Typography>;
    }

    const data = metar.data[0];
    const reportedTime = new Date(data.observed + "Z");
    const localTime = reportedTime.toLocaleString();
    const timeAgo = timeSince(reportedTime);

    return (
        <Box sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f5f5f5' }}>
            <AirportName>
                <LocalAirportIcon sx={{ mr: 1 }} />
                {data.station.name} ({data.icao})
            </AirportName>
            <Typography variant="body2" sx={{ mb: 1 }}>
                {localTime} ({timeAgo} ago)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Temp/Dewpoint: {data.temperature?.celsius}°C / {data.dewpoint.celsius}°C
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Wind: {data.wind?.degrees}° at {data.wind?.speed_kts} knots {data.wind?.gust ? `, gusting at ${data.wind.gust.speed_kts} knots` : ''}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Visibility: {data.visibility?.miles_float} miles
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Clouds: {data.clouds.map(cloud => cloud.text).join(', ')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Flight Category: {data.flight_category}
            </Typography>
            <RawMetar variant="body2">
                <b>Raw METAR:</b> {data.raw_text}
            </RawMetar>
        </Box>
    );
};

export default MetarContent;
