import './ProjectDetails.css';
import SortableColumnHeader from '../buttons/SortableColumnHeader';
import { formatMinutesHHMMIncludeZero } from '../../utils/timeUtils';
import { formatISOMMDDYYYY } from '../../utils/dateUtils';
import { getTodayDate, getDateKey } from '../../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTrashCan } from '@fortawesome/free-regular-svg-icons';

function ProjectDetails({project, tasks, handleProjectNameChange,
                         handleProjectColorChange, handleProjectGoalChange,
                         handleProjectUnitChange, handleProjectValueChange, 
                         sortConfig, handleSort,
                         handleEditTask, handleAddTask, handleDeleteTask, 
                         handleToggleTask, setCurrentProjectId}) {
    setCurrentProjectId(project.id);
    const todayDateKey = getDateKey(getTodayDate());
    const sortedTasks = tasks.toSorted((a, b) => {
        const { field, direction } = sortConfig;

        let comparison = 0;
        if (field === "name") {
            comparison = a.name.localeCompare(b.name);
        }
        else if (field === "timeSpent") {
            comparison = a.time - b.time;
        }
        else if (field === "dueDate") {
            console.log(a.dueDate, b.dueDate);
            comparison = (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
        }

        return direction === "ascending"
                    ? comparison
                    : -comparison;
    })

    return (
        <div className="project-details-container">
            <section className="project-overview">
                <div className='project-overview-container'>
                    <h1 className='project-details-section-header'>
                        Details
                    </h1>
                    <div className='input-group'>
                        <label htmlFor="name" className='input-label'>
                            Name
                        </label>
                        <input type="text" 
                               id="name" 
                               className='name-input'
                               value={project.name}
                               onChange={(e) => handleProjectNameChange(e.target.value)}
                        />
                    </div>
                    <div className='divider'></div>
                    <div className='input-group'>
                        <label htmlFor='color' className='input-label'>
                            Color
                        </label>
                        <input type='color' 
                               id="color"
                               className="color-input"
                               value={project.color}
                               onChange={(e) => handleProjectColorChange(e.target.value)}
                        />
                    </div>
                    <div className='divider'></div>
                    {project.progressTracking &&
                        <>
                            <div className='input-group'>
                                <label htmlFor="goal" className='input-label'>
                                    Goal
                                </label>
                                <input type="number"
                                    id="goal"
                                    className='goal-input'
                                    min="1"
                                    value={project.progressTracking.goalValue}
                                    onChange={(e) => handleProjectGoalChange(e.target.value)}
                                />
                            </div>
                            <div className='divider'></div>
                            <div className='input-group'>
                                <label htmlFor='unit' className='input-label'>
                                    Unit
                                </label>
                                <input type="text"
                                    id="unit"
                                    className='unit-input'
                                    value={project.progressTracking.unit}
                                    onChange={(e) => handleProjectUnitChange(e.target.value)}
                                />
                            </div>
                            <div className='divider'></div>
                            <div className='input-group'>
                                <label htmlFor="value" className='input-label'>
                                    Value
                                </label>
                                <input type="number"
                                    id="value"
                                    className='value-input'
                                    min="0"
                                    value={project.progressTracking.currentValue}
                                    onChange={(e) => handleProjectValueChange(e.target.value)}
                                />
                            </div>
                        </>
                    }
                </div>
            </section>
            <section className="project-tasks">
                <div className='project-tasks-container'>
                    <div className='project-tasks-container-header'>
                        <h1 className='project-details-section-header'>
                            Tasks
                        </h1>
                        <button type="button"
                                className={`project-tasks-add-task-btn ${project.isArchived? "btn-disabled" : ""}`}
                                onClick={() => handleAddTask(todayDateKey)}
                                disabled={project.isArchived}
                                title={project.isArchived ? "Restore this project to add tasks" : ""}
                        >
                            Add New Task        
                        </button>
                    </div>
                    <div className='task-list-top-label'>
                        <SortableColumnHeader 
                            label="Name"
                            field="name"
                            sortConfig={sortConfig}
                            onSort={handleSort}
                        />
                        <SortableColumnHeader 
                            label="Tracked"
                            field="timeSpent"
                            sortConfig={sortConfig}
                            onSort={handleSort}
                        />
                        <SortableColumnHeader 
                            label="Due Date"
                            field="dueDate"
                            sortConfig={sortConfig}
                            onSort={handleSort}
                        />
                    </div>
                </div>
                <ul className="project-task-list">
                    {sortedTasks.map(task => {
                        return (
                            <li key={task.id}
                                className='project-task-list-item'
                                onClick={() => handleEditTask(task.dateKey, task)}
                            >   
                                <span className="task-name">
                                    {task.name}
                                </span>
                                <div className="project-task-list-item-column">
                                    <div className="divider-vertical"></div>
                                    <span className="task-tracked-time">
                                        {formatMinutesHHMMIncludeZero(task.time)}
                                    </span>
                                </div>
                                <div className='project-task-list-item-column'>
                                    <div className="divider-vertical"></div>
                                    <span className='task-due-date'>
                                        {formatISOMMDDYYYY(task.dueDate)}
                                    </span>
                                </div>
                                <div className='project-task-list-item-column'>
                                    <button type="button" className={`circle-check ${task.isDone? "complete" : "not-complete"}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleTask(task.dateKey, task.id);
                                            }}>
                                        <FontAwesomeIcon icon={faCircleCheck} />
                                    </button>
                                    <button type="button" className='delete-btn'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task.dateKey, task.id)
                                            }}>
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>

                                </div>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}

export default ProjectDetails