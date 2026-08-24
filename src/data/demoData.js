import { getDateKey } from "../utils/dateUtils";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getEndOfWeek(date) {
    const endOfWeek = new Date(date);

    const day = endOfWeek.getDay();
    const daysUntilSunday = 7 - day;

    endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
    endOfWeek.setHours(0, 0, 0, 0);

    return endOfWeek;
}

export function generateDemoProjects() {
    return [
        {
            id: 0,
            name: "No Project",
            color: "#333",
            timeSpent: 0,
            isArchived: false,
            progressTracking: null
        },
        {
            id: 1,
            name: "Portfolio",
            color: "#FF8849",
            timeSpent: 0,
            isArchived: false,
            progressTracking: {
                isEnabled: true,
                currentValue: 7,
                goalValue: 10,
                unit: "pages"
            }
        },
        {
            id: 2,
            name: "LeetCode",
            color: "#69BE28",
            timeSpent: 0,
            isArchived: false,
            progressTracking: {
                isEnabled: true,
                currentValue: 84,
                goalValue: 200,
                unit: "problems"
            }
        },
        {
            id: 3,
            name: "Cybersecurity",
            color: "#3DB7E4",
            timeSpent: 0,
            isArchived: false,
            progressTracking: null
        }
    ];
}

const projectTaskNames = {
    0: [
        "Plan tomorrow",
        "Check email",
        "Organize notes"
    ],

    1: [
        "Build analytics page",
        "Fix responsive layout",
        "Refactor components",
        "Update portfolio design"
    ],

    2: [
        "Solve two pointer problems",
        "Practice binary search",
        "Review hash maps",
        "Solve daily problem"
    ],

    3: [
        "Study Linux commands",
        "Review network security",
        "Practice TryHackMe",
        "Study Security+ notes"
    ]
};

export function generateDemoTasks(daysBack = 180) {
    const tasksByDate = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysBack);

    const endDate = getEndOfWeek(today);

    let taskId = 1;

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const date = new Date(currentDate);

        const isFuture = date > today;
        const isToday = date.getTime() === today.getTime();

        if (!isFuture && Math.random() < 0.25) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        const dateKey = getDateKey(date);
        const numberOfTasks = getRandomInt(1, 4);

        const tasks = [];

        for (let j = 0; j < numberOfTasks; j++) {
            const projectId = getRandomInt(0, 3);

            const daysOld = Math.floor(
                (today - date) / (1000 * 60 * 60 * 24)
            );

            let isDone;

            if (isFuture) {
                // Future tasks should never be completed
                isDone = false;
            }
            else if (isToday) {
                isDone = Math.random() < 0.45;
            }
            else if (daysOld <= 30) {
                isDone = Math.random() < 0.9;
            }
            else {
                isDone = true;
            }

            // Simulate old deleted tasks
            if (daysOld > 30 && Math.random() < 0.25) {
                continue;
            }

            tasks.push({
                id: taskId++,
                name: getRandomItem(projectTaskNames[projectId]),
                projectId,
                time: getRandomItem([30, 45, 60, 90, 120]),
                isDone,
                dueDate: date.toISOString().split("T")[0],
                dateCompleted: isDone
                    ? getDateKey(date)
                    : ""
            });
        }

        if (tasks.length > 0) {
            tasksByDate[dateKey] = tasks;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return tasksByDate;
}

export function generateDemoSessions(daysBack = 120) {
    const sessions = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sessionId = 1;

    for (let i = daysBack; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const daysAgo = i;

        const isThisWeek = daysAgo <= 6;

        if (!isThisWeek && Math.random() > 0.75) {
            continue;
        }

        const sessionCount = isThisWeek
            ? getRandomInt(1, 3)
            : getRandomInt(1, 2);

        for (let j = 0; j < sessionCount; j++) {
            const projectId = getRandomInt(0, 3);

            const durationMinutes = getRandomInt(25, 120);
            const durationSeconds = durationMinutes * 60;

            const startHour = getRandomInt(8, 19);
            const startMinute = getRandomItem([0, 15, 30, 45]);

            const startTime = new Date(date);
            startTime.setHours(startHour, startMinute, 0, 0);

            const endTime = new Date(
                startTime.getTime() + durationSeconds * 1000
            );

            sessions.push({
                id: sessionId++,
                projectId,
                taskId: null,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                durationSeconds,
                date: getDateKey(date)
            });
        }
    }

    return sessions;
}

export function generateTimeByDateFromSessions(sessions) {
    const timeByDate = {};

    sessions.forEach(session => {
        if (!timeByDate[session.date]) {
            timeByDate[session.date] = 0;
        }

        timeByDate[session.date] += session.durationSeconds;
    });

    return timeByDate;
}

export function generateProjectActivityFromSessions(sessions) {
    const activityByDate = {};

    sessions.forEach(session => {
        if (session.projectId === 0) {
            return;
        }

        if (!activityByDate[session.date]) {
            activityByDate[session.date] = [];
        }

        if (!activityByDate[session.date].includes(session.projectId)) {
            activityByDate[session.date].push(session.projectId);
        }
    });

    return activityByDate;
}

export function addProjectTimeSpent(projects, sessions) {
    return projects.map(project => {
        const timeSpent = sessions
            .filter(session => session.projectId === project.id)
            .reduce(
                (total, session) => total + session.durationSeconds,
                0
            );

        return {
            ...project,
            timeSpent
        };
    });
}

export function generateDemoWeeklyGoals(weeksBack = 16) {
    const goals = {};

    const today = new Date();

    const currentMonday = new Date(today);

    const day = currentMonday.getDay();
    const difference = day === 0 ? -6 : 1 - day;

    currentMonday.setDate(currentMonday.getDate() + difference);
    currentMonday.setHours(0, 0, 0, 0);

    for (let i = weeksBack; i >= 0; i--) {
        const week = new Date(currentMonday);

        week.setDate(
            currentMonday.getDate() - i * 7
        );

        // 15–25 hour weekly goal
        const goalHours = getRandomInt(15, 25);

        goals[getDateKey(week)] = goalHours * 60 * 60;
    }

    return goals;
}

export function generateDemoData() {
    const sessions = generateDemoSessions(180);

    let projects = generateDemoProjects();

    projects = addProjectTimeSpent(
        projects,
        sessions
    );

    const tasksByDate = generateDemoTasks(180);

    const timeByDate =
        generateTimeByDateFromSessions(sessions);

    const projectActivityByDate =
        generateProjectActivityFromSessions(sessions);

    const weeklyTimeGoals =
        generateDemoWeeklyGoals(26);

    return {
        projects,
        sessions,
        tasksByDate,
        timeByDate,
        projectActivityByDate,
        weeklyTimeGoals
    };
}