import { getWeekStart } from "./dateUtils";

export function getSortedSessions(sessions) {
    return sessions.sort((a, b) => b.endTime.localeCompare(a.endTime));
}

/* Return structure:
    [
        {
            weekStart: "7/20/2026",
            days: [
                {
                    dateKey: "7/23/2026",
                    sessions: [session1, session2]
                },
                {
                    dateKey: "7/22/2026",
                    sessions: [session3]
                }
            ]
        },
        {
            weekStart: "7/13/2026",
            days: [
                {
                    dateKey: "7/16/2026",
                    sessions: [session4]
                }
            ]
        }
    ]
*/
export function groupSessionsByWeekAndDay(sessions) {
    const groupedSessions = [];

    for (const session of sessions) {
        const sessionDate = new Date(session.endTime);
        const weekStart = getWeekStart(sessionDate);
        const weekStartKey = weekStart.toLocaleDateString('en-US');
        const dateKey = sessionDate.toLocaleDateString("en-US");

        const existingWeek = groupedSessions.find(
            week => week.weekStart === weekStartKey
        );

        if (!existingWeek) {
            groupedSessions.push(
                {
                    weekStart: weekStartKey,
                    days: [
                        {
                            dateKey,
                            sessions: [session]
                        }
                    ]
                }
            );
            continue;
        }

        const existingDay = existingWeek.days.find(day =>
            day.dateKey === dateKey
        )

        if (!existingDay) {
            existingWeek.days.push({
                dateKey,
                sessions: [session]
            });
        }
        else {
            existingDay.sessions.push(session);
        }

    }

    return groupedSessions;
}

export function getSessionsByProjectId(sessions, projectId) {
    return sessions.filter(session => session.projectId === projectId);
}

export function getSessionsByDate(sessions, dateKey) {
    return sessions.filter(session => session.date === dateKey);
}

export function getTotalSessionDuration(sessions) {
    return sessions.reduce((total, session) => {
        return total + session.durationSeconds;
    }, 0);
}