import './AddTaskModal.css';
import { useState } from 'react';
import { getWeekStartISO } from '../../utils/timeUtils';

function AddTaskModal({mode, task, onClose, onSubmit, projects, currentProjectId}) {
    const [ taskName, setTaskName ] = useState(task?.name ?? "");
    const [ taskTime, setTaskTime ] = useState(task?.time ?? 0);
    const [ dueDate, setDueDate ] = useState(task?.dueDate ?? "");
    const [ projectId, setProjectId ] = useState(task?.projectId ?? currentProjectId ?? 0);
    
    const weekStartISO = getWeekStartISO();

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(taskName, projectId, taskTime, dueDate);
    }

    return (
        <div className="task-modal-background">
            <div className="task-modal">
                <h2 className="task-modal-title">
                    {mode === "add"? "Add Task" : "Edit Task"}
                </h2>

                <form className="task-form" onSubmit={handleSubmit}>
                    <div className="task-form-group">
                        <label htmlFor="name">
                            Enter Task Name: <span className="required"></span>
                        </label>
                        <input 
                            id="name" 
                            type="text"
                            value={taskName}
                            required
                            placeholder="e.g. Finish project"
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </div>
                    <div className="task-form-group">
                        <label htmlFor="due-date">
                            Enter Due Date:
                        </label>
                        <input
                            id="due-date"
                            type="date"
                            value={dueDate}
                            min={mode === "add" ? weekStartISO : undefined}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div className="task-form-group">
                        <label htmlFor="time">
                            Enter Estimated Time:
                        </label>
                        <select 
                            id="time" 
                            onChange={(e) => setTaskTime(Number(e.target.value))}
                            value={taskTime}
                        >
                            <option value="0">Select time</option>
                            <option value="15">15 min</option>
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                            <option value="150">2.5 hours</option>
                            <option value="180">3 hours</option>
                            <option value="210">3.5 hours</option>
                            <option value="240">4 hours</option>
                            <option value="300">5 hours</option>
                            <option value="360">6 hours</option>
                            <option value="420">7 hours</option>
                            <option value="480">8 hours</option>
                        </select>
                    </div>
                    <div className="task-form-group">
                        <label htmlFor="project">
                            Enter Associated Project:
                        </label>
                        <select
                            id="project"
                            onChange={(e) => setProjectId(Number(e.target.value))}
                            value={projectId}
                        >
                            {projects.map(project => {
                                if (project.isArchived) return null;
                                return (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                )   
                            }
                            )}
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className="task-submit-btn"
                    >
                        {mode === "add" ? "Add Task" : "Save Changes"}
                    </button>
                    <div className="task-close-btn" onClick={onClose}>
                        &times;
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTaskModal