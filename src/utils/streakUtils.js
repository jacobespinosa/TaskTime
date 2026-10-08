import { getTodayDate, getDateKey, formatISOMMDDYYYY } from "./dateUtils";

/* returns object { currentStreak, longestStreak } */
export function getTaskCompletionStreaks(tasksByDate) {
    const dateKeys = Object.keys(tasksByDate);

    if (dateKeys.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0
        };
    }


    const sortedDateKeys = dateKeys.toSorted((a, b) => new Date(a) - new Date(b));
    const currentDate = new Date(sortedDateKeys[0]);
    const today = getTodayDate();

    let longestStreak = 0;
    let streak = 0;

    while (currentDate <= today) {
        const dateKey = getDateKey(currentDate);
        const tasks = tasksByDate[dateKey];

        if (tasks?.length > 0)
        {
            if (tasks.every(task => task.isDone && task.dateCompleted === formatISOMMDDYYYY(currentDate.toISOString().split('T')[0]))) {
                streak++;
                longestStreak = Math.max(longestStreak, streak);
            }
            else {
                streak = 0;
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        currentStreak: streak,
        longestStreak
    };
}

export function getFocusGoalStreaks(timeByDate, goal) {
    const dateKeys = Object.keys(timeByDate);

    if (dateKeys.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0
        };
    }

    const sortedDateKeys = dateKeys.toSorted((a, b) => new Date(a) - new Date(b));

    const currentDate = new Date(sortedDateKeys[0]);
    const today = getTodayDate();

    let longestStreak = 0;
    let streak = 0;
    while (currentDate <= today) {
        const dateKey = getDateKey(currentDate);
        const focusTime = timeByDate[dateKey] ?? 0;

        if (focusTime >= goal) {
            streak++;
            longestStreak = Math.max(longestStreak, streak);
        }
        else if (currentDate < today) {
            streak = 0;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        currentStreak: streak,
        longestStreak
    };
}