import './WeeklyGoalProgress.css';
import ProgressBar from '../charts/ProgressBar';
import { formatMinutesHH, getWeeklyTotalTime } from '../../utils/timeUtils';
import { getCurrentWeekRange, getCurrentWeekStart, getDateKey, getTodayDate, getWeekStart } from '../../utils/dateUtils';
import { calculateGoalPercentage } from '../../utils/mathUtils';
import { faFontAwesome } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatMinutesHHMM, formatMinutesHHMMIncludeZero } from '../../utils/timeUtils';

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
        pastWeeksTimePercentData.unshift({
            percent: percent,
            totalTime: weeklyTime / 60, // mins
            weekRange: getCurrentWeekRange(current)
        });

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
                    {pastWeeksTimePercentData.map((week, index) => {
                        return (
                            <li key={index} className='past-week-progress-bar'>
                                <ProgressBar
                                    percent={week.percent}
                                    width="200px"
                                    height="20px"
                                    fillColor={week.percent >= 100 ? "var(--green)": "var(--blue)"}
                                    backgroundColor="var(--background)"
                                    hoverTitle={`${week.weekRange} • ${formatMinutesHHMMIncludeZero(week.totalTime)}`}
                                />
                                <div className={`percent`}>
                                    {week.percent < 100 && <p>{week.percent.toFixed(0)}%</p>}
                                    {week.percent >= 100 &&
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