import './TodayTaskList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPlay, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { formatMinutesHHMM } from '../../utils/timeUtils'; 
import { formatISOMMDD } from '../../utils/dateUtils';
import { getDueStatus, getLateTasks } from '../../utils/taskUtils';
import { getTextColor } from '../../utils/projectUtils';
import { useState } from 'react';

function TodayTaskList({tasksByDate, handleAddTask, handleEditTask, handleDeleteTask, 
                        handleToggleTask, handleUpdateTask, timer, setTimer, 
                        projects, setCurrentProjectId, setSelectedTask
}) {
    const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.toLocaleDateString('en-US', {weekday: 'long'});
    const dateKey = today.toLocaleDateString();

    const lateTasks = getLateTasks(tasksByDate);
    const todayTasks = (tasksByDate[dateKey] ?? []).concat(lateTasks);

    let numOfTasksRemaining = 0;
    let totalNumOfTasks = 0;
    let estimatedTimeLeft = 0;
    for (let task of todayTasks) {
        if (!task.isDone) {
            ++numOfTasksRemaining;
            estimatedTimeLeft += task.time;
        }
        totalNumOfTasks++;
    }
    const numOfTasksDone = totalNumOfTasks - numOfTasksRemaining;
    const percent = totalNumOfTasks > 0 
            ? Math.min((numOfTasksDone / totalNumOfTasks) * 100, 100)
            : 0;

    function handleTaskDropdown() {
        setIsCompletedTasksOpen(prev => !prev);
    }

    const activeTasks = todayTasks.filter(task => !task.isDone);
    const completedTasks = todayTasks.filter(task => task.isDone);

    return (
        <div className="today-task-container">
            <div className="today-task-heading">
                <h1>Daily Tasks</h1>
                <p className="today-task-date">{dayOfWeek}, {dateKey}</p>
            </div>
            <div className="today-task-subheading">
                <div className="tasks-remaining-container">
                    <p>Tasks remaining: {numOfTasksRemaining}</p>
                    <div className="task-list-progress-bar"
                        style={{ "--progress": `${percent}%`}}>
                    </div>
                </div>
                {/*
                <button type="button" className="today-tasks-filter-btn">
                    Filter
                </button>
                */}
            </div>
            <div className="task-body">
                <div className="today-task-list">
                    <ul className="today-task-list-scroll">
                        {activeTasks.map(task =>  {
                            const project = projects.find(p => p.id === task.projectId);
                            return (
                            <li
                                key={task.id}
                                className={`today-list-item ${getDueStatus(task)}`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={task.isDone}
                                    onChange={() => handleToggleTask((task.dateKey ?? dateKey), task.id)} 
                                />
                                <span 
                                    className="task-text"
                                    onClick={() => handleEditTask((task.dateKey ?? dateKey), task)}
                                >
                                    {task.name}
                                    {task.time ? ` - ${formatMinutesHHMM(task.time)}` : ""}  
                                    {task.dueDate && (
                                        <span className={`task-due-date ${getDueStatus(task)}`}>
                                            <span className={`date-separator ${getDueStatus(task)}`}> • </span> 
                                            {formatISOMMDD(task.dueDate)}
                                        </span>
                                    )}
                                </span>
                                <div className="start-project-container">
                                    {project.id !== 0 && 
                                        <span
                                            style={{
                                                background: project?.color,
                                                color: getTextColor(project?.color)
                                            }}
                                            className="task-list-project-name">
                                            {project?.name}
                                        </span> 
                                    }
                                    <button
                                        type="button"
                                        className="project-start-btn"
                                            onClick={() => {
                                                setCurrentProjectId(task.projectId);
                                                setSelectedTask(task);

                                                setTimer(previous => ({
                                                    ...previous,
                                                    isRunning: true,
                                                    startTime:
                                                        previous.elapsedSeconds === 0
                                                            ? Date.now()
                                                            : Date.now() - previous.elapsedSeconds * 1000
                                                }));
                                            }}
                                    >
                                        <FontAwesomeIcon icon={faPlay} />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={(e) => {handleDeleteTask((task.dateKey ?? dateKey), task.id)}}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </li>    
                        )})}
                    </ul>
                </div>
                <hr className="divider"></hr>
                <div className={`completed-tasks-list ${isCompletedTasksOpen? "open" : ""}`}>
                    <button
                        type="button"
                        className="completed-tasks-dropdown-btn"
                        onClick={() => handleTaskDropdown()}
                    >
                        <FontAwesomeIcon icon={isCompletedTasksOpen? 
                            faChevronUp : faChevronDown} className="chevron" />
                        Completed Tasks ({numOfTasksDone})
                    </button>
                    <ul className="completed-tasks-scroll">
                        {isCompletedTasksOpen && completedTasks.map(task => {
                            const project = projects.find(p => p.id === task.projectId);
                            return (
                            <li key={task.id} className="completed-list-item">
                                <input 
                                    type="checkbox" 
                                    checked={task.isDone}
                                    onChange={() => handleToggleTask((task.dateKey ?? dateKey), task.id)} 
                                />
                                <span 
                                    className="task-text"
                                >
                                    {task.name}
                                    {task.time ? ` - ${formatMinutesHHMM(task.time)}` : ""}  
                                    {task.dueDate && (
                                        <span className={`task-due-date ${getDueStatus(task)}`}>
                                            <span className={`date-separator ${getDueStatus(task)}`}> • </span> 
                                            {formatISOMMDD(task.dueDate)}
                                        </span>
                                    )}
                                </span>
                                <div className="start-project-container">
                                    {project.id !== 0 && 
                                        <span
                                            style={{
                                                background: project?.color,
                                                color: getTextColor(project?.color)
                                            }}
                                            className="task-list-project-name">
                                            {project?.name}
                                        </span> 
                                    }
                                </div>

                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={(e) => {handleDeleteTask((task.dateKey ?? dateKey), task.id)}}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </li>
                        )})}
                    </ul>
                </div>

            </div>
            <hr className="divider"></hr>
            <div className="today-task-list-footing">
                <div className="estimated-time-remaining">
                    <p>Estimated time left: {estimatedTimeLeft !== 0 
                                            ? formatMinutesHHMM(estimatedTimeLeft) 
                                            : "0m"}
                    </p>
                </div>
                <button
                    type="button"
                    className="add-task-btn"
                    onClick={() => handleAddTask(dateKey)}
                >
                Add task
                </button>
            </div>
        </div>
    );
}

export default TodayTaskList