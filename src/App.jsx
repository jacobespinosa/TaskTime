import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import ProjectsPage from "./pages/ProjectsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SessionsPage from "./pages/SessionsPage"
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import Layout from "./components/Layout";
import AddTaskModal from './components/modals/AddTaskModal';
import CreateProjectModal from './components/modals/CreateProjectModal';
import EditSessionModal from './components/modals/EditSessionModal';
import { useState } from 'react';
import { faLadderWater } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [taskModalMode, setTaskModalMode] = useState("add");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [newTask, setNewTask] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [weeklyTimeGoal, setWeeklyTimeGoal] = useState(86400);

  const [projects, setProjects] = useState([
    {
      id: 0,
      name: "No Project",
      color: "#333",
      timeSpent: 11763,
      isArchived: false
    },
    {
      id: 1,
      name: "leetCode",
      color: "#FF8849",
      timeSpent: 21674,
      isArchived: true
    },
    {
      id: 2,
      name: "Python",
      color: "#69BE28",
      timeSpent: 16223,
      isArchived: false
    },
    {
      id: 3,
      name: "SIEM",
      color: "#3DB7E4",
      timeSpent: 36902,
      isArchived: false
    }
  ]);
  const [currentProjectId, setCurrentProjectId] = useState(projects[0].id);

    const [timeByDate, setTimeByDate] = useState({
        "7/12/2026": 3600,
        "7/13/2026": 10000,   
        "7/14/2026": 12000,  
        "7/15/2026": 2000,  
        "7/16/2026": 9000,  
        "7/17/2026": 7200, 
        "7/18/2026": 6000, 
        "7/19/2026": 10000  
    });

  const [ tasksByDate, setTasksByDate ] = useState({
      "7/13/2026": [
          {
              id: 1,
              name: "Study React",
              projectId: 0,
              time: 90,
              isDone: false,
              dueDate: "2026-07-13"
          },
          {
              id: 2,
              name: "LeetCode",
              projectId: 1,
              time: 60,
              isDone: false,
              dueDate: "2026-07-13"
          }
      ],

      "7/14/2026": [
          {
              id: 3,
              name: "Work on Dashboard",
              projectId: 1,
              time: 120,
              isDone: true,
              dueDate: "2026-07-15"
          },
          {
              id: 4,
              name: "Linux+ Study",
              projectId: 3,
              time: 45,
              isDone: true,
              dueDate: "2026-07-13"
          },
          {
              id: 5,
              name: "Gym",
              projectId: 0,
              time: 60,
              isDone: false,
              dueDate: "2026-07-15"
          }
      ],

      "7/15/2026": [
          {
              id: 6,
              name: "Weekly Quiz",
              projectId: 0,
              time: 30,
              isDone: false,
              dueDate: "2026-07-15"
          }
      ],

      "7/16/2026": [
          {
              id: 7,
              name: "Portfolio Improvements",
              projectId: 1,
              time: 120,
              isDone: false,
              dueDate: "2026-07-15"
          },
          {
              id: 8,
              name: "Cloud Notes",
              projectId: 3,
              time: 60,
              isDone: true,
              dueDate: "2026-07-15"
          }
      ],

      "7/17/2026": [
          {
              id: 9,
              name: "Read Documentation",
              projectId: 2,
              time: 45,
              isDone: true,
              dueDate: "2026-07-18"
          },
          {
              id: 10,
              name: "System Design Practice",
              projectId: 2,
              time: 90,
              isDone: false,
              dueDate: "2026-07-18"
          }
      ],

      "7/18/2026": [
          {
              id: 11,
              name: "Fix Timer Bugs",
              projectId: 1,
              time: 75,
              isDone: false,
              dueDate: "2026-07-19"
          },
          {
              id: 12,
              name: "Review Security Notes",
              projectId: 3,
              time: 60,
              isDone: true,
              dueDate: "2026-07-19"
          },
          {
              id: 13,
              name: "Laundry",
              projectId: 0,
              time: 30,
              isDone: true,
              dueDate: "2026-07-19"
          }
      ],

      "7/19/2026": [
          {
              id: 14,
              name: "Plan Next Week",
              projectId: 0,
              time: 30,
              isDone: true,
              dueDate: "2026-06-20",
          },
          {
              id: 15,
              name: "Refactor Weekly Calendar",
              projectId: 1,
              time: 90,
              isDone: true,
              dueDate: "2026-06-20"
          }
      ]
  });

  const [sessions, setSessions] = useState([
        {
            id: 1,
            projectId: 1,
            taskId: 3, // Work on Dashboard
            startTime: "2026-07-13T09:00:00",
            endTime: "2026-07-13T11:00:00",
            durationSeconds: 7200,
            date: "7/13/2026"
        },
        {
            id: 2,
            projectId: 3,
            taskId: 4, // Linux+ Study
            startTime: "2026-07-07T11:30:00",
            endTime: "2026-07-07T12:15:00",
            durationSeconds: 2700,
            date: "7/13/2026"
        },
        {
            id: 3,
            projectId: 2,
            taskId: null, // Gym
            startTime: "2026-07-07T18:00:00",
            endTime: "2026-07-07T19:00:00",
            durationSeconds: 3600,
            date: "7/13/2026"
        },
        {
            id: 4,
            projectId: 0,
            taskId: 6, // Weekly Quiz
            startTime: "2026-07-08T08:30:00",
            endTime: "2026-07-08T09:00:00",
            durationSeconds: 1800,
            date: "7/14/2026"
        },
        {
            id: 5,
            projectId: 1,
            taskId: 3, // Work on Dashboard
            startTime: "2026-07-08T10:00:00",
            endTime: "2026-07-08T12:00:00",
            durationSeconds: 7200,
            date: "7/14/2026"
        },
        {
            id: 6,
            projectId: 3,
            taskId: 4, // Linux+ Study
            startTime: "2026-07-08T13:15:00",
            endTime: "2026-07-08T14:00:00",
            durationSeconds: 2700,
            date: "7/14/2026"
        },
        {
            id: 7,
            projectId: 0,
            taskId: 5, // Gym
            startTime: "2026-07-08T17:30:00",
            endTime: "2026-07-08T18:30:00",
            durationSeconds: 3600,
            date: "7/14/2026"
        },
    ])

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
      const today = new Date();
      today.setHours(0, 0, 0, 0);

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

  function handleAddTask(dateKey) {
      setTaskModalMode("add");
      setSelectedDateKey(dateKey);
      setNewTask(null);
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

  function handleCreateProject(name, color) {
      setProjects(prevProjects => 
          [...prevProjects, {
            id: Date.now(),
            name: name,
            color: color,
            timeSpent: 0,
            isArchived: false
          }]
      )
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
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/Dashboard" />} />
                    <Route 
                        path="/dashboard" 
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
                                weeklyTimeGoal={weeklyTimeGoal}
                                setWeeklyTimeGoal={setWeeklyTimeGoal}
                            />
                        } 
                    />
                    <Route 
                        path="/calendar" 
                        element={
                            <CalendarPage 
                                tasksByDate={tasksByDate}
                                taskActions={taskActions}
                                taskModalState={taskModalState}
                            />
                        } 
                    />
                    <Route path="/projects" 
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
                    <Route path="/projects/:projectId" 
                           element={
                                <ProjectDetailsPage 
                                    projects={projects}
                                    setProjects={setProjects}
                                    tasksByDate={tasksByDate}
                                    handleEditTask={handleEditTask}
                                    handleAddTask={handleAddTask}
                                    setCurrentProjectId={setCurrentProjectId}
                                />
                            } 
                    />
                    <Route path="/sessions" 
                           element={
                                <SessionsPage 
                                    sessions={sessions}
                                    setSessions={setSessions}
                                    tasksByDate={tasksByDate}
                                    projects={projects}
                                    timeByDate={timeByDate}
                                    weeklyTimeGoal={weeklyTimeGoal}
                                    handleEditSession={handleEditSession}
                                />
                           } 
                    />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                </Route>
            </Routes>
            {isTaskModalOpen && (
                <AddTaskModal
                    projects={projects}
                    mode={taskModalMode}
                    task={newTask}
                    onClose={() => {
                        setCurrentProjectId(projects[0].id);
                        setIsTaskModalOpen(false);
                    }}
                    onSubmit={taskModalMode === "add" 
                                ? handleCreateTask : handleUpdateTask}
                    currentProjectId={currentProjectId}
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
        </BrowserRouter>
    );
}

export default App
