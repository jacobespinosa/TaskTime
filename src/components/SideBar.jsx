import './SideBar.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFolder, faClock } from '@fortawesome/free-regular-svg-icons';
import { faChartLine, faGear, faBorderAll } from '@fortawesome/free-solid-svg-icons';

function SideBar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p>App Name</p>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">Menu</p>
        <NavLink to="/dashboard" className="sidebar-link">
          <FontAwesomeIcon icon={faBorderAll} />
          Dashboard
        </NavLink>
        <NavLink to="/calendar" className="sidebar-link">
          <FontAwesomeIcon icon={faCalendar} />
          Calendar
        </NavLink>
        <NavLink to="/projects" className="sidebar-link">
          <FontAwesomeIcon icon={faFolder} />
          Projects
        </NavLink>
        <NavLink to="/sessions" className="sidebar-link">
          <FontAwesomeIcon icon={faClock} />
          Sessions
        </NavLink>
        <NavLink to="/analytics" className="sidebar-link">
          <FontAwesomeIcon icon={faChartLine} />
          Analytics
        </NavLink>
      </div>
    {/*
      <div className="sidebar-section">
        <p className="sidebar-title">General</p>
        <a href="#" className="sidebar-link">
          <FontAwesomeIcon icon={faGear} />
          Settings
        </a>
      </div>
    */}
    </aside>
  );
}

export default SideBar