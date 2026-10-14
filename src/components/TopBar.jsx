import './TopBar.css'

function TopBar() {
    let isAuthenticated = false;

    return (
        <aside className="topbar">
            <div className="topbar-actions">
                {isAuthenticated ? (
                    <button className="profile-button">
                        Account
                        <img src="src/assets/default_profile_picture.png" alt="Profile picture" className='profile-picture'/>
                    </button>
                ) : (
                    <button className="sign-in-button">
                        Sign In
                    </button>
                )}
            </div>
        </aside>
    );
}

export default TopBar