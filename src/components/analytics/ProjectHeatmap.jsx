import './ProjectHeatmap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import YearlyHeatmap from '../charts/YearlyHeatmap';

function ProjectHeatmap({projects, sessions}) {
    const today = new Date();

    const [ currentYear, setCurrentYear ] = useState(today.getFullYear());
    const [ isProjectFilterOpen, setIsProjectFilterOpen ] = useState(false);
    const [ currentProject, setCurrentProject ] = useState(projects[1]);

    function handlePrevYear() {
        setCurrentYear(prev => prev - 1);
    }

    function handleNextYear() {
        if (today.getFullYear() !== currentYear) {
            setCurrentYear(prev => prev + 1);
        }
    }

    const dropdownRef = useRef(null);
    useEffect(() => {
        const isClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target))
            {
                setIsProjectFilterOpen(false);
            }
            return;
        }

        document.addEventListener("click", isClickOutside, true);

        return () => {
            document.removeEventListener("click", isClickOutside, true);
        }
    }, [])

    return (
        <div className='project-heatmap-container'>
            <header className='project-heatmap-header'>
                <div className='project-filter-wrapper' ref={dropdownRef}>
                    <button type='button'
                            className='project-filter'
                            onClick={() => setIsProjectFilterOpen(prev => !prev)}
                    >
                        {currentProject?.id === 0 ? "All" : currentProject?.name ?? "All"}
                        <span className='filter-icon'>
                            {isProjectFilterOpen
                                        ? <FontAwesomeIcon icon={faChevronUp}/>
                                        : <FontAwesomeIcon icon={faChevronDown}/> }
                        </span>
                    </button>
                    {isProjectFilterOpen &&
                        <div className='project-consistency-filter-menu'>
                            {projects.map(project => {
                                if (project.id === 0) {
                                    return (
                                        <button onClick={() => setCurrentProject(project)}>All</button>
                                    )
                                }
                                return (
                                    <button onClick={() => setCurrentProject(project)}>{project.name}</button>
                                );
                            })}
                        </div>
                    }
                </div>
                <div className='calendar-nav'>
                    <button type="button" 
                            className="button prev-month"
                            onClick={handlePrevYear}>
                        <FontAwesomeIcon icon={faChevronLeft} className="chevron-left"/>
                    </button>
                    <div className='year-nav-container'>
                        <span className='current-year'>{currentYear}</span>
                    </div>
                    <button type="button" 
                            className='button next-month'
                            onClick={handleNextYear}>
                        <FontAwesomeIcon icon={faChevronRight} className='chevron-right'/>
                    </button>
                </div>
            </header>
            <div className='yearly-heatmap-container'>
                <YearlyHeatmap 
                    sessions={sessions}
                    year={currentYear}
                    projectId={currentProject?.id}
                />
            </div>
            <div className='legend'>
                <span>Less</span>
                <div className='legend-colors'>
                    <div className='legend-color' data-tier="0"></div>
                    <div className='legend-color' data-tier="1"></div>
                    <div className='legend-color' data-tier="2"></div>
                    <div className='legend-color' data-tier="3"></div>
                    <div className='legend-color' data-tier="4"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
}

export default ProjectHeatmap