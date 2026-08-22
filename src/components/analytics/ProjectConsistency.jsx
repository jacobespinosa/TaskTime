import './ProjectConsistency.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import { getProjectTasks } from '../../utils/taskUtils';
import { getDateKey } from '../../utils/dateUtils';

function ProjectConsistency({projects, tasksByDate, projectActivityByDate}) {
    const [ currentProject, setCurrentProject ] = useState(projects[1]);
    const [ isProjectFilterOpen, setIsProjectFilterOpen ] = useState(false);

    const today = new Date();
    const todayKey = getDateKey(today);
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth()));

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const calendarDays = [];
    while (startOfMonth <= endOfMonth) {
        const dateKey = getDateKey(startOfMonth);
        const isToday = dateKey === todayKey;

        const isDone = (projectActivityByDate[dateKey] ?? []).includes(currentProject?.id);
        const day = startOfMonth.getDate();
        calendarDays.push({day, isDone, isToday});

        startOfMonth.setDate(startOfMonth.getDate() + 1);
    }

    function handlePrevMonth() {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    }

    function handleNextMonth() {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
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
        <div className='project-consistency-container'>
            <h4 className='chart-title'>Project Consistency</h4>
            <div className='project-consistency-filters'>
                <div className='project-filter-wrapper' ref={dropdownRef}>
                    <button type='button'
                            className='project-filter'
                            onClick={() => setIsProjectFilterOpen(prev => !prev)}
                    >
                        {currentProject?.name ?? "No Project"}
                        <span className='filter-icon'>
                            {isProjectFilterOpen
                                        ? <FontAwesomeIcon icon={faChevronUp}/>
                                        : <FontAwesomeIcon icon={faChevronDown}/> }
                        </span>
                    </button>
                    {isProjectFilterOpen &&
                        <div className='project-consistency-filter-menu'>
                            {projects.map(project => {
                                if (project.id === 0) return null;
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
                            onClick={handlePrevMonth}>
                        <FontAwesomeIcon icon={faChevronLeft} className="chevron-left"/>
                    </button>
                    <div className='month-year-container'>
                        <span className='current-month-name'>{currentMonth.toLocaleDateString('en-US', {month: 'long'})}</span>
                        {" "}
                        <span className='current-year'>{currentMonth.getFullYear()}</span>
                    </div>
                    <button type="button" 
                            className='button next-month'
                            onClick={handleNextMonth}>
                        <FontAwesomeIcon icon={faChevronRight} className='chevron-right'/>
                    </button>
                </div>
            </div>
            <div className='calendar-grid'>
                <span className='weekDay'>Mon</span>
                <span className='weekDay'>Tue</span>
                <span className='weekDay'>Wed</span>
                <span className='weekDay'>Thu</span>
                <span className='weekDay'>Fri</span>
                <span className='weekDay'>Sat</span>
                <span className='weekDay'>Sun</span>
                {calendarDays.map((date) => {
                    return (
                        <span key={date.day} 
                              className={
                                `calendar-day ${date.isDone ? "done" : ""} ${date.isToday ? "today" : ""}`
                              }>
                            {date.day}
                        </span>
                    )
                })}
            </div>
        </div>
    );
}

export default ProjectConsistency