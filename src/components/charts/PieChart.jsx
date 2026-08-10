import './PieChart.css';
import { getWeeklyProjectStats } from '../../utils/projectUtils';
import { formatMinutesHHMMIncludeZero } from '../../utils/timeUtils';
import { getCurrentWeekStart } from '../../utils/dateUtils';

function PieChart({title, projects, sessions, timeByDate, width, setIsPieChartHovered}) {
    const currentWeekStart = getCurrentWeekStart()
    const projectStats = getWeeklyProjectStats(projects, sessions);
    const sortedProjectStats = projectStats.toSorted((a, b) => b.time - a.time);
    const totalWeeklyTime = sortedProjectStats.reduce(
        (total, { time }) => total + time,
        0
    );

    let start = 0;
    const pieGradient = `conic-gradient(${sortedProjectStats
        .map(({ project, time }) => {
            const percent = (time / totalWeeklyTime) * 100;

            const slice = `${project.color} ${start}% ${start + percent}%`;

            start += percent;

            return slice;
        }).join(", ")})`;

    return (
        <div className='pie-chart-container'>
            <h4 className='pie-chart-title'>{title}</h4>
            <div className='pie-chart'
                style={{
                    background: pieGradient,
                    width
                }}
                onMouseEnter={() => setIsPieChartHovered(true)}
                onMouseLeave={() => setIsPieChartHovered(false)}
            >
                <div className='pie-chart-center'
                     onMouseEnter={() => setIsPieChartHovered(false)}
                     onMouseLeave={() => setIsPieChartHovered(true)}
                >
                    {formatMinutesHHMMIncludeZero(totalWeeklyTime)}
                </div>
            </div>
        </div>
    );
}

export default PieChart