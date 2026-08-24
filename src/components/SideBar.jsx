import './SideBar.css';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFolder, faClock } from '@fortawesome/free-regular-svg-icons';
import { faChartLine, faGear, faBorderAll } from '@fortawesome/free-solid-svg-icons';

function SideBar() {
  const location = useLocation();

  const isDemo = location.pathname.startsWith("/demo");
  const base = isDemo ? "/demo" : "";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p>TaskTime</p>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">Menu</p>
        <NavLink to={`${base}/dashboard`} className="sidebar-link">
          <FontAwesomeIcon icon={faBorderAll} />
          Dashboard
        </NavLink>
        <NavLink to={`${base}/calendar`} className="sidebar-link">
          <FontAwesomeIcon icon={faCalendar} />
          Calendar
        </NavLink>
        <NavLink to={`${base}/projects`} className="sidebar-link">
          <FontAwesomeIcon icon={faFolder} />
          Projects
        </NavLink>
        <NavLink to={`${base}/sessions`} className="sidebar-link">
          <FontAwesomeIcon icon={faClock} />
          Sessions
        </NavLink>
        <NavLink to={`${base}/analytics`} className="sidebar-link">
          <FontAwesomeIcon icon={faChartLine} />
          Analytics
        </NavLink>
      </div>
      {isDemo && (
        <div className='demo-warning'>
          <span className='demo-label'>Demo Mode</span>
          <p>You're viewing sample data.</p>
        </div>
      )}
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