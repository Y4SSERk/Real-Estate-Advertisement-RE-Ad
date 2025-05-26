import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">RE-Ad</span>
          <span className="logo-tagline">Real Estate Marketplace</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/search" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Search
            </Link>
          </li>
          
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/my-properties" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  My Properties
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" onClick={toggleDropdown}>
                  <div className="profile-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <span className="user-name">{user.name}</span>
                  <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                </button>
                <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                  <li>
                    <Link to="/profile" className="dropdown-item" onClick={() => { setDropdownOpen(false); setIsMenuOpen(false); }}>
                      <i className="fas fa-user"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-properties" className="dropdown-item" onClick={() => { setDropdownOpen(false); setIsMenuOpen(false); }}>
                      <i className="fas fa-home"></i> My Properties
                    </Link>
                  </li>
                  <li>
                    <Link to="/add-property" className="dropdown-item" onClick={() => { setDropdownOpen(false); setIsMenuOpen(false); }}>
                      <i className="fas fa-plus"></i> Add Property
                    </Link>
                  </li>
                  <li className="dropdown-divider"></li>
                  <li>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <li className="nav-item auth-buttons">
              <Link to="/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
