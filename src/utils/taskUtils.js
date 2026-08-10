import { getCurrentWeekStart, getTodayDate } from "./dateUtils";

export function getWeeklyTaskStats(tasksByDate) {

    let totalTasks = 0;
    let totalTasksCompleted = 0;
    const currentWeekStart = getCurrentWeekStart();
    const weekStart = new Date(currentWeekStart);

    for (let i = 0; i < 7; i++) {
        const dateKey = weekStart.toLocaleDateString();

        totalTasks += (tasksByDate[dateKey] ?? []).length;

        for (let task of (tasksByDate[dateKey] ?? [])) {
            totalTasksCompleted += task.isDone;
        }
        weekStart.setDate(weekStart.getDate() + 1);
    }

    return { totalTasks, totalTasksCompleted };
}

export function getDueStatus(task) {
    if (task.isDone || !task.dueDate) return "";

    const [year, month, day] = task.dueDate.split("-");
    const taskDueDate = new Date(year, month - 1, day);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const futureDate = new Date(todayDate);
    futureDate.setDate(futureDate.getDate() + 2);

    if (taskDueDate < todayDate) {
        return "overdue";
    }
    else if (taskDueDate < futureDate) {
        return "due-soon";
    }
    else {
        return "";
    }
}

export function isTaskPastDue(task) {
    if (!task.dueDate) return false;

    const [year, month, day] = task.dueDate.split("-");
    const taskDueDate = new Date(year, month - 1, day);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (taskDueDate >= todayDate) {
        return false;
    }
    else if (!task.isDone || 
            todayDate.toLocaleDateString() === task.dateCompleted) {
        return true;
    }
    else {
        return false;
    }
}

/* If task was checked complete today then function still returns as late*/
export function getLateTasks(tasksByDate) {
    return Object.entries(tasksByDate).flatMap(([dateKey, tasks]) => 
            tasks.map(task => (
                {
                    ...task,
                    dateKey
                })
            )).filter(task => isTaskPastDue(task));
}


export function getOverdueTasks(tasksByDate) {
    return Object.entries(tasksByDate).flatMap(([dateKey, tasks]) =>
        tasks.map(task => (
            {
                ...task,
                dateKey
            }
        )).filter(task => getDueStatus(task) === "overdue"));
}

export function getTasksArray(tasksByDate) {
    return Object.values(tasksByDate).flat();
}

export function getDueSoonTasks(tasksByDate) {
    return Object.entries(tasksByDate).flatMap(([dateKey, tasks]) =>
        tasks.map(task => (
            {
                ...task,
                dateKey
            }
        )).filter(task => getDueStatus(task) === "due-soon"));
}

export function getTaskDueDateText(task) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const today = getTodayDate();
    const [year, month, day] = task.dueDate.split("-");
    const taskDueDate = new Date(year, month - 1, day);

    const numOfDaysPastDue = Math.round((today - taskDueDate) / MS_PER_DAY);

    if (numOfDaysPastDue === 0) {
        return "Today";
    }
    else if (numOfDaysPastDue > 0) {
        return `Overdue • ${numOfDaysPastDue}d`
    }
    else if (numOfDaysPastDue === -1) {
        return "Tomorrow"
    }
    else {
        return `Due in ${daysUntilDue} ${daysUntilDue === 1 ? "day" : "days"}`;
    }
}

export function getProjectTasks(projectId, tasksByDate) {
    return Object.values(tasksByDate).flat().filter(task => task.projectId = projectId);
}