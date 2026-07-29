export function getCurrentWeekStart() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysToSubtract);

    return weekStart;
}

export function getDaySuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

export function getCurrentWeekRange(startOfWeek) {
    const startDate = new Date(startOfWeek);
    const endDate = new Date(startOfWeek);
    endDate.setDate(startDate.getDate() + 6);

    const startMonth = startDate.toLocaleDateString('default', {month: 'short'});
    const endMonth = endDate.toLocaleDateString('default', {month: 'short'});

    const start = startDate.getDate()
    const end = endDate.getDate();

    const startPrefix = getDaySuffix(start);
    const endPrefix = getDaySuffix(end);
    return `${startMonth} ${start}${startPrefix} - ${
        startMonth !== endMonth ? `${endMonth} ` : ""
    }${end}${endPrefix}`;
}

export function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);   
    return today;
}

export function getDateKey(date) {
    return date.toLocaleDateString('en-US');
}

export function formatISOMMDD(date) {
    /* 2026-06-22 -> 6/22 */
    if (!date) return;

    let dateArray = date.split('-');
    dateArray.shift();
    dateArray[0] = dateArray[0].replace(/^0+/, '');
    dateArray[1] = dateArray[1].replace(/^0+/, '');
    return dateArray.join('/');
}

export function formatISOMMDDYYYY(date) {
    /* 2026-06-22 -> 6/22/2026 */
    if (!date) return;

    let dateArray = date.split('-');
    const year = dateArray[0];
    dateArray.shift();
    dateArray[0] = dateArray[0].replace(/^0+/, '');
    dateArray[1] = dateArray[1].replace(/^0+/, '');
    dateArray.push(year);
    return dateArray.join('/');
}

/* Checks if date object is within this week */
export function isThisWeek(date) {
    const weekStart = getCurrentWeekStart();

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return date >= weekStart && date < weekEnd;
}

/* Checks if date object is within last week */
export function isLastWeek(date) {
    const weekStart = getCurrentWeekStart();

    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    return date >= lastWeekStart && date < weekStart;
}

/* Return start of week date oject for a provided date */
export function getWeekStart(date) {
    const weekStart = new Date(date);

    weekStart.setHours(0, 0, 0, 0);

    const dayOfWeek = weekStart.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    weekStart.setDate(weekStart.getDate() - daysToSubtract);

    return weekStart;
}

/* Returns date object for yesterday */
export function getYesterdayDate() {
    const today = getTodayDate();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

export function getCurrentMonthStart() {
    const today = getTodayDate();
    return new Date(today.getFullYear(), today.getMonth(), 1);
}

export function getCurrentYearStart() {
    const today = getTodayDate();
    return new Date(today.getFullYear(), 0, 1);
}

export function getDaysElapsed(startDate) {
    const today = getTodayDate();
    const start = new Date(startDate);

    start.setHours(0, 0, 0, 0);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.floor((today - start) / millisecondsPerDay) + 1;
}