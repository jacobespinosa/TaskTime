import { useState } from 'react';
import { getDailyFocusTimeData, getMonthlyFocusTimeData, getYearlyFocusTimeData } from '../../utils/statsUtils';
import { formatMinutesHHMMIncludeZero } from '../../utils/timeUtils';
import './FocusTimeTrend.css';
import ColumnBarChart from '../charts/ColumnBarChart';
import LineChart from '../charts/LineChart';

function FocusTimeTrend({timeByDate}) {
    const [dateRangeFilter, setDateRangeFilter] = useState("monthly");

    const dailyData = getDailyFocusTimeData(timeByDate);
    const sortedDailyDataByTime = dailyData.toSorted((a, b) => b.time - a.time);
    const dailyDataMostTime = sortedDailyDataByTime[0].time;
    const dailyDataMaxMinutes = Math.ceil(dailyDataMostTime / 60) * 60;

    const monthlyData = getMonthlyFocusTimeData(timeByDate);
    const sortedMonthlyDataByTime = monthlyData.toSorted((a, b) => b.time - a.time);
    const monthlyDataMostTime = sortedMonthlyDataByTime[0].time;
    const monthlyMaxHours = Math.ceil(monthlyDataMostTime);
    const roundedMonthlyMaxHours = Math.ceil(monthlyMaxHours / 5) * 5;

    const yearlyData = getYearlyFocusTimeData(timeByDate);
    const sortedYearlyDataByTime = yearlyData.toSorted((a, b) => b.time - a.time);
    const yearlyDataMostTime = sortedYearlyDataByTime[0].time;
    const yearlyMaxHours = Math.ceil(yearlyDataMostTime);

    let interval = 5;
    if (yearlyMaxHours > 200) interval = 50;
    else if (yearlyMaxHours > 100) interval = 25;
    else if (yearlyMaxHours > 50) interval = 20;
    else if (yearlyMaxHours > 25) interval = 10;

    const roundedYearlyMaxHours = Math.ceil(yearlyMaxHours / interval) * interval;

    return (
        <div className='focus-time-trend-container'>
            <header className='focus-time-trend-header'>
                <h4 className="focus-time-trend-title">
                    Focus Time Trend
                </h4>
                <div className="date-range-filter-options">
                    <button type='button'
                            className={`${dateRangeFilter === "daily" ? "active" : ""}`}
                            onClick={() => setDateRangeFilter("daily")}        
                    >
                        daily
                    </button>
                    <div className='divider-vertical'></div>
                    <button type='button'
                            className={`${dateRangeFilter === "monthly" ? "active" : ""}`}
                            onClick={() => setDateRangeFilter("monthly")}         
                    >
                        monthly
                    </button>
                    <div className='divider-vertical'></div>
                    <button type='button'
                            className={`${dateRangeFilter === "yearly" ? "active" : ""}`}
                            onClick={() => setDateRangeFilter("yearly")}         
                    >
                        yearly
                    </button>
                </div>
            </header>
            {dateRangeFilter === "daily" &&
                <div className='daily-focus-time-trend'>
                    <ColumnBarChart 
                            title={""}
                            data={dailyData}
                            maxValue={dailyDataMaxMinutes}
                            getKey={item => item.day}
                            getValue={item => item.time}
                            getBottomLabel={item => item.day}
                            getTopLabel={() => {}}
                            getHoverInfo={item => `Time: ${formatMinutesHHMMIncludeZero(item.time)}`}
                            columnWidth={"14px"}
                            columnGap={"0.3rem"}
                    />
                </div>
            }
            {dateRangeFilter === "monthly" &&
                <div className='monthly-focus-time-trend'>
                    <LineChart 
                        title={""}
                        data={monthlyData}
                        maxValue={roundedMonthlyMaxHours}
                        getBottomLabel={(item) => item.month}
                        chartWidth={400}
                        chartHeight={200}
                        interval={5}
                    />
                </div>
            }
            {dateRangeFilter === "yearly" &&
                <div className='yearly-focus-time-trend'>
                    <LineChart
                        title={""}
                        data={yearlyData}
                        maxValue={roundedYearlyMaxHours}
                        getBottomLabel={(item) => item.month}
                        chartWidth={400}
                        chartHeight={200}
                        interval={interval}
                    />
                </div>
            }
        </div>
    );
}

export default FocusTimeTrend