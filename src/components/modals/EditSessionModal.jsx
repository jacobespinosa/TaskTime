import { getTasksArray } from '../../utils/taskUtils';
import { useState, useEffect, useRef } from 'react';
import { convert12HourTo24Hour, convertHHMMToSeconds, formatSecondsHHMM,
          formatTime12Hour, replaceTimestampTime, addDurationToTimestamp,
         getDurationSeconds } from '../../utils/timeUtils';
import './EditSessionModal.css';
import DropdownSelector from '../dashboard/DropdownSelector';

function EditSessionModal({session, projects, tasksByDate, onClose, onSave, handleAddTask, setIsCreateProjectOpen}) {
    const task = getTasksArray(tasksByDate).find(task => task.id === session.taskId);

    const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
    const [editedProjectId, setEditedProjectId] = useState(session.projectId);
    const [editedTask, setEditedTask] = useState(task ?? null);
    const [editedDuration, setEditedDuration] = useState(formatSecondsHHMM(session.durationSeconds));
    const [editedStartTime, setEditedStartTime] = useState(formatTime12Hour(new Date(session.startTime)));
    const [editedEndTime, setEditedEndTime] = useState(formatTime12Hour(new Date(session.endTime)));

    const editedProject = projects.find(
        project => project.id === editedProjectId
    );
    const dropdownRef = useRef(null);

    useEffect(() => {
        const isClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProjectSelectorOpen(false);
            }
            return;
        }

        document.addEventListener("click", isClickOutside);

        return () => {
            document.removeEventListener("click", isClickOutside);
        }
    }, [])

    function updateDurationFromTimes(startInput, endInput) {
        const updatedStartTimestamp = replaceTimestampTime(
            session.startTime,
            startInput
        );

        const updatedEndTimestamp = replaceTimestampTime(
            session.endTime,
            endInput
        );

        if (
            updatedStartTimestamp === null ||
            updatedEndTimestamp === null
        ) {
            return false;
        }

        const durationSeconds = getDurationSeconds(
            updatedStartTimestamp,
            updatedEndTimestamp
        );

        if (durationSeconds === null) {
            return false;
        }

        setEditedDuration(formatSecondsHHMM(durationSeconds));
        return true;
    }

    function handleStartTimeBlur() {
        const wasUpdated = updateDurationFromTimes(
            editedStartTime,
            editedEndTime
        );

        if (!wasUpdated) {
            setEditedStartTime(
                formatTime12Hour(new Date(session.startTime))
            );

            setEditedDuration(
                formatSecondsHHMM(session.durationSeconds)
            );
        }
    }

    function handleEndTimeBlur() {
        const wasUpdated = updateDurationFromTimes(
            editedStartTime,
            editedEndTime
        );

        if (!wasUpdated) {
            setEditedEndTime(
                formatTime12Hour(new Date(session.endTime))
            );

            setEditedDuration(
                formatSecondsHHMM(session.durationSeconds)
            );
        }
    }

    function handleDurationBlur() {
        const durationSeconds = convertHHMMToSeconds(editedDuration);

        if (durationSeconds === null) {
            setEditedDuration(formatSecondsHHMM(session.durationSeconds));
            return;
        }

        const updatedStartTimestamp = replaceTimestampTime(
            session.startTime,
            editedStartTime
        );

        if (updatedStartTimestamp === null) {
            setEditedDuration(
                formatSecondsHHMM(session.durationSeconds)
            );
            return;
        }

        const updatedEndTimestamp = addDurationToTimestamp(
            updatedStartTimestamp,
            durationSeconds
        );

        setEditedDuration(formatSecondsHHMM(durationSeconds));
        setEditedEndTime(
            formatTime12Hour(new Date(updatedEndTimestamp))
        );
    }

    function handleSave() {
        const updatedStartTime = replaceTimestampTime(
            session.startTime,
            editedStartTime
        )

        const updatedEndTime = replaceTimestampTime(
            session.endTime,
            editedEndTime
        );

        const updatedDuration = convertHHMMToSeconds(editedDuration);

        if (updatedStartTime === null || updatedEndTime === null ||
            updatedDuration === null
        ) {
            setEditedStartTime(
                formatTime12Hour(new Date(session.startTime))
            );

            setEditedEndTime(
                formatTime12Hour(new Date(session.endTime))
            );

            setEditedDuration(
                formatSecondsHHMM(session.durationSeconds)
            );

            return;
        }

        const edits = {
            projectId: editedProjectId,
            taskId: editedTask?.id ?? null,
            durationSeconds: updatedDuration,
            startTime: updatedStartTime,
            endTime: updatedEndTime
        };

        onSave(session, edits);
        onClose();
    }

    return (
        <div className='session-modal-background'>
            <div className='session-modal'>
                <div className="close-btn" onClick={onClose}>
                    &times;
                </div>
                <div className="session-template">
                    <div className="project-selector-wrapper" ref={dropdownRef}>
                        <button type="button"
                                title={`${editedProject?.name}${editedTask?.name ? `: ${editedTask.name}` : ""}`}
                                style={{
                                    "color": `${editedProject.color}`,
                                    "--projectColor": `${editedProject.color}`
                                }}
                                className='session-name-input'
                                onClick={() => setIsProjectSelectorOpen(prev => !prev)}
                        >
                            <span className="project-name">
                                {editedProject?.name ?? "No Project"}
                            </span>
                            <span className="task-name">
                                {editedTask?.name ? `: ${editedTask.name}` : ""}
                            </span>
                        </button>
                        <div className="project-dropdown-container">
                                { isProjectSelectorOpen && 
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <DropdownSelector
                                            projects={projects}
                                            currentProjectId={editedProjectId}
                                            setCurrentProjectId={setEditedProjectId}
                                            tasksByDate={tasksByDate}
                                            setSelectedTask={setEditedTask}
                                            handleAddTask={handleAddTask}
                                            setIsDropdownOpen={setIsProjectSelectorOpen}
                                            setIsCreateProjectOpen={setIsCreateProjectOpen}
                                        />
                                    </div>
                                }
                        </div>
                    </div>
                    <div className='session-time-edit-container'>
                        <div className="day-session-time-range">
                            <input type="text"
                                className='project-start-time'
                                value={editedStartTime}
                                onChange={(e) => setEditedStartTime(e.target.value)}
                                onBlur={handleStartTimeBlur}
                            />
                            <span className='seperator-dash'>–</span>
                            <input type='text'
                                className='project-end-time'
                                value={editedEndTime}
                                onChange={(e) => setEditedEndTime(e.target.value)}
                                onBlur={handleEndTimeBlur}
                            />
                        </div>
                        <input type='text'
                            className='project-duration-time'
                            value={editedDuration}
                            onChange={(e) => setEditedDuration(e.target.value)}
                            onBlur={handleDurationBlur}
                        />
                    </div>
                </div>
                <button className="session-edit-save-btn" 
                        type="button" 
                        onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
}

export default EditSessionModal