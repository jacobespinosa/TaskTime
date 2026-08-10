import './AnalyticsPage.css';
import SummaryCardContainer from '../components/analytics/SummaryCardContainer';
import FocusTimeTrend from '../components/analytics/FocusTimeTrend';
import WeeklyGoalProgress from '../components/analytics/WeeklyGoalProgress';
import PieChart from '../components/charts/PieChart';
import ProjectTimeBreakdown from '../components/charts/ProjectTimeBreakdown';
import ProgressRing from '../components/charts/ProgressRing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import ProjectConsistency from '../components/analytics/ProjectConsistency';

function AnalyticsPage({timeByDate, weeklyTimeGoals, setWeeklyTimeGoals, tasksByDate,
                        projects, sessions, projectActivityByDate
}) {
    const [isPieChartHovered, setIsPieChartHovered] = useState(false);
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

    const progressTrackedProjects = projects.filter(project => project.progressTracking);
    const currentProject = progressTrackedProjects[currentProjectIndex];
    const { currentValue, goalValue, unit } = currentProject.progressTracking;

    function handlePreviousProject() {
        setCurrentProjectIndex(currentIndex =>
            currentIndex === 0
                ? progressTrackedProjects.length - 1
                : currentIndex - 1
        );
    }

    function handleNextProject() {
        setCurrentProjectIndex(currentIndex =>
            currentIndex === progressTrackedProjects.length - 1
                ? 0
                : currentIndex + 1
        );
    }

    return (
        <main className='analytics'>
            <section className='analytics-content'>
                <div className='analytics-header'>
                    <h1>Analytics</h1>
                </div>
                <div className='analytics-container'>
                    <div className="summary-card-area">
                        <SummaryCardContainer 
                            timeByDate={timeByDate}
                            weeklyTimeGoals={weeklyTimeGoals}
                            tasksByDate={tasksByDate}
                        />
                    </div>
                    <div className="weekly-goal-progress-area">
                        <WeeklyGoalProgress 
                            timeByDate={timeByDate}
                            weeklyTimeGoals={weeklyTimeGoals}
                        />
                    </div>
                    <div className='focus-time-trend-area'>
                        <FocusTimeTrend 
                            timeByDate={timeByDate}
                        />
                    </div>
                    <div className='pie-chart-area'>
                        <PieChart 
                            title="Project Breakdown"
                            projects={projects}
                            sessions={sessions}
                            timeByDate={timeByDate}
                            width="300px"
                            setIsPieChartHovered={setIsPieChartHovered}
                        />
                        {isPieChartHovered &&
                            <div className='project-breakdown-hover-container'>
                                <ProjectTimeBreakdown 
                                    projects={projects}
                                    sessions={sessions}
                                />
                            </div>
                        }
                    </div>
                    <div className="project-progress-ring-area">
                            <button type='button'
                                    className='project-progress-arrow prev'
                                    onClick={() => handlePreviousProject()}
                                    aria-label="Previous project"
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <ProgressRing 
                                value={currentValue}
                                goal={goalValue}
                                title={`${currentProject.name} Progress`}
                                type="number"
                                onClick={""}
                                width={"300px"}
                                unit={unit}
                            />
                            <button
                                type="button"
                                className="project-progress-arrow next"
                                onClick={() => handleNextProject()}
                                aria-label="Next project"
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                    </div>
                    <div className='project-consistency-area'>
                        <ProjectConsistency 
                            projects={projects}
                            tasksByDate={tasksByDate}
                            projectActivityByDate={projectActivityByDate}
                        />
                    </div>
                    <div className='project-heatmap-area'>

                    </div>
                </div>
            </section>
        </main>
    );
}

export default AnalyticsPage