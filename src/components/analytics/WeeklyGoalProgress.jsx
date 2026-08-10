import './WeeklyGoalProgress.css';
import ProgressBar from '../charts/ProgressBar';
import { formatMinutesHH, getWeeklyTotalTime } from '../../utils/timeUtils';
import { getCurrentWeekStart, getDateKey, getTodayDate, getWeekStart } from '../../utils/dateUtils';
import { calculateGoalPercentage } from '../../utils/mathUtils';
import { faFontAwesome } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function WeeklyGoalProgress({timeByDate, weeklyTimeGoals}) {
    const today = getTodayDate();

    const eightWeeksAgo = new Date(today);
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 8 * 7);
    const eightWeeksAgoStartWeek = getWeekStart(eightWeeksAgo);

    const currentWeekStart = getCurrentWeekStart();
    const currentWeekStartDateKey = getDateKey(currentWeekStart);

    const currentTotalWeeklyTime = getWeeklyTotalTime(timeByDate, currentWeekStart);
    const currentWeeklyTimeGoal = weeklyTimeGoals[currentWeekStartDateKey] ?? 0;
    let currentWeekPercent = calculateGoalPercentage(currentTotalWeeklyTime, currentWeeklyTimeGoal).toFixed(0);

    const current = new Date(eightWeeksAgoStartWeek);
    const pastWeeksTimePercentData = [];
    while (current < currentWeekStart) {
        const currentDateKey = getDateKey(current);

        const weeklyTime = getWeeklyTotalTime(timeByDate, current);
        const weeklyTimeGoal = weeklyTimeGoals[currentDateKey] ?? 0;

        const percent = calculateGoalPercentage(weeklyTime, weeklyTimeGoal);
        pastWeeksTimePercentData.unshift(percent);

        current.setDate(current.getDate() + 7);
    }

    return (
        <div className='weekly-goal-progress-container'>
            <header className='weekly-goal-progress-header'>
                <h4 className='title'>Weekly Goal Progress</h4>
                <div className='divider'></div>
            </header>
            <div className='current-weekly-goal-progress'>
                <p className='title'>Current Week</p>
                <div className='current-progress-bar'>
                    <ProgressBar
                        percent={currentWeekPercent}
                        width="200px"
                        height="20px"
                        fillColor={currentWeekPercent >= 100 ? "var(--green)": "var(--blue)"}
                        backgroundColor="var(--background)"
                    />
                    <div className={`percent`}>
                        {currentWeekPercent < 100 && <p>{currentWeekPercent}%</p>}
                        {currentWeekPercent >= 100 &&
                            <FontAwesomeIcon icon={faCheck} className='checkmark'/>
                        }
                    </div>
                </div>
                <div className='stats'>
                    <div className='time'>
                        <p>{formatMinutesHH(currentTotalWeeklyTime/60)} / {formatMinutesHH(currentWeeklyTimeGoal/60)}</p>
                    </div>
                </div>
            </div>
            <div className='past-weekly-goal-progress'>
                <p className='title'>Past 8 Weeks</p>
                <ul className='goals'>
                    {pastWeeksTimePercentData.map((percent, index) => {
                        return (
                            <li key={index} className='past-week-progress-bar'>
                                <ProgressBar
                                    percent={percent}
                                    width="200px"
                                    height="20px"
                                    fillColor={percent >= 100 ? "var(--green)": "var(--blue)"}
                                    backgroundColor="var(--background)"
                                />
                                <div className={`percent`}>
                                    {percent < 100 && <p>{percent.toFixed(0)}%</p>}
                                    {percent >= 100 &&
                                        <FontAwesomeIcon icon={faCheck} className='checkmark'/>
                                    }
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default WeeklyGoalProgress