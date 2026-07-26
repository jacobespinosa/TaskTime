import { getCurrentWeekStart } from "./dateUtils";

export function formatMinutesHHMM(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins  = Math.floor(minutes % 60);
    return `${hours > 0 ? `${hours}h ` : ""}${mins > 0 ? `${mins}m` : ""}`;
}

export function formatMinutesHHMMIncludeZero(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins  = Math.floor(minutes % 60);
    return `${hours > 0 ? `${hours}h ` : ""}${mins > 0 ? `${mins}m` : "0m"}`;
}

export function formatSecondsHHMMSS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}

export function formatSecondsHHMM(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    return `${hh}:${mm}`;
}

/* returns total seconds for week */
export function getWeeklyTotalTime(timeByDate, weekStart) {
    const currentDate = new Date(weekStart);
    let totalTime = 0;

    for (let i = 0; i < 7; i++) {
        let dateKey = currentDate.toLocaleDateString('en-US');

        totalTime += timeByDate[dateKey] ?? 0;

        currentDate.setDate(currentDate.getDate() + 1);
    }
    return totalTime;
}

export function getWeekStartISO() {
    const currentWeekStart = getCurrentWeekStart();
    return new Date(currentWeekStart).toISOString().split('T')[0];
}

export function getWeeklyTimeStats(timeByDate) {
    const weekStart = getCurrentWeekStart();
    const weeklyTimeStats = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);

        const dateKey = date.toLocaleDateString('en-US');
        const day = date.toLocaleDateString('en-US', {weekday: 'short'})
        const timeSeconds = timeByDate[dateKey] || 0;
        const timeDisplay = formatMinutesHHMMIncludeZero(timeSeconds/60);
        const time = timeSeconds / 60;

        weeklyTimeStats.push({day, time, timeDisplay})
    }
    return weeklyTimeStats;
}

export function formatTime12Hour(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export function convert12HourTo24Hour(timeString) {
    const match = timeString
        .trim()
        .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

    if (!match) {
        return null;
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();

    if (
        hours < 1 ||
        hours > 12 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null;
    }

    if (period === "AM" && hours === 12) {
        hours = 0;
    } else if (period === "PM" && hours !== 12) {
        hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
} 

export function replaceTimestampTime(timestamp, editedTime) {
    const formattedTime = convert12HourTo24Hour(editedTime);

    if (!formattedTime) {
        return null;
    }

    const [datePart] = timestamp.split("T");

    return `${datePart}T${formattedTime}`;
}

export function convertHHMMToSeconds(timeString) {
    const match = timeString
            .trim()
            .match(/^(\d{1,2}):(\d{2})$/);

    if (!match) {
        return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (minutes > 59) {
        return null;
    }

    return (hours * 60 + minutes) * 60;
}

export function addDurationToTimestamp(startTimestamp, durationSeconds) {
    const startDate = new Date(startTimestamp);
    const endDate = new Date(
        startDate.getTime() + durationSeconds * 1000
    );

    return formatTimestampLocal(endDate);
}

export function formatTimestampLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function getDurationSeconds(startTimestamp, endTimestamp) {
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);

    const differenceMilliseconds =
        endDate.getTime() - startDate.getTime();

    if (differenceMilliseconds < 0) {
        return null;
    }

    return Math.floor(differenceMilliseconds / 1000);
}
