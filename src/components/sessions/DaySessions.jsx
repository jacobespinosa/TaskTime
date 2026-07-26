import './DaySessions.css';
import { getDateKey, getDaySuffix, getTodayDate, getYesterdayDate } from '../../utils/dateUtils';
import { formatMinutesHHMMIncludeZero, formatTime12Hour } from '../../utils/timeUtils';
import { getTasksArray } from '../../utils/taskUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function DaySessions({day, setSessions, tasksByDate, projects, handleEditSession}) {
    const [openSessionMenuId, setOpenSessionMenuId] = useState(null);

    const today = getTodayDate();
    const todayDateKey = getDateKey(today);
    const yesterday = getYesterdayDate();
    const yesterdayDateKey = getDateKey(yesterday);

    const date = new Date(day.dateKey);
    const month = date.toLocaleDateString('en-US', {month: "short"});
    const dayOfWeek = date.toLocaleDateString('en-US', {weekday: "short"})
    const dayOfMonth = date.getDate();

    const totalDaySessionTime = day.sessions.reduce((totalTime, session) =>
        totalTime + session.durationSeconds, 0
    );

    const dateHeading = day.dateKey === todayDateKey 
                        ? "Today" 
                        : day.dateKey === yesterdayDateKey
                        ? "Yesterday"
                        : `${dayOfWeek}, ${month} ${dayOfMonth}${getDaySuffix(dayOfMonth)}`;

    function handleDeleteSession(sessionId) {
        setSessions(prevSessions => 
            prevSessions.filter(session => session.id !== sessionId)
        );
        setOpenSessionMenuId(null);
    }

    return (
        <div className='day-session-container'>
            <header className='day-session-heading'>
                <h4 className='date-heading'>{dateHeading}</h4>
                <p className='day-session-total-time'>
                    Total: <span className='day-session-time'>
                        {formatMinutesHHMMIncludeZero(totalDaySessionTime/60)}
                    </span>
                </p>
            </header>
            <ul className='day-session-list'>
                {day.sessions.map(session => {
                    const project = projects.find(project => project.id === session.projectId);
                    const task = getTasksArray(tasksByDate).find(task => task.id === session.taskId);

                    const sessionMinutes = session.durationSeconds / 60;
                    const startTime = formatTime12Hour(session.startTime);
                    const endTime = formatTime12Hour(session.endTime);
                    const sessionLabel =
                            project.id === 0
                                ? (task ? task.name : "Unassigned")
                                : task
                                    ? `${project.name}: ${task.name}`
                                    : project.name;
                    const sessionLength = `${formatMinutesHHMMIncludeZero(sessionMinutes)}`;
                    const sessionTimeRange = `${startTime} – ${endTime}`
                    return (
                        <li key={session.id}
                            className='day-session-item'
                            style={{"--projectColor": `${project.color}`}}
                        >
                            <div className="day-session-label">
                                <div className="day-session-label">
                                    {sessionLabel}
                                </div>
                            </div>
                            <div className='day-session-info'>
                                <div className="day-session-time-range">
                                    <span>{startTime}</span>
                                    <span className='seperator-dash'>–</span>
                                    <span>{endTime}</span>
                                </div>
                                <div className='divider-vertical'></div>
                                <div className="day-session-length">
                                    {sessionLength}
                                </div>
                                <div className='divider-vertical'></div>
                                <button type='button'
                                        className='day-session-menu'
                                        onClick={() => setOpenSessionMenuId(
                                            openSessionMenuId === session.id
                                            ? null : session.id
                                        )}
                                >
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                    {openSessionMenuId === session.id &&
                                        <div className='session-menu-dropdown'>
                                            <button type='button'
                                                    onClick={() => handleEditSession(session)}
                                            >
                                                Edit
                                            </button>
                                            <button type='button'
                                                    onClick={() => handleDeleteSession(session.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    }
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default DaySessions