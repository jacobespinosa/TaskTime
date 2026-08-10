import './ProjectList.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMinutesHHMMIncludeZero } from '../../utils/timeUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ProjectConfirmDeleteModal from '../modals/ProjectConfirmDeleteModal';
import SortableColumnHeader from '../buttons/SortableColumnHeader';
import { calculateGoalPercentage } from '../../utils/mathUtils';

function ProjectList({projects, setProjects, setTasksByDate, setSessions}) {
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState("active");
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isProjectConfirmDeleteModalOpen, setIsProjectConfirmDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const [sortConfig, setSortConfig] = useState({
        field: "name",
        direction: "ascending"
    })

    const sortedProjects = projects.toSorted((a, b) => {
        const { field, direction } = sortConfig;

        let comparison = 0;
        if (field === "name") {
            comparison = a.name.localeCompare(b.name);
        }
        else if (field === "timeSpent") {
            comparison = a.timeSpent - b.timeSpent;
        }
        else if (field === "progress") {
            const aProgress = a.progressTracking
                ? calculateGoalPercentage(
                    a.progressTracking.currentValue,
                    a.progressTracking.goalValue
                )
                : -1;

            const bProgress = b.progressTracking
                ? calculateGoalPercentage(
                    b.progressTracking.currentValue,
                    b.progressTracking.goalValue
                )
                : -1;

            comparison = aProgress - bProgress;
        }

        return direction === "ascending"
                    ? comparison
                    : -comparison;
    })

    const dropdownRef = useRef(null);

    useEffect(() => {
        const isClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFilterDropdownOpen(false);
            }
            return;
        }

        document.addEventListener("click", isClickOutside);

        return () => {
            document.removeEventListener("click", isClickOutside);
        }
    }, [])

    function handleSelectProject(projectId) {
        navigate(`/projects/${projectId}`);
    }

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

    function handleArchiveProject(projectId) {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === projectId
                ? {
                    ...project,
                    isArchived: true
                }
                : project
            )
        );
    }

    function handleRestoreProject(projectId) {
        setProjects(prevProjects => 
            prevProjects.map(project =>
                project.id === projectId
                ? {
                    ...project,
                    isArchived: false
                }
                : project
            )
        );
    }

    function handleDeleteProject(projectId) {
        setProjects(prevProjects =>
            prevProjects.filter(project => project.id !== projectId)
        );

        setTasksByDate(prevTasksByDate => {
            return Object.fromEntries(
                Object.entries(prevTasksByDate).map(([datekey, tasks]) => [
                    datekey,
                    tasks.filter((task) => task.projectId !== projectId)
                ])
            )
        });

        setSessions(prevSessions => 
            prevSessions.filter(session => session.projectId !== projectId)
        );

        setIsProjectConfirmDeleteModalOpen(false);
    }

    const visibleProjects = sortedProjects.filter(project => {
        if (project.id === 0) return false;
        if (filterType === "active") return !project.isArchived;
        if (filterType === "archived") return project.isArchived;
        return true;
    });


    return (
        <div className='project-list-container'>
            <h3 className='project-list-header'>
                projects
            </h3>
            <div className='project-list-top-label'>
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
                    label="Progress"
                    field="progress"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                />
                <button type="button" className='project-list-filter-btn'
                        onClick={() => setIsFilterDropdownOpen(prev => !prev)}
                        ref={dropdownRef}
                >
                    Filter
                    {isFilterDropdownOpen 
                        ? <FontAwesomeIcon icon={faChevronUp} className='chevron-up' />
                        : <FontAwesomeIcon icon={faChevronDown} className='chevron-down' />}
                    
                    {isFilterDropdownOpen &&
                        <div className="project-filter-menu">
                            <button onClick={() => setFilterType("active")}>Active</button>
                            <button onClick={() => setFilterType("archived")}>Archived</button>
                            <button onClick={() => setFilterType("all")}>All</button>
                        </div>
                    }
                </button>
            </div>
            <ul className='project-list'>
                {visibleProjects.map(project => {
                    if (filterType === "active") {
                        if (project.isArchived) return;
                    } else if (filterType === "archived") {
                        if (!project.isArchived) return;
                    }

                    const value = project.progressTracking?.currentValue ?? 0;
                    const goal = project.progressTracking?.goalValue ?? 0;
                    const projectProgressPercent = calculateGoalPercentage(value, goal).toFixed(0);

                    return (
                        <li key={project.id}
                            className="project-list-item"
                        >
                            <div className="name-label">
                                <span className="project-dot"
                                    style={{"color": `${project.color}`}}>●</span>
                                <span className="project-name"
                                    style={{
                                        "textDecoration": 
                                        `${project.isArchived 
                                            ? "line-through" : ""}`,
                                        "pointerEvents":
                                        `${project.id === 0
                                            ? "none" : "auto"}`
                                    }}
                                    onClick={() => handleSelectProject(project.id)}
                                >
                                        {project.name}
                                </span>
                            </div>
                            <div className='project-list-time-column'>
                                <div className="divider-vertical"></div>
                                <span className="project-tracked-time">
                                    {formatMinutesHHMMIncludeZero(project.timeSpent / 60)}
                                </span>
                            </div>
                            <div className='project-list-progress-column'>
                                <div className='divider-vertical'></div>
                                <span className='project-progress-percent'>
                                    {project.progressTracking? `${projectProgressPercent}%` : "--"}
                                </span>
                            </div>
                            <div className='project-actions'>
                                {project.id !== 0 && project.isArchived &&
                                    <button type="button" className='project-item-restore-btn'
                                            onClick={() => handleRestoreProject(project.id)}>
                                        Restore
                                    </button>
                                }
                                {project.id !== 0 && project.isArchived &&
                                    <button type="button" className="project-item-delete-btn"
                                            onClick={() => {
                                                setProjectToDelete(project);
                                                setIsProjectConfirmDeleteModalOpen(true)
                                            }}>
                                        Delete
                                    </button>
                                }
                                {project.id !== 0 && !project.isArchived &&
                                    <button type="button" className="project-item-archive-btn"
                                            onClick={() => handleArchiveProject(project.id)}>
                                        Archive
                                    </button>
                                }
                            </div>
                        </li>
                    );
                })}
            </ul>
            {isProjectConfirmDeleteModalOpen &&
                <ProjectConfirmDeleteModal 
                    projectToDelete={projectToDelete}
                    setIsProjectConfirmDeleteModalOpen={setIsProjectConfirmDeleteModalOpen}
                    handleDeleteProject={handleDeleteProject}
                />                
            }
        </div>
    );
}

export default ProjectList