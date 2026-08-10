import './ProjectDetailsPage.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectDetails from '../components/projects/ProjectDetails';

function ProjectDetailsPage({projects, setProjects, tasksByDate, taskActions, setCurrentProjectId
}) {
    const {
        handleCreateTask,
        handleDeleteTask,
        handleToggleTask,
        handleUpdateTask,
        handleAddTask,
        handleEditTask
    } = taskActions;

    const { projectId } = useParams();
    const navigate = useNavigate();

    const [sortConfig, setSortConfig] = useState({
        field: "name",
        direction: "ascending"
    })

    function handleSort(field) {
        setSortConfig(current => {
            const clickedSameKey = current.field === field;

            return {
                field,
                direction:
                    clickedSameKey && current.direction === "ascending"
                    ? "descending"
                    : "ascending"
            }; 
        });
    }

    const project = projects.find(project =>
        project.id === Number(projectId)
    );

    /* Temporary give eachs task its datekey so it can be updated */
    const tasks = Object.entries(tasksByDate).flatMap(([dateKey, tasks]) =>
        tasks.filter(task => task.projectId === Number(projectId)).map(task => (
            {
                ...task,
                dateKey
            }
        ))
    )

    function handleProjectNameChange(name) {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === Number(projectId)
                ? {
                    ...project,
                    name
                }
                : project
            )
        );
    }

    function handleProjectColorChange(color) {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === Number(projectId)
                ? {
                    ...project,
                    color
                }
                : project
            )
        );
    }

    function handleProjectGoalChange(goal) {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === Number(projectId)
                ? {
                    ...project,
                    progressTracking: {
                        ...project.progressTracking,
                        goalValue: Number(goal)
                    }
                }
                : project
            )
        );
    }

    function handleProjectUnitChange(unit) {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === Number(projectId)
                ? {
                    ...project,
                    progressTracking: {
                        ...project.progressTracking,
                        unit: unit.trim()
                    }
                }
                : project
            )
        );
    }

    function handleProjectValueChange(value) {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === Number(projectId)
                ? {
                    ...project,
                    progressTracking: {
                        ...project.progressTracking,
                        currentValue: Number(value)
                    }
                }
                : project
            )
        );
    }

    return (
        <main className="project-details">
            <section className='project-details-content'>
                <header className='project-details-header'>
                    <nav className='breadcrumbs' aria-label="Breadcrumb">
                        <button type="button"
                                className='breadcrumb-link'
                                onClick={() => navigate("/projects")}
                        >
                            Projects
                        </button>
                        <span className='breadcrumb-seperator'>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </span>
                        <span className="breadcrumb-current">
                            {project.name}
                        </span>
                    </nav> 
                </header>
                <ProjectDetails 
                    project={project}
                    tasks={tasks}
                    handleProjectNameChange={handleProjectNameChange}
                    handleProjectColorChange={handleProjectColorChange}
                    handleProjectGoalChange={handleProjectGoalChange}
                    handleProjectUnitChange={handleProjectUnitChange}
                    handleProjectValueChange={handleProjectValueChange}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    handleEditTask={handleEditTask}
                    handleAddTask={handleAddTask}
                    handleDeleteTask={handleDeleteTask}
                    handleToggleTask={handleToggleTask}
                    setCurrentProjectId={setCurrentProjectId}
                />
            </section>
        </main>
    );
}

export default ProjectDetailsPage