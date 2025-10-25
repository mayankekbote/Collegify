import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import "./Header.css";


const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo">
          <div className="logo-icon">C</div>
          <span className="logo-text">Collegify</span>
        </Link>
        
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-item nav-link">Home</Link>
          </li>
          <li>
            <Link to="/college-finder" className="nav-item nav-link">College Finder</Link>
          </li>
          <li>
            <Link to="/branch-quiz" className="nav-item nav-link">Branch Quiz</Link>
          </li>
          {user && (
            <li>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <li>
              <Link to="/admin" className="nav-item">Admin</Link>
            </li>
          )}
        </ul>

        <div className="auth-buttons">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-outline">
                <User size={16} />
                Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-primary">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      
    </header>
  );
};

export default Header;