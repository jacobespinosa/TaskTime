import './Dashboard.css';

import { getCurrentWeekStart, getDateKey } from '../utils/dateUtils';
import { getWeeklyTaskStats } from '../utils/taskUtils';
import { getWeeklyTotalTime, getWeeklyTimeStats } from '../utils/timeUtils';
import { useState } from 'react';

import AddTaskModal from '../components/modals/AddTaskModal';
import SideBar from "../components/SideBar";
import Timer   from "../components/dashboard/Timer";
import WeeklyCalendar from '../components/calendar/WeeklyCalendar';
import ProgressRing from '../components/charts/ProgressRing';
import TodayTaskList from '../components/dashboard/TodayTaskList';
import ProjectTimeBreakdown from '../components/charts/ProjectTimeBreakdown';
import SetWeeklyGoalModal from '../components/modals/SetWeeklyGoalModal';
import RecentSessions from '../components/dashboard/RecentSessions';
import StreaksCard from '../components/dashboard/StreaksCard';
import ColumnBarChart from '../components/charts/ColumnBarChart';

function Dashboard({projects, setProjects, tasksByDate, setTasksByDate,
                    timeByDate, setTimeByDate, taskActions, taskModalState,
                    newTask, sessions, setSessions, currentProjectId, setCurrentProjectId,
                    isCreateProjectOpen, setIsCreateProjectOpen, weeklyTimeGoals, setWeeklyTimeGoals,
                    handleEditSession, timer, setTimer}) {

  const {
      handleCreateTask,
      handleDeleteTask,
      handleToggleTask,
      handleUpdateTask,
      handleAddTask,
      handleEditTask
  } = taskActions;

  const {
    taskModalMode,
    setTaskModalMode,
    isTaskModalOpen,
    setIsTaskModalOpen
  } = taskModalState

  const currentWeekStart = getCurrentWeekStart();
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const currentWeekStartDateKey = getDateKey(currentWeekStart);
  const lastWeekStartDateKey = getDateKey(lastWeekStart);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isWeeklyGoalModalOpen, setIsWeeklyGoalModalOpen] = useState(false);

  const { totalTasks, totalTasksCompleted } = getWeeklyTaskStats(tasksByDate);
  const totalWeeklyTime = getWeeklyTotalTime(timeByDate, currentWeekStart) + timer.elapsedSeconds;
  const weeklyTimeGoal = weeklyTimeGoals[currentWeekStartDateKey] ??
                         weeklyTimeGoals[lastWeekStartDateKey] ?? 0;

  const weeklyTimeStats = getWeeklyTimeStats(timeByDate);
  const sortedTimeStats = weeklyTimeStats.toSorted((a, b) => b.time - a.time);
  const mostTime = sortedTimeStats[0].time;
  const maxTime = Math.ceil(mostTime / 60) * 60;

  return (
      <main className="dashboard">
        <section className="dashboard-content">
          <Timer
            projects={projects}
            setProjects={setProjects}
            timeByDate={timeByDate}
            setTimeByDate={setTimeByDate}
            currentProjectId={currentProjectId}
            setCurrentProjectId={setCurrentProjectId}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            tasksByDate={tasksByDate}
            handleAddTask={handleAddTask}
            setIsCreateProjectOpen={setIsCreateProjectOpen}
            setSessions={setSessions}
            timer={timer}
            setTimer={setTimer}
          />

          <div className="dashboard-graphs">
            <div className="total-weekly-tasks-ring">
              <ProgressRing 
                value={totalTasksCompleted}
                goal={totalTasks}
                title={"Total Weekly Tasks"}
                unit=""
                onClick={""}
                width="300px"
                unit={""}
              />
            </div>
            <div className="total-weekly-time-ring">
              <ProgressRing
                value={totalWeeklyTime}
                goal={weeklyTimeGoal}
                title={"Total Weekly Time"}
                type="time"
                onClick={() => setIsWeeklyGoalModalOpen(true)}
                width="300px"
                unit={""}
              />
            </div>

            <div className="weekly-focus-chart">
              <ColumnBarChart 
                  title={"Weekly Focus Chart"}
                  data={weeklyTimeStats}
                  maxValue={maxTime}
                  getKey={item => item.day}
                  getValue={item => item.time}
                  getBottomLabel={item => item.day}
                  getTopLabel={item => item.timeDisplay}
                  getHoverInfo={item => `Time: ${item.timeDisplay}`}
                  columnWidth={"60px"}
                  columnGap={"2rem"}
              />
            </div>
          </div>

          <div className="streaks-card">
              <StreaksCard 
                  tasksByDate={tasksByDate}
                  timeByDate={timeByDate}
              />
          </div>
          <div className="right-panel">
            <div className="daily-task-list">
              <TodayTaskList
                tasksByDate={tasksByDate}
                projects={projects}
                handleAddTask={handleAddTask}
                handleEditTask={handleEditTask}
                handleCreateTask={handleCreateTask}
                handleDeleteTask={handleDeleteTask}
                handleToggleTask={handleToggleTask}
                handleUpdateTask={handleUpdateTask}
                timer={timer}
                setTimer={setTimer}
                setCurrentProjectId={setCurrentProjectId}
                setSelectedTask={setSelectedTask}
              />
            </div>
            <div className="recent-sessions">
                <RecentSessions 
                  sessions={sessions}
                  projects={projects}
                  tasksByDate={tasksByDate}
                  handleEditSession={handleEditSession}
                />
            </div>
          </div>
        </section>

      {isWeeklyGoalModalOpen && (
          <SetWeeklyGoalModal 
              onSubmit={(goal) => {
                  setWeeklyTimeGoals(prevGoals => ({
                      ...prevGoals,
                      [currentWeekStartDateKey]: goal
                  }));

                  setIsWeeklyGoalModalOpen(false);
              }}
              onClose={() => {
                setIsWeeklyGoalModalOpen(false);
              }}
              weeklyTimeGoal={weeklyTimeGoal}
          />
      )}
      </main>
  );
}

export default Dashboard