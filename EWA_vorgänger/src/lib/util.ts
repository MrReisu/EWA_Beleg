export function log (message: string, obj?: unknown) {
    // create timestamp with format DD.MM.YYYY-HH:MM:SS
    const timestamp = new Date().toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    obj ? console.log(`[${timestamp}] ${message}`, obj) : console.log(`[${timestamp}] ${message}`);
}

export function convertDateToString(date_raw: string): string {
    const date = new Date(date_raw);
    const formattedDate = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
    return formattedDate;
}

export function convertDatetimeToString(datetime_raw: string): string {
    const datetime = new Date(datetime_raw);
    const formattedDatetime = ('0' + datetime.getDate()).slice(-2) + '.' + ('0' + (datetime.getMonth() + 1)).slice(-2) + '.' + datetime.getFullYear() + ' ' + ('0' + datetime.getHours()).slice(-2) + ':' + ('0' + datetime.getMinutes()).slice(-2);
    return formattedDatetime;
}