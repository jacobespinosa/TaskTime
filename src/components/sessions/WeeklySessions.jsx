import './WeeklySessions.css';
import DaySessions from './DaySessions';
import { isThisWeek, isLastWeek, getCurrentWeekRange, getCurrentWeekStart,
         getDateKey } from '../../utils/dateUtils';
import { getWeeklyTotalTime } from '../../utils/timeUtils';
import { formatMinutesHHMMIncludeZero } from '../../utils/timeUtils';

function WeeklySessions({week, setSessions, tasksByDate, projects, timeByDate,
                         weeklyTimeGoals, handleEditSession
}) {
    const weeklyTimeGoal = weeklyTimeGoals[week.weekStart];
    const weekStartDateObj = new Date(week.weekStart);
    const weekRange = isThisWeek(weekStartDateObj) 
                        ? "This week"
                        : isLastWeek(weekStartDateObj)
                        ? "Last week"
                        : getCurrentWeekRange(weekStartDateObj);
    const totalWeeklySeconds = getWeeklyTotalTime(timeByDate, weekStartDateObj); 
    const weeklySessionCount = week.days.reduce((totalCount, day) =>
        totalCount + day.sessions.length, 0
    );
    const weeklySessionTimeAvg = weeklySessionCount > 0 ? totalWeeklySeconds / weeklySessionCount : 0;
    const percent = weeklyTimeGoal > 0 ? Math.min((totalWeeklySeconds / weeklyTimeGoal) * 100, 100) : 0;

    return (
        <div className='weekly-session-container'>
            <header className='weekly-session-header'>
                <div className='weekly-session-summary'>
                    <span className='weekly-session-date-range'>{weekRange}</span>
                    <p className="weekly-session-total-time">Week Total: <span className='data'>{formatMinutesHHMMIncludeZero(totalWeeklySeconds / 60)}</span></p>
                </div>
                <dl className="weekly-session-stats">
                    <div className='weekly-session-stat'>
                        <dd className='data'>{weeklySessionCount}</dd> 
                        <dt>{weeklySessionCount === 1 ? "Session" : "Sessions"}</dt>
                    </div>
                    <span className='seperator'>•</span>
                    <div className="weekly-session-stat">
                        <dt>Avg</dt>
                        <dd>{formatMinutesHHMMIncludeZero(weeklySessionTimeAvg / 60)}</dd>
                    </div>
                    <span className='seperator'>•</span>
                    <div className='weekly-session-stat'>
                        <dt>Goal</dt>
                        <dd className={
                            percent < 75 
                            ? "low" : percent < 100
                            ? "close" : "met"
                        }>
                            {percent.toFixed(0)}%
                        </dd>
                    </div>
                </dl>
                <div className='divider'></div>
            </header>
            {week.days.map(day => (
                <DaySessions 
                    day={day}
                    setSessions={setSessions}
                    tasksByDate={tasksByDate}
                    projects={projects}
                    handleEditSession={handleEditSession}
                />
            ))}
        </div>
    );
}

export default WeeklySessions