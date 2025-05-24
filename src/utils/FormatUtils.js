export function formatTaf(taf) {
    const formattedTaf = taf.replace(/FM(\d{2})(\d{2})(\d{2})/g, (_, day, hour, minute) => {
        const date = new Date();
        date.setUTCDate(parseInt(day));
        date.setUTCHours(parseInt(hour), parseInt(minute), 0, 0);
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return `<br>From ${localDate.toLocaleDateString('en-US', options)}`;
    }).replace(/(\d{3})(\d{2})(G\d{2})?KT/g, (_, dir, speed, gust) => {
        let result = `Wind: ${dir}° at ${speed} knots ${gust ? `, gusting at ${gust.slice(1)} knots` : ''}`;
        if (gust) {
            result += `, gusting at ${gust.slice(1)} knots`;
        }
        return result;
    }).replace(/(\d{2})(\d{2})\/(\d{2})(\d{2})/g, (_, startDay, startHour, endDay, endHour) => {
        const startDate = new Date();
        startDate.setUTCDate(parseInt(startDay));
        startDate.setUTCHours(parseInt(startHour), 0, 0, 0);
        const endDate = new Date();
        endDate.setUTCDate(parseInt(endDay));
        endDate.setUTCHours(parseInt(endHour), 0, 0, 0);
        const localStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
        const localEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
        const startOptions = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const endOptions = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return `Starting at ${localStartDate.toLocaleDateString('en-US', startOptions)} Ending at ${localEndDate.toLocaleDateString('en-US', endOptions)}<br>Current: `;
    });

    return `${formattedTaf}`;
}
