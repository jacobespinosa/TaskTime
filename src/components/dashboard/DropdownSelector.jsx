import './DropdownSelector.css';
import { useState } from 'react';

function DropdownSelector({projects, currentProjectId, setCurrentProjectId,
                          tasksByDate, setSelectedTask, handleAddTask,
                          setIsDropdownOpen, setIsCreateProjectOpen}) {
    const [selectorMode, setSelectorMode] = useState("tasks");

    const currentProject = projects.find(p => p.id === currentProjectId);
    const projectTasks =  Object.values(tasksByDate).flat().filter(task => 
        task.projectId === currentProjectId && !task.isDone)

    const taskSelectorTitle = projectTasks.length === 0
                              ? "No active tasks:"
                              : currentProjectId === 0
                              ? "General tasks:"
                              : `${currentProject?.name ?? "No projects"} tasks:`;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const todayDatekey = todayDate.toLocaleDateString();

    return (
        <div className="dropdown-selector">
            <p className="project-selector-title">Current Project</p>
            <div className="project-selector" onClick={() => setSelectorMode("tasks")}>
                <span className="current-project-name">
                    <span className="color-dot" style={{"color": `${currentProject?.color}`}}>●</span>
                    {currentProject?.name}
                </span>
                <button className="selector-change-project-btn"
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectorMode("projects")
                        }}>
                    Change 
                </button>
            </div>
            {selectorMode === "projects" &&
                <div className="project-selector-container">
                    <p className="project-selector-title">Select Project</p>
                    <ul className="project-options">
                    {projects.map((project) => {
                        if (project.id === currentProjectId || project.isArchived) return null;
                        return (
                            <li className="project-option"
                                key={project.id}
                                onClick={() => {
                                    setCurrentProjectId(project.id)
                                    setSelectedTask(null);
                                    setSelectorMode("tasks");
                                }}
                            >
                                <span className="color-dot" style={{"color": `${project.color}`}}>●</span>
                                <span className="project-option-name">
                                    {project.name}
                                </span>
                            </li>
                        )
                    })}
                    </ul>
                </div>
            }
            { selectorMode === "tasks" &&
                <div className="task-selector">
                    <p className="task-selector-title">
                        Tasks
                    </p>
                    <ul className="task-options">
                        {projectTasks.map(task =>
                            <li className="task-option"
                                key={task.id}    
                                onClick={() => setSelectedTask(task)} 
                            >
                                {task.name}
                            </li>
                        )}
                    </ul>
                    <button type="button" 
                            className="selector-add-task-btn"
                            onClick={() => {
                                handleAddTask(todayDatekey);
                                setIsDropdownOpen(false);
                            }}
                    >
                        + Add Task
                    </button>
                </div>
            }
            <div className="create-project-btn-container">
                <div className="divider"></div>
                <button type="button" 
                        className="create-project-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(false);
                            setIsCreateProjectOpen(true);
                        }}
                >
                    Create New Project
                </button>
            </div>
        </div>
    );
}

export default DropdownSelector