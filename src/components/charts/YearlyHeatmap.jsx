import { getYearlyProjectHeatmapData } from '../../utils/statsUtils';
import { formatMinutesHHMM } from '../../utils/timeUtils';
import './YearlyHeatmap.css';

function YearlyHeatmap({ sessions, year, projectId }) {
    const weeks = getYearlyProjectHeatmapData(year, sessions, projectId);

    const weekStride = 15;

    const monthLabels = [];

    weeks.forEach((week, weekIndex) => {
        week.forEach(day => {
            const date = new Date(day.dateKey);

            if (
                day.isInYear &&
                date.getDate() === 1
            ) {
                monthLabels.push({
                    name: date.toLocaleString("en-US", {
                        month: "short"
                    }),
                    left: weekIndex * weekStride
                });
            }
        });
    });

    return (
        <div className='yearly-heatmap'>
            <div></div>

            <div className='month-labels'>
                {monthLabels.map(month => (
                    <span
                        key={month.name}
                        className='month-label'
                        style={{
                            left: `${month.left}px`
                        }}
                    >
                        {month.name}
                    </span>
                ))}
            </div>

            <div className='weekday-labels'>
                <span className='weekday-label'>Mon</span>
                <span className='weekday-label' style={{"top": "29px"}}>Wed</span>
                <span className='weekday-label' style={{"top": "59px"}}>Fri</span>
            </div>

            <div className='weeks-container'>
                {weeks.map((week, weekIndex) => (
                    <div
                        className="heatmap-week"
                        key={weekIndex}
                    >
                        {week.map(day => (
                            <div
                                key={day.dateKey}
                                title={`${day.dateKey} ${formatMinutesHHMM(day.totalSessionTime / 60)}`}
                                className={`heatmap-day ${
                                    !day.isInYear ? "outside-year" : ""
                                }`}
                                data-tier={day.tier}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default YearlyHeatmap