import './Layout.css';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import TopBar from './TopBar';

function Layout() {
    return (
        <div className="app-layout">
            <SideBar />
            <TopBar />
            <main className="page-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout