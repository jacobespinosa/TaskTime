import { getDateKey } from "../utils/dateUtils";

function createSeededRandom(seed) {
    let value = seed;

    return function () {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    };
}

function getRandomInt(random, min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
}

function getRandomItem(random, array) {
    return array[Math.floor(random() * array.length)];
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
            color: "#69BE2C",
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
            color: "#DC143C",
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
        "Organize notes",
        "Plan the week",
        "Review calendar",
        "Clean up workspace",
        "Update to-do list",
        "Review weekly goals",
        "Plan next steps",
        "Organize files",
        "Review priorities",
        "Schedule appointments",
        "Respond to messages",
        "Clean up downloads",
        "Organize desktop",
        "Back up important files",
        "Review monthly goals",
        "Plan weekend tasks",
        "Update notes",
        "Review unfinished tasks",
        "Prepare for tomorrow",
        "Organize bookmarks",
        "Clean up inbox",
        "Review upcoming deadlines",
        "Plan study schedule",
        "Update task priorities",
        "Organize documents",
        "Review this week's progress",
        "Set goals for next week",
        "Weekly review"
    ],

    1: [
        "Build analytics page",
        "Fix responsive layout",
        "Refactor components",
        "Update portfolio design",
        "Improve mobile layout",
        "Fix navigation bugs",
        "Build project page",
        "Update project cards",
        "Improve dashboard layout",
        "Add loading states",
        "Clean up CSS",
        "Refactor utility functions",
        "Update project screenshots",
        "Write project description",
        "Improve accessibility",
        "Fix sidebar layout",
        "Build contact section",
        "Update resume section",
        "Add project filters",
        "Improve animations",
        "Optimize page performance",
        "Fix chart sizing",
        "Improve analytics charts",
        "Add empty states",
        "Refactor modal components",
        "Fix dropdown behavior",
        "Improve form validation",
        "Add project progress tracking",
        "Build yearly heatmap",
        "Improve heatmap tooltips",
        "Fix calendar layout",
        "Add session history",
        "Build progress ring",
        "Improve task selector",
        "Fix timer bugs",
        "Refactor timer logic",
        "Add local storage",
        "Test local storage",
        "Create demo mode",
        "Generate demo data",
        "Fix routing",
        "Improve demo page",
        "Test mobile navigation",
        "Clean up console warnings",
        "Remove unused code",
        "Update README",
        "Add project documentation",
        "Deploy latest changes",
        "Test production build",
        "Review portfolio UI"
    ],

    2: [
        "Solve two pointer problems",
        "Practice binary search",
        "Review hash maps",
        "Solve daily problem",
        "Practice arrays",
        "Practice hash sets",
        "Review unordered_map",
        "Review unordered_set",
        "Practice sliding window",
        "Practice stack problems",
        "Practice queue problems",
        "Practice linked lists",
        "Practice recursion",
        "Practice backtracking",
        "Practice tree traversal",
        "Practice binary trees",
        "Practice binary search trees",
        "Practice heap problems",
        "Practice priority queues",
        "Practice graph traversal",
        "Practice BFS",
        "Practice DFS",
        "Review time complexity",
        "Review space complexity",
        "Practice sorting problems",
        "Review C++ vectors",
        "Review C++ iterators",
        "Practice string problems",
        "Practice prefix sums",
        "Practice intervals",
        "Practice greedy problems",
        "Review dynamic programming",
        "Practice 1D dynamic programming",
        "Solve array problems",
        "Solve hashmap problems",
        "Solve linked list problems",
        "Solve tree problems",
        "Solve graph problems",
        "Review previous solutions",
        "Redo missed problems",
        "Redo difficult problems",
        "Study solution patterns",
        "Review problem notes",
        "Solve medium problem",
        "Solve easy warm-up",
        "Solve timed problem",
        "Practice interview questions",
        "Review common algorithms",
        "Update LeetCode notes",
        "Complete daily challenge"
    ],

    3: [
        "Study Linux commands",
        "Review network security",
        "Practice TryHackMe",
        "Study Security+ notes",
        "Review TCP/IP",
        "Study common ports",
        "Review OSI model",
        "Practice subnetting",
        "Study DNS",
        "Study DHCP",
        "Review HTTP and HTTPS",
        "Study firewalls",
        "Review VPN concepts",
        "Study access control",
        "Review authentication methods",
        "Study encryption basics",
        "Review hashing algorithms",
        "Study public key cryptography",
        "Review digital certificates",
        "Study PKI",
        "Review security protocols",
        "Study network attacks",
        "Review phishing attacks",
        "Study malware types",
        "Review social engineering",
        "Study vulnerability scanning",
        "Review penetration testing concepts",
        "Practice Linux permissions",
        "Practice command line tools",
        "Study log analysis",
        "Review SIEM concepts",
        "Practice SIEM queries",
        "Analyze sample logs",
        "Review incident response",
        "Study threat detection",
        "Review threat intelligence",
        "Study security policies",
        "Review risk management",
        "Study vulnerability management",
        "Practice Wireshark",
        "Analyze network traffic",
        "Review firewall rules",
        "Study endpoint security",
        "Review cloud security",
        "Study IAM concepts",
        "Review zero trust",
        "Complete TryHackMe room",
        "Review TryHackMe notes",
        "Take Security+ practice quiz",
        "Review missed Security+ questions"
    ]
};

export function generateDemoTasks(random, daysBack = 180) {
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

        if (!isFuture && random() < 0.25) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        const dateKey = getDateKey(date);
        const numberOfTasks = getRandomInt(random, 1, 4);

        const tasks = [];

        for (let j = 0; j < numberOfTasks; j++) {
            const projectId = getRandomInt(random, 0, 3);

            const daysOld = Math.floor(
                (today - date) / (1000 * 60 * 60 * 24)
            );

            let isDone;

            if (isFuture) {
                isDone = false;
            }
            else if (isToday) {
                isDone = random() < 0.45;
            }
            else if (daysOld <= 7) {
                isDone = random() < 0.9;
            }
            else {
                isDone = true;
            }

            if (daysOld > 30 && random() < 0.25) {
                continue;
            }

            tasks.push({
                id: taskId++,
                name: getRandomItem(random, projectTaskNames[projectId]),
                projectId,
                time: getRandomItem(random, [30, 45, 60, 90, 120]),
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

export function generateDemoSessions(random, daysBack = 120) {
    const sessions = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sessionId = 1;

    for (let i = daysBack; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const daysAgo = i;

        const isThisWeek = daysAgo <= 6;

        if (!isThisWeek && random() > 0.75) {
            continue;
        }

        const sessionCount = isThisWeek
            ? getRandomInt(random, 1, 3)
            : getRandomInt(random, 1, 2);

        for (let j = 0; j < sessionCount; j++) {
            const projectId = getRandomInt(random, 0, 3);

            const durationMinutes = getRandomInt(random, 25, 120);
            const durationSeconds = durationMinutes * 60;

            const startHour = getRandomInt(random, 8, 19);
            const startMinute = getRandomItem(random, [0, 15, 30, 45]);

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

export function generateDemoWeeklyGoals(random, weeksBack = 16) {
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

        const goalHours = getRandomInt(random, 15, 25);

        goals[getDateKey(week)] = goalHours * 60 * 60;
    }

    return goals;
}

export function generateDemoData(seed = 12345) {
    const random = createSeededRandom(seed);

    const sessions = generateDemoSessions(
        random,
        180
    );

    let projects = generateDemoProjects();

    projects = addProjectTimeSpent(
        projects,
        sessions
    );

    const tasksByDate = generateDemoTasks(
        random,
        180
    );

    const timeByDate =
        generateTimeByDateFromSessions(sessions);

    const projectActivityByDate =
        generateProjectActivityFromSessions(sessions);

    const weeklyTimeGoals =
        generateDemoWeeklyGoals(
            random,
            26
        );

    return {
        projects,
        sessions,
        tasksByDate,
        timeByDate,
        projectActivityByDate,
        weeklyTimeGoals
    };
}