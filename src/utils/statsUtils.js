import { getCurrentMonthStart, getCurrentWeekStart, getCurrentYearStart, getTodayDate, getWeekStart, getYesterdayDate } from "./dateUtils";
import { getWeeklyTotalTime } from "./timeUtils";
import { getDateKey } from "./dateUtils";
import { calculateGoalPercentage } from "./mathUtils";
import { getSessionsByDate, getSessionsByProjectId, getTotalSessionDuration } from "./sessionUtils";

export function getAverageMonthlyTimeGoalPercentage(timeByDate, weeklyTimeGoals, monthStart) {
    const today = getTodayDate();

    const startDate = new Date(monthStart);
    startDate.setHours(0, 0, 0, 0);

    const monthEnd = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
    );

    const endDate = monthEnd < today ? monthEnd : today;

    return getAverageTimeGoalPercentage(timeByDate, weeklyTimeGoals, startDate, endDate);

}

export function getAverageYearlyTimeGoalPercentage(timeByDate, weeklyTimeGoals, yearStart) {
    const today = getTodayDate();

    const startDate = new Date(yearStart);
    startDate.setHours(0, 0, 0, 0);

    const yearEnd = new Date(
        startDate.getFullYear() + 1,
        0,
        0
    );

    const endDate = yearEnd < today ? yearEnd : today;

    return getAverageTimeGoalPercentage(timeByDate, weeklyTimeGoals, startDate, endDate);

}

export function getAverageTimeGoalPercentage(timeByDate, weeklyTimeGoals, rangeStart, rangeEnd) {
    const currentWeekStart = getWeekStart(rangeStart);

    let totalPercentage = 0;
    let weekCount = 0;

    while (currentWeekStart <= rangeEnd) {
        const weekStartKey = getDateKey(currentWeekStart);
        const weeklyGoal = weeklyTimeGoals[weekStartKey] ?? 0;

        if (weeklyGoal > 0) {
            const weeklyTime = getWeeklyTotalTime(
                timeByDate,
                currentWeekStart
            );

            totalPercentage += calculateGoalPercentage(
                weeklyTime,
                weeklyGoal
            );

            weekCount++;
        }

        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return weekCount > 0 ? totalPercentage / weekCount : 0;
}

export function getWeeklyTaskCompletion(tasksByDate) {

    let totalTasks = 0;
    let totalTasksCompletedOnTime = 0;

    const today = getTodayDate();
    const currentWeekStart = getCurrentWeekStart();
    const weekStart = new Date(currentWeekStart)

    for (let i = 0; i < 7 && weekStart < today; i++) {
        const dateKey = getDateKey(weekStart);
        const tasks = tasksByDate[dateKey] ?? [];

        totalTasks += tasks.length;

        for (const task of tasks) {
            if (task.isDone && task.dateCompleted === dateKey) {
                totalTasksCompletedOnTime++;
            }
        }
        weekStart.setDate(weekStart.getDate() + 1);
    }

    return {
        totalTasks,
        totalTasksCompletedOnTime
    };
}

export function getMonthlyTaskCompletion(tasksByDate, monthStart) {
    const yesterday = getYesterdayDate();

    let totalMonthlyTasks = 0;
    let totalMonthlyTasksCompletedOnTime = 0;

    const currentDate = new Date(monthStart);
    currentDate.setHours(0, 0, 0, 0);

    const monthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );

    const endDate = monthEnd < yesterday ? monthEnd : yesterday;
    while (currentDate <= endDate) {
        const dateKey = getDateKey(currentDate);

        const tasks = tasksByDate[dateKey] ?? [];
        totalMonthlyTasks += tasks.length;

        for (const task of tasks) {
            if (task.isDone && task.dateCompleted === dateKey) {
                totalMonthlyTasksCompletedOnTime++;
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return { totalMonthlyTasks, totalMonthlyTasksCompletedOnTime };
}

export function getYearlyTaskCompletion(tasksByDate, yearStart) {
    const yesterday = getYesterdayDate()

    let totalYearlyTasks = 0;
    let totalYearlyTasksCompletedOnTime = 0;

    const currentDate = new Date(yearStart);
    currentDate.setHours(0, 0, 0, 0);

    const yearEnd = new Date(
        currentDate.getFullYear() + 1,
        0,
        0
    );

    const endDate = yearEnd < yesterday ? yearEnd : yesterday;

    while (currentDate <= endDate) {
        const dateKey = getDateKey(currentDate);

        const tasks = tasksByDate[dateKey] ?? [];
        totalYearlyTasks += tasks.length;

        for (const task of tasks) {
            if (task.isDone && task.dateCompleted === dateKey) {
                totalYearlyTasksCompletedOnTime++;
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return { totalYearlyTasks, totalYearlyTasksCompletedOnTime };
}

/* Return Array of data objects { day, time } */
export function getDailyFocusTimeData(timeByDate) {
    const monthStart = getCurrentMonthStart();

    const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0
    );

    const currentDate = new Date(monthStart);
    const dataArray = [];

    while (currentDate <= monthEnd) {
        const dateKey = getDateKey(currentDate);
        dataArray.push({
            day: currentDate.getDate(),
            time: (timeByDate[dateKey] ?? 0) / 60
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dataArray;
}

/* Return Array of data objects { weekStart, time, month } */
export function getMonthlyFocusTimeData(timeByDate) {
    const currentMonthStart = getCurrentMonthStart();

    const monthStart = new Date(
        currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() - 3,
        1
    );

    const monthEnd = new Date(
        currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() + 1,
        0
    );

    const currentWeek = getWeekStart(monthStart);

    // Skip the week that began in the previous month
    if (currentWeek < monthStart) {
        currentWeek.setDate(currentWeek.getDate() + 7);
    }

    const dataArray = [];

    while (currentWeek <= monthEnd) {
        const weekEnd = new Date(currentWeek);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // Skip week if it ends in month after the end month
        if (weekEnd > monthEnd) {
            break;
        }

        let totalWeekTime = 0;

        const day = new Date(currentWeek);

        for (let i = 0; i < 7 && day <= monthEnd; i++) {
            const dateKey = getDateKey(day);
            totalWeekTime += timeByDate[dateKey] ?? 0;
            day.setDate(day.getDate() + 1);
        }

        dataArray.push({
            weekStart: getDateKey(currentWeek),
            time: totalWeekTime / 3600,
            month: currentWeek.toLocaleDateString("en-US", {
                month: "short"
            })
        });

        currentWeek.setDate(currentWeek.getDate() + 7);
    }

    return dataArray;
}

/* Return Array of data objects { monthStart, time, month } */
export function getYearlyFocusTimeData(timeByDate) {
    const yearStart = getCurrentYearStart();
    const dateKeys = Object.keys(timeByDate);

    if (dateKeys.length === 0) {
        return [];
    }

    const latestDataDate = dateKeys
        .map(dateKey => new Date(dateKey))
        .sort((a, b) => b - a)[0];

    const lastMonthStart = new Date(
        latestDataDate.getFullYear(),
        latestDataDate.getMonth(),
        1
    );

    const currentMonth = new Date(yearStart);
    const data = [];

    while (currentMonth <= lastMonthStart) {
        let totalMonthTime = 0;

        const day = new Date(currentMonth);
        const daysInMonth = new Date(
            day.getFullYear(), 
            day.getMonth() + 1,
            0
        ).getDate();
            
        for (let i = 0; i < daysInMonth; i++) {
            const dateKey = getDateKey(day);
            totalMonthTime += timeByDate[dateKey] ?? 0;
            day.setDate(day.getDate() + 1);
        }

        data.push({
            monthStart: getDateKey(currentMonth),
            time: totalMonthTime / 3600,
            month: currentMonth.toLocaleDateString("en-US", {
                month: "short"
            })
        });

        currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    return data;
}

export function generateTestTimeData() {
    const data = {};

    const date = new Date(2026, 0, 1);
    const yearStart = new Date(2026, 0, 1);

    while (date.getFullYear() === 2026) {
        const day = date.getDay();
        const isWeekend = day === 0 || day === 6;

        const progress = date.getMonth() / 11;

        const daysSinceYearStart = Math.floor(
            (date - yearStart) / (1000 * 60 * 60 * 24)
        );

        const weekIndex = Math.floor(daysSinceYearStart / 7);

        // Some weeks intentionally perform worse.
        let weeklyMultiplier = 1;

        if (weekIndex % 5 === 1) {
            weeklyMultiplier = 0.45; // Clearly misses goal
        } else if (weekIndex % 5 === 3) {
            weeklyMultiplier = 0.7; // Slightly misses goal
        }

        const baseHours =
            (isWeekend ? 1.5 : 2.5) +
            progress * 1.5 +
            Math.random() * 2;

        const finalHours = baseHours * weeklyMultiplier;

        data[date.toLocaleDateString("en-US")] =
            Math.round(finalHours * 3600);

        date.setDate(date.getDate() + 1);
    }

    return data;
}

export function getWeekTimeStats(tasksByDate, weekStart) {
    let totalTasks = 0;
    let totalTasksCompleted = 0;

    const currentDate = new Date(weekStart);

    for (let i = 0; i < 7; i++) {
        const dateKey = currentDate.toLocaleDateString();
        const tasks = tasksByDate[dateKey] ?? [];

        totalTasks += tasks.length;

        for (const task of tasks) {
            if (task.isDone) {
                totalTasksCompleted++;
            }
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return { totalTasks, totalTasksCompleted };
}

export function getYearlyProjectHeatmapData(year, sessions, projectId) {
    let projectSessions;

    if (projectId === 0) {
        // Get all projects
        projectSessions = sessions.filter(
            session => session.projectId !== 0
        );
    }
    else {
        projectSessions = getSessionsByProjectId(sessions, projectId);
    }

    const weeks = [];

    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    const startDate = new Date(yearStart);

    const day = startDate.getDay();
    const daysSinceMonday = day === 0 ? 6 : day - 1;

    startDate.setDate(startDate.getDate() - daysSinceMonday);

    const currentDate = new Date(startDate);

    while (currentDate <= yearEnd) {
        const week = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(currentDate);
            const dateKey = getDateKey(date);

            const isInYear = date.getFullYear() === year;

            const filteredSessions = getSessionsByDate(
                projectSessions,
                dateKey
            );

            const totalSessionTime = getTotalSessionDuration(
                filteredSessions
            );

            let tier = 0;

            if (totalSessionTime > 0) {
                if (projectId === 0) {
                    // All projects
                    if (totalSessionTime < 3600) {
                        tier = 1;
                    }
                    else if (totalSessionTime < 7200) {
                        tier = 2;
                    }
                    else if (totalSessionTime < 14400) {
                        tier = 3;
                    }
                    else {
                        tier = 4;
                    }
                }
                else {
                    // Individual project
                    if (totalSessionTime < 1800) {
                        tier = 1;
                    }
                    else if (totalSessionTime < 3600) {
                        tier = 2;
                    }
                    else if (totalSessionTime < 7200) {
                        tier = 3;
                    }
                    else {
                        tier = 4;
                    }
                }
            }

            week.push({
                date,
                dateKey,
                isInYear,
                totalSessionTime,
                tier
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        weeks.push(week);
    }

    return weeks;
}