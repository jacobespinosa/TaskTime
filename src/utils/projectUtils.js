import { getCurrentWeekStart } from '../utils/dateUtils';

export function getTextColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 160 ? "#222" : "#fff";
}

/* return object with the project object and time spent of project this week in minutes*/
export function getWeeklyProjectStats(projects, sessions) {
        const weekStart = getCurrentWeekStart();
        const projectMap = new Map();
        const projectStats = [];

        const date = new Date(weekStart);

        for (let index = 0; index < 7; index++) {
            date.setDate(date.getDate() + 1);

            const dateKey = date.toLocaleDateString('en-US');
            const todaySessions = sessions.filter(session => session.date === dateKey);

            todaySessions.forEach((session => {
                const timeSpent = (session?.durationSeconds ?? 0) / 60;
                projectMap.set(session.projectId, timeSpent + (projectMap.get(session.projectId) || 0));
            }))
        };

        for (const [id, time] of projectMap) {
            const projectObj = projects.find(project => project.id === id);

            if (projectObj) {
                projectStats.push({project: projectObj, time});
            }
        }
        return projectStats;
}
