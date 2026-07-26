import './RecentSessions.css';
import { getTasksArray } from '../../utils/taskUtils';
import { formatMinutesHHMM, formatTime12Hour, formatMinutesHHMMIncludeZero } from '../../utils/timeUtils';

function RecentSessions({sessions, projects, tasksByDate, handleEditSession}) {
    const lastFiveSessions = sessions.sort((a, b) => b.endTime.localeCompare(a.endTime)).slice(0, 5);
    const tasks = getTasksArray(tasksByDate);

    return (
        <div className="recent-sessions-container">
            <div className='recent-sessions-header'>
                <h2 className='recent-sessions-title'>Recent Sessions</h2>
            </div>
            <ul className='recent-sessions-list'>
                {lastFiveSessions.map(session => {
                    const project = projects.find(p => p.id === session.projectId);
                    const task = tasks.find(t => t.id === session.taskId);

                    const sessionMinutes = session.durationSeconds / 60;
                    const startTime = formatTime12Hour(session.startTime);
                    const endTime = formatTime12Hour(session.endTime);
                    const sessionHeader = `${task 
                                            ? task.name 
                                            : project.id !== 0 
                                            ? project.name : "Unassigned"}`;
                    const displayProjectName = `${project.id === 0
                                                    ? ""
                                                    : project.name !== sessionHeader
                                                    ? `${project.name} • ` 
                                                    : "No Task • "}`;
                    const sessionLength = `${formatMinutesHHMMIncludeZero(sessionMinutes)}`;
                    const sessionMeta = `${displayProjectName}`;

                    return (
                        <li key={session.id}
                            className="recent-sessions-item"
                            style={{"--projectColor": `${project.color}`}}
                            onClick={() => handleEditSession(session)}
                        >
                            <div className="recent-session-label">
                                <div className="recent-session-header">
                                    {sessionHeader}
                                </div>
                                <div className="recent-session-meta">
                                    {sessionMeta}
                                    <span className="recent-session-length">
                                        {sessionLength}
                                    </span>
                                </div>
                            </div>
                            <div className="recent-session-time-range">
                                <span>{startTime}</span>
                                <span className='seperator-dash'>–</span>
                                <span>{endTime}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default RecentSessions