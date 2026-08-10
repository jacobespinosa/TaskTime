import './SummaryCardContainer.css';
import SummaryCard from './SummaryCard';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatMinutesHHMMIncludeZero, getMonthlyTotalTime, getWeeklyTotalTime, getYearlyTotalTime } from '../../utils/timeUtils';
import { getCurrentMonthStart, getCurrentWeekStart, getCurrentYearStart, getDateKey, getDaysElapsed } from '../../utils/dateUtils';
import { calculateGoalPercentage } from '../../utils/mathUtils';
import { getAverageMonthlyTimeGoalPercentage, getAverageYearlyTimeGoalPercentage, getMonthlyTaskStats, getYearlyTaskStats } from '../../utils/statsUtils';
import { getWeeklyTaskStats } from '../../utils/taskUtils';

function SummaryCardContainer({timeByDate, weeklyTimeGoals, tasksByDate}) {
    const [dateRangeFilter, setDateRangeFilter] = useState("This Month");
    const [isDateRangeFilterOpen, setIsDateRangeFilterOpen] = useState(false);

    const weekStart = getCurrentWeekStart();
    const weekStartKey = getDateKey(weekStart);
    const monthStart = getCurrentMonthStart();
    const yearStart = getCurrentYearStart();
    const totalWeeklyTime = getWeeklyTotalTime(timeByDate, weekStart);
    const totalMonthlyTime = getMonthlyTotalTime(timeByDate, monthStart);
    const totalYearlyTime = getYearlyTotalTime(timeByDate, yearStart);

    const { totalTasks, totalTasksCompleted } = getWeeklyTaskStats(tasksByDate);
    const { totalMonthlyTasks, totalMonthlyTasksCompleted } = getMonthlyTaskStats(tasksByDate, monthStart);
    const { totalYearlyTasks, totalYearlyTasksCompleted } = getYearlyTaskStats(tasksByDate, yearStart);

    const weeklyTimeGoal = weeklyTimeGoals[weekStartKey];

    const weeklyTimeGoalPercent = calculateGoalPercentage(totalWeeklyTime, weeklyTimeGoal);

    const monthlyTimeGoal = getAverageMonthlyTimeGoalPercentage(timeByDate, weeklyTimeGoals, monthStart);
    const yearlyTimeGoal = getAverageYearlyTimeGoalPercentage(timeByDate, weeklyTimeGoals, yearStart);

    const weeklyTaskGoalPercent = calculateGoalPercentage(totalTasksCompleted, totalTasks);
    const monthlyTaskGoalPercent = calculateGoalPercentage(totalMonthlyTasksCompleted, totalMonthlyTasks);
    const yearlyTaskGoalPercent = calculateGoalPercentage(totalYearlyTasksCompleted, totalYearlyTasks);

    const daysElapsed = dateRangeFilter === "This Week"
                        ? getDaysElapsed(weekStart)
                        : dateRangeFilter === "This Month"
                        ? getDaysElapsed(monthStart)
                        : getDaysElapsed(yearStart);
    const totalTime = dateRangeFilter === "This Week" 
                        ? totalWeeklyTime
                        : dateRangeFilter === "This Month"
                        ? totalMonthlyTime
                        : totalYearlyTime;
    const timeGoalAvg = dateRangeFilter === "This Week"
                        ? weeklyTimeGoalPercent
                        : dateRangeFilter === "This Month"
                        ? monthlyTimeGoal
                        : yearlyTimeGoal
    const taskGoalAvg = dateRangeFilter === "This Week"
                        ? weeklyTaskGoalPercent
                        : dateRangeFilter === "This Month"
                        ? monthlyTaskGoalPercent
                        : yearlyTaskGoalPercent
    const dailyAvgTime = totalTime !== 0 ? totalTime / daysElapsed : 0;

    const totalTimeFormatted = formatMinutesHHMMIncludeZero(totalTime/60);
    const dailyAvgFormatted = formatMinutesHHMMIncludeZero(dailyAvgTime/60);
    const timeGoalAvgFormatted = `${timeGoalAvg.toFixed(0)}%`;
    const taskGoalAvgFormatted = `${taskGoalAvg.toFixed(0)}%`;

    const dropdownRef = useRef(null);
    useEffect(() => {
        const isClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target))
            {
                setIsDateRangeFilterOpen(false);
            }
            return;
        }

        document.addEventListener("click", isClickOutside, true);

        return () => {
            document.removeEventListener("click", isClickOutside, true);
        }
    }, [])

    return (
        <div className='summary-card-container'>
            <div className='date-range-filter'
                 ref={dropdownRef}
            >
                <button type="button"
                        className='date-range-filter-btn'
                        onClick={() => setIsDateRangeFilterOpen(prev => !prev)}
                >
                    {dateRangeFilter} 
                    <span className='filter-icon'>
                        {isDateRangeFilterOpen 
                                    ? <FontAwesomeIcon icon={faChevronUp}/>
                                    : <FontAwesomeIcon icon={faChevronDown}/> }
                    </span>
                </button>
                {isDateRangeFilterOpen &&
                    <div className="date-range-filter-menu">
                        <button onClick={() => setDateRangeFilter("This Week")}>Weekly</button>
                        <button onClick={() => setDateRangeFilter("This Month")}>Monthly</button>
                        <button onClick={() => setDateRangeFilter("This Year")}>Yearly</button>
                    </div>
                }
            </div>
            <div className='summary-cards'>
                <SummaryCard 
                    value={totalTimeFormatted}
                    title={"Focus Time"}
                />
                <SummaryCard 
                    value={dailyAvgFormatted}
                    title={"Daily Avg"}
                />
                <SummaryCard 
                    value={timeGoalAvgFormatted}
                    title={"Goal Rate"}
                />
                <SummaryCard 
                    value={taskGoalAvgFormatted}
                    title={"Task Rate"}
                />
            </div>
        </div>
    );
}

export default SummaryCardContainer