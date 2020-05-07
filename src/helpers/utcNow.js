import moment from 'moment';

function utcNow() {
    const d = new Date();

    const utc = new Date(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        d.getUTCMinutes(),
        d.getUTCSeconds(),
    );

    return moment(utc);
}

export default utcNow;
