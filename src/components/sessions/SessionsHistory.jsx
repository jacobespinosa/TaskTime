import './SessionsHistory.css';
import { getTodayDate } from '../../utils/dateUtils';
import { groupSessionsByWeekAndDay } from '../../utils/sessionUtils';
import WeeklySessions from './WeeklySessions';

function SessionsHistory({sessions, setSessions, tasksByDate, projects, timeByDate,
                          weeklyTimeGoal, handleEditSession
}) {
    const groupedSessions = groupSessionsByWeekAndDay(sessions);
    return (
        <div className='sessions-history-container'>
            {groupedSessions.map(week => (
                <WeeklySessions
                    key={week.weekStart}
                    week={week}
                    setSessions={setSessions}
                    tasksByDate={tasksByDate}
                    projects={projects}
                    timeByDate={timeByDate}
                    weeklyTimeGoal={weeklyTimeGoal}
                    handleEditSession={handleEditSession}
                />
            ))}
        </div>
    );
}

export default SessionsHistory