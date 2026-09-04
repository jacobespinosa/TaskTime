import './SessionsPage.css';
import SessionsHistory from '../components/sessions/SessionsHistory';
import { getSortedSessions } from '../utils/sessionUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';

function SessionsPage({sessions, setSessions, tasksByDate, projects, timeByDate,
                       weeklyTimeGoals, handleEditSession
}) {
    const sortedSessions = getSortedSessions(sessions);
    const isEmpty = sessions.length === 0;

    const SESSIONS_PER_PAGE = 50;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * SESSIONS_PER_PAGE;
    const endIndex = startIndex + SESSIONS_PER_PAGE;

    const currentSessions = sortedSessions.slice(startIndex, endIndex);

    const totalPages = Math.ceil(
        sessions.length / SESSIONS_PER_PAGE
    );

    function handlePageChange(newPage) {
        setCurrentPage(newPage);

        const pageContent = document.querySelector(".page-content");

        pageContent?.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    return (
        <main className="sessions">
            <section className="sessions-content">
                <div className="sessions-header">
                    <h1>Sessions</h1>
                </div>
                {isEmpty && <span className='no-session-msg'>No Sessions</span>}
                <div className="sessions-list">
                    <SessionsHistory 
                        sessions={currentSessions} 
                        setSessions={setSessions}
                        tasksByDate={tasksByDate}
                        projects={projects}
                        timeByDate={timeByDate}
                        weeklyTimeGoals={weeklyTimeGoals}
                        handleEditSession={handleEditSession}
                    />
                </div>
                {!isEmpty &&
                    <div className='page-navigation-container'>
                        <button type="button" 
                                className='page-nav-prev'
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>

                        <span className='page-nav-text'>
                            Page {currentPage} of {totalPages}
                        </span>

                        <button type="button"
                                className='page-nav-next'
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                }
            </section>
        </main>
    );
}

export default SessionsPage