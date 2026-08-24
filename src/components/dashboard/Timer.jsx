import './Timer.css';
import { useState, useEffect, useRef } from 'react';
import { formatSecondsHHMMSS } from '../../utils/timeUtils';
import DropdownSelector from './DropdownSelector';

function Timer({projects, setProjects, timeByDate, setTimeByDate,
                currentProjectId, setCurrentProjectId, selectedTask,
                setSelectedTask, tasksByDate, handleAddTask,
                setIsCreateProjectOpen, setSessions, timer, setTimer,
                handleAddTaskForCurrentProject }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const today = new Date();
    const dateKey = today.toLocaleDateString();
    const currentProject = projects.find(p => p.id === currentProjectId);

    const {
        isRunning,
        startTime,
        elapsedSeconds
    } = timer;

    const dropdownRef = useRef(null);

    useEffect(() => {
        const isClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            return;
        }

        document.addEventListener("click", isClickOutside);

        return () => {
            document.removeEventListener("click", isClickOutside);
        }
    }, [])

    function handleClick() {
        if (!isRunning) {
            setTimer(previous => ({
                ...previous,
                isRunning: true,
                startTime:
                    previous.elapsedSeconds === 0
                        ? Date.now()
                        : Date.now() - previous.elapsedSeconds * 1000
            }));
            return;
        }
        else {
            setTimer(previous => ({
                ...previous,
                isRunning: false
            }));
        }
    }

    function handleEndSession() {
        const endTime = new Date().toISOString();

        setProjects(prevProjects => 
            prevProjects.map(project => 
                project.id === currentProjectId
                ? { ...project, timeSpent: project.timeSpent + elapsedSeconds }
                : project
            )
        )

        setTimeByDate(prevTimeByDate => (
            {
                ...prevTimeByDate,
                [dateKey]: (prevTimeByDate[dateKey] ?? 0) + elapsedSeconds
            }
        ))

        setSessions(prevSessions => (
            [
                ...prevSessions,
                {
                    id: Date.now(),
                    projectId: currentProjectId,
                    taskId: selectedTask?.id ?? null,
                    startTime: new Date(startTime).toISOString(),
                    endTime,
                    durationSeconds: elapsedSeconds,
                    date: dateKey
                }
            ]
        ))

        setTimer({
            isRunning: false,
            startTime: null,
            elapsedSeconds: 0
        })
    }

    return (
        <div className="timer">
           <p className="time">{formatSecondsHHMMSS(elapsedSeconds)}</p> 
           <div className="selector-wrapper" ref={dropdownRef}>
            <div className="selector-container" style={{ "color": `${currentProject?.color}`}}
                    onClick={() => setIsDropdownOpen(prev => !prev)}>
                <div className="selector-text"
                     title={`${currentProject?.name}${selectedTask?.name ? `: ${selectedTask.name}` : ""}`}>
                    <span className="project-name">
                        {currentProject?.name ?? "No Project"}
                    </span>
                    <span className="task-name">
                        {selectedTask?.name ? `: ${selectedTask.name}` : ""}
                    </span>
                </div>
            </div>
            <div className="dropdown-container">
                    { isDropdownOpen && 
                        <div onClick={(e) => e.stopPropagation()}>
                            <DropdownSelector
                                projects={projects}
                                currentProjectId={currentProjectId}
                                setCurrentProjectId={setCurrentProjectId}
                                tasksByDate={tasksByDate}
                                setSelectedTask={setSelectedTask}
                                handleAddTaskForCurrentProject={handleAddTaskForCurrentProject}
                                setIsDropdownOpen={setIsDropdownOpen}
                                setIsCreateProjectOpen={setIsCreateProjectOpen}
                            />
                        </div>
                    }
            </div>
           </div>

            <div className="btn-container">
            {elapsedSeconds > 0 && (
                <>
                <button
                    type="button"
                    className={isRunning ? "btn pause" : "btn start"}
                    onClick={handleClick}
                >
                    {isRunning ? "pause" : "resume"}
                </button>

                <button
                    type="button"
                    className="btn end"
                    onClick={handleEndSession}
                >
                    end
                </button>
                </>
            )}

            {elapsedSeconds === 0 && (
                <button
                type="button"
                className="btn start"
                onClick={handleClick}
                >
                    start
                </button>
            )}
            </div>
        </div>
    );
}

export default Timer