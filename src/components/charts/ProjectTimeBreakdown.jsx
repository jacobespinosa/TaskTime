import './ProjectTimeBreakdown.css';
import { getWeeklyProjectStats } from '../../utils/projectUtils';
import { formatMinutesHHMMIncludeZero, getWeeklyTotalTime } from '../../utils/timeUtils';

function ProjectTimeBreakdown({ projects, sessions }) {
    const projectStats = getWeeklyProjectStats(projects, sessions);
    let sortedProjectStats = projectStats.toSorted((a, b) => b.time - a.time);
    const mostTimeSpent = sortedProjectStats[0]?.time ?? 0;
    const totalWeeklyTime = sortedProjectStats.reduce(
        (total, { time }) => total + time,
        0
    );
    if (sortedProjectStats.length > 6) {
        const extraProjects = sortedProjectStats.slice(5);
        const totalExtraProjectTime = extraProjects.reduce((totalTime, project) => {
            return totalTime + project.time;
        }, 0);

        const projectOther = {
            project: {
                id: Date.now(),
                name: "Other",
                color: "#9CA3AF",
            },
            time: totalExtraProjectTime
        };

        sortedProjectStats = [
            ...sortedProjectStats.slice(0, 5),
            projectOther
        ];
    }

    return (
        <div className="project-weekly-breakdown-container">
            <ul className="project-weekly-breakdown-list">
                {sortedProjectStats.map(({project, time}) => {
                    const percent = Math.min((time / mostTimeSpent) * 100, 100);
                    const totalWeekPercent = Math.min((time / totalWeeklyTime) * 100, 100).toFixed(0);
                    return (
                        <li className="project-weekly-breakdown-item"
                            key={project.id}>
                            <div className="project-weekly-breakdown-label">
                                <span className="color-dot"
                                    style={{"color": `${project.color}`}}>
                                        ●
                                </span>
                                <span className="project-name">{project.name}</span>
                            </div>
                            <div className="project-weekly-breakdown-bar"
                                 style={{
                                    "--progress": `${percent}%`,
                                    "--projectColor": `${project.color}`
                                 }}>
                            </div>
                            <div className="breakdown-time-percent-container">
                                <span className="project-weekly-breakdown-time">
                                    {formatMinutesHHMMIncludeZero(time)}
                                </span>
                                <span className="project-weekly-breakdown-percent">
                                    ({totalWeekPercent}%)
                                </span>
                            </div>
                        </li>
                    )})}
            </ul>
        </div>
    );
}

export default ProjectTimeBreakdown