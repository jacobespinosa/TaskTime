import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './Dashboard';
import CalendarPage from './CalendarPage';
import ProjectsPage from "./ProjectsPage";
import AnalyticsPage from "./AnalyticsPage";
import SessionsPage from "./SessionsPage"
import ProjectDetailsPage from "./ProjectDetailsPage";
import Layout from "../components/Layout";
import AddTaskModal from '../components/modals/AddTaskModal';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import EditSessionModal from '../components/modals/EditSessionModal';
import { useState } from 'react';
import { useEffect } from 'react';
import { getDateKey, getTodayDate } from '../utils/dateUtils';
import { getLocalStorage, setLocalStorage } from '../utils/localStorageUtils';
import { generateDemoData } from '../data/demoData';

function TaskTimeApp({ demoMode = false }) {
    const DEMO_SEED = 14;
    const [taskModalMode, setTaskModalMode] = useState("add");
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedDateKey, setSelectedDateKey] = useState("");
    const [selectedSession, setSelectedSession] = useState(null);
    const [newTask, setNewTask] = useState(null);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [timer, setTimer] = useState({
        isRunning: false,
        startTime: null,
        elapsedSeconds: 0,
    });

    const demoData = generateDemoData(DEMO_SEED);

    const defaultProjects = [
        {
            id: 0,
            name: "No Project",
            color: "#333",
            timeSpent: 0,
            isArchived: false,
            progressTracking: null
        }
    ];

    const [projects, setProjects] = useState(() => {
        if (demoMode) {
            return demoData.projects;
        }

        return getLocalStorage("projects", defaultProjects);
    });

    const [timeByDate, setTimeByDate] = useState(() => {
        if (demoMode) {
            return demoData.timeByDate;
        }

        return getLocalStorage("timeByDate", {});
    });

    const [weeklyTimeGoals, setWeeklyTimeGoals] = useState(() => {
        if (demoMode) {
            return demoData.weeklyTimeGoals;
        }

        return getLocalStorage("weeklyTimeGoals", {});
    });

    const [tasksByDate, setTasksByDate] = useState(() => {
        if (demoMode) {
            return demoData.tasksByDate;
        }

        return getLocalStorage("tasksByDate", {});
    });

    const [sessions, setSessions] = useState(() => {
        if (demoMode) {
            return demoData.sessions;
        }

        return getLocalStorage("sessions", []);
    });

    const [projectActivityByDate, setProjectActivityByDate] = useState(() => {
        if (demoMode) {
            return demoData.projectActivityByDate;
        }

        return getLocalStorage("projectActivityByDate", {});
    });

    const [currentProjectId, setCurrentProjectId] = useState(projects[0].id);
    const [taskModalProjectId, setTaskModalProjectId] = useState(projects[0].id);

    useEffect(() => {
        if (demoMode) return;
        setLocalStorage("projects", projects);
    }, [projects, demoMode]);

    useEffect(() => {
        if (demoMode) return;
        setLocalStorage("timeByDate", timeByDate);
    }, [timeByDate, demoMode]);

    useEffect(() => {
        if (demoMode) return;
        setLocalStorage("weeklyTimeGoals", weeklyTimeGoals);
    }, [weeklyTimeGoals, demoMode]);

    useEffect(() => {
        if (demoMode) return;
        setLocalStorage("tasksByDate", tasksByDate);
    }, [tasksByDate, demoMode]);

    useEffect(() => {
        if (demoMode) return;
        setLocalStorage("sessions", sessions);
    }, [sessions, demoMode]);

    useEffect(() => {
        if (demoMode) return;
        setLocalStorage("projectActivityByDate", projectActivityByDate);
    }, [projectActivityByDate, demoMode]);

    function recordProjectActivity(projectId, dateKey) {
        setProjectActivityByDate(prev => ({
            ...prev,
            [dateKey]: [
                ...new Set([
                    ...(prev[dateKey] ?? []),
                    projectId
                ])
            ]
        }));
    }

    useEffect(() => {
        if (!timer.isRunning || !timer.startTime) return;

        const updateElapsedTime = () => {
            setTimer(previous => ({
                ...previous,
                elapsedSeconds: Math.floor(
                    (Date.now() - previous.startTime) / 1000
                )
            }));
        };

        updateElapsedTime();

        const intervalId = setInterval(updateElapsedTime, 1000);

        return () => clearInterval(intervalId);
    }, [timer.isRunning, timer.startTime]);

    function handleCreateTask(taskName, projectId, estimatedTime, dueDate) {
        setTasksByDate(prev => ({
            ...prev,
            [selectedDateKey]: [
                ...(prev[selectedDateKey] || []),
                {
                    id: Date.now(),
                    name: taskName,
                    projectId,
                    time: estimatedTime,
                    isDone: false,
                    dueDate
                }
            ]
        }));
        setIsTaskModalOpen(false);
    }

    function handleUpdateTask(taskName, projectId, estimatedTime, dueDate) {
        if (!newTask) return;

        setTasksByDate(prev => ({
            ...prev,
            [selectedDateKey]: prev[selectedDateKey].map(task =>
                task.id === newTask.id
                ? {
                    ...task,
                    name: taskName,
                    projectId,
                    time: estimatedTime,
                    dueDate,
                    dateCompleted: ""
                }
                : task
            )
        }));
        setIsTaskModalOpen(false);        
    }

    function handleDeleteTask(dateKey, taskId) {
        setTasksByDate(prev => ({
            ...prev,
            [dateKey]: prev[dateKey].filter(
                task => task.id !== taskId
            )
        }));
    }

    function handleToggleTask(dateKey, taskId) {
        const today = getTodayDate();
        const todayKey = getDateKey(today);

        const task = tasksByDate[dateKey].find(
            task => task.id === taskId
        );

        if (!task.isDone) {
            recordProjectActivity(task.projectId, todayKey);
        }

        setTasksByDate(prev => ({
            ...prev,
            [dateKey]: prev[dateKey].map(task =>
                task.id === taskId
                ? 
                { 
                    ...task, 
                    isDone: !task.isDone,
                    dateCompleted: !task.isDone? today.toLocaleDateString() : ""
                }
                : task
            )
        }));
    }

    function handleAddTask(dateKey, projectId = 0) {
        setTaskModalMode("add");
        setSelectedDateKey(dateKey);
        setNewTask(null);
        setTaskModalProjectId(projectId)
        setIsTaskModalOpen(true);
    }

    function handleAddTaskForCurrentProject(dateKey) {
        setTaskModalMode("add");
        setSelectedDateKey(dateKey);
        setNewTask(null);

        setTaskModalProjectId(currentProjectId);

        setIsTaskModalOpen(true);
    }

    function handleEditTask(dateKey, task) {
        setTaskModalMode("edit");
        setSelectedDateKey(dateKey);
        setNewTask(task);
        setIsTaskModalOpen(true);
    }

    function handleEditSession(session) {
        setSelectedSession(session);
        setIsSessionModalOpen(true);
    }

    function handleCreateProject(name, color, isTracking, goal, unit) {
        setProjects(prevProjects => 
            [...prevProjects, {
                id: Date.now(),
                name: name,
                color: color,
                timeSpent: 0,
                isArchived: false,
                progressTracking: isTracking
                ? {
                currentValue: 0,
                goalValue: Number(goal),
                unit: unit.trim() 
                }
                : null
            }]
        )
    }

    function handleChangeProjectProgress(projectId, amount) {
        setProjects(prevProjects =>
            prevProjects.map(project => {
                if (
                    project.id !== projectId ||
                    !project.progressTracking
                ) {
                    return project;
                }

                const nextValue = Math.max(
                    0,
                    project.progressTracking.currentValue + amount
                );

                return {
                    ...project,
                    progressTracking: {
                        ...project.progressTracking,
                        currentValue: nextValue
                    }
                };
            })
        );
    }

    function handleUpdateSession(session, edits) {
        setSessions(prevSessions => 
            prevSessions.map(prevSession =>
                prevSession.id === session.id
                ? 
                {
                    ...prevSession,
                    ...edits
                }
                : prevSession
            )          
        )
    }

    const taskActions = {
        handleCreateTask,
        handleDeleteTask,
        handleToggleTask,
        handleUpdateTask,
        handleAddTask,
        handleEditTask
    }

    const taskModalState = {
        taskModalMode,
        setTaskModalMode,
        isTaskModalOpen,
        setIsTaskModalOpen
    }

    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route 
                        path="dashboard" 
                        element={
                            <Dashboard 
                                projects={projects} setProjects={setProjects}
                                tasksByDate={tasksByDate} setTasksByDate={setTasksByDate}
                                timeByDate={timeByDate} setTimeByDate={setTimeByDate}
                                taskActions={taskActions} taskModalState={taskModalState}
                                newTask={newTask} sessions={sessions}
                                setSessions={setSessions} currentProjectId={currentProjectId}
                                setCurrentProjectId={setCurrentProjectId}
                                isCreateProjectOpen={isCreateProjectOpen}
                                setIsCreateProjectOpen={setIsCreateProjectOpen}
                                weeklyTimeGoals={weeklyTimeGoals}
                                setWeeklyTimeGoals={setWeeklyTimeGoals}
                                handleEditSession={handleEditSession}
                                timer={timer} setTimer={setTimer}
                                handleAddTaskForCurrentProject={handleAddTaskForCurrentProject}
                            />
                        } 
                    />
                    <Route 
                        path="calendar" 
                        element={
                            <CalendarPage 
                                tasksByDate={tasksByDate}
                                taskActions={taskActions}
                                taskModalState={taskModalState}
                            />
                        } 
                    />
                    <Route path="projects" 
                            element={
                                <ProjectsPage 
                                    projects={projects}
                                    setProjects={setProjects}
                                    setIsCreateProjectOpen={setIsCreateProjectOpen}
                                    setTasksByDate={setTasksByDate}
                                    setSessions={setSessions}
                                />
                            } 
                    />
                    <Route path="projects/:projectId" 
                            element={
                                <ProjectDetailsPage 
                                    projects={projects}
                                    setProjects={setProjects}
                                    tasksByDate={tasksByDate}
                                    taskActions={taskActions}
                                    setCurrentProjectId={setCurrentProjectId}
                                    
                                />
                            } 
                    />
                    <Route path="sessions" 
                            element={
                                <SessionsPage 
                                    sessions={sessions}
                                    setSessions={setSessions}
                                    tasksByDate={tasksByDate}
                                    projects={projects}
                                    timeByDate={timeByDate}
                                    weeklyTimeGoals={weeklyTimeGoals}
                                    handleEditSession={handleEditSession}
                                />
                            } 
                    />
                    <Route path="analytics" 
                            element={
                                <AnalyticsPage 
                                    timeByDate={timeByDate}
                                    weeklyTimeGoals={weeklyTimeGoals}
                                    setWeeklyTimeGoals={setWeeklyTimeGoals}
                                    tasksByDate={tasksByDate}
                                    projects={projects}
                                    sessions={sessions}
                                    projectActivityByDate={projectActivityByDate}
                                />
                            } 
                    />
                </Route>
            </Routes>
            {isTaskModalOpen && (
                <AddTaskModal
                    projects={projects}
                    mode={taskModalMode}
                    task={newTask}
                    onClose={() => {
                        setTaskModalProjectId(0);
                        setIsTaskModalOpen(false);
                    }}
                    onSubmit={taskModalMode === "add" 
                                ? handleCreateTask : handleUpdateTask}
                    currentProjectId={taskModalProjectId}
                />
            )}

            {isCreateProjectOpen && (
                <CreateProjectModal
                    onSubmit={handleCreateProject}
                    onClose={() => {
                        setIsCreateProjectOpen(false);
                    }}
                />
            )}

            {isSessionModalOpen && (
                <EditSessionModal 
                    session={selectedSession}
                    projects={projects}
                    tasksByDate={tasksByDate}
                    onClose={() => {
                        setIsSessionModalOpen(false);
                    }}
                    onSave={handleUpdateSession}
                    handleAddTask={handleAddTask}
                    setIsCreateProjectOpen={setIsCreateProjectOpen}
                />
            )}
        </>
    );
}

export default TaskTimeApp;