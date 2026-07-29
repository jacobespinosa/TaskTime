import './SummaryCardContainer.css';
import SummaryCard from './SummaryCard';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatMinutesHHMMIncludeZero, getMonthlyTotalTime, getWeeklyTotalTime, getYearlyTotalTime } from '../../utils/timeUtils';
import { getCurrentMonthStart, getCurrentWeekStart, getCurrentYearStart, getDaysElapsed } from '../../utils/dateUtils';

function SummaryCardContainer({timeByDate, weeklyTimeGoals}) {
    const [dateRangeFilter, setDateRangeFilter] = useState("This Month");
    const [isDateRangeFilterOpen, setIsDateRangeFilterOpen] = useState(false);

    const weekStart = getCurrentWeekStart();
    const monthStart = getCurrentMonthStart();
    const yearStart = getCurrentYearStart();
    const totalWeeklyTime = getWeeklyTotalTime(timeByDate, weekStart);
    const totalMonthlyTime = getMonthlyTotalTime(timeByDate, monthStart);
    const totalYearlyTime = getYearlyTotalTime(timeByDate, yearStart);
    const weeklyTimeGoal = weeklyTimeGoals[weekStart];

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
                        ? 

    const totalTimeFormatted = formatMinutesHHMMIncludeZero(totalTime);
    const dailyAvgTime = totalTime !== 0 ? totalTime / daysElapsed : 0;
    const dailyAvgFormatted = formatMinutesHHMMIncludeZero(dailyAvgTime);

    return (
        <div className='summary-card-container'>
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
                    value={}
                    title={"Goal Rate"}
                />
                <SummaryCard 
                    value={}
                    title={"Task Rate"}
                />
            </div>
        </div>
    );
}

export default SummaryCardContainer