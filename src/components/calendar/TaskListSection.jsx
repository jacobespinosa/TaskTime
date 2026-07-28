import './TaskListSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { getTasksArray } from '../../utils/taskUtils';

function TaskListSection({title, tasks, color, taskSubtext, handleToggleTask}) {
    return (
        <div className='task-list-section-container'>
            <h3 className='task-list-section-header'>
                <span className="dot" style={{"color": `${color}`}}>●</span>
                <span>{title}</span>
                <span>({tasks.length})</span>
            </h3>
            <div className='divider'></div>
            <ul className='task-list'>
                {tasks.map(task => {
                    return (
                        <li key={task.id}
                            className='task-list-item'
                            style={{
                                "borderColor": `${color}`,
                                "--bgColor": `${color}`
                            }}
                        >
                            <div className='task-text'>
                                <span className="task-name">
                                    {task.name}
                                </span>
                                <span className="task-subtext">
                                    {taskSubtext && taskSubtext(task)}
                                </span>
                            </div>
                            <button type='button'
                                    className='circle-check'
                                    onClick={() => handleToggleTask(task.dateKey, task.id)}
                            >
                                <FontAwesomeIcon icon={faCircleCheck}/>
                            </button>    
                        </li>
                    );
                })}
            </ul>
            <div className='divider'></div>
        </div>
    );
}

export default TaskListSection