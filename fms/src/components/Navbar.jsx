import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Notification from './Notification';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-green-600 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold font-sans">Farm Management</div>

        {/* Hamburger menu button for mobile */}
        {token && (
          <button
            className="md:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        )}

        {/* Desktop navigation links */}
        {token && (
          <div className="hidden md:flex space-x-4 items-center">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-white hover:text-green-200 font-sans ${isActive ? 'font-bold' : ''}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/crops"
              className={({ isActive }) =>
                `text-white hover:text-green-200 font-sans ${isActive ? 'font-bold' : ''}`
              }
            >
              Crops
            </NavLink>
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `text-white hover:text-green-200 font-sans ${isActive ? 'font-bold' : ''}`
              }
            >
              Resources
            </NavLink>
            <NavLink
              to="/activities"
              className={({ isActive }) =>
                `text-white hover:text-green-200 font-sans ${isActive ? 'font-bold' : ''}`
              }
            >
              Activities
            </NavLink>
            <Notification />
            <button
              onClick={handleLogout}
              className="text-white hover:text-green-200 font-sans"
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile menu */}
        {token && isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-green-600 shadow-lg z-30">
            <div className="flex flex-col space-y-4 p-4">
              <NavLink
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-white hover:text-green-200 font-sans text-lg ${isActive ? 'font-bold' : ''}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/crops"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-white hover:text-green-200 font-sans text-lg ${isActive ? 'font-bold' : ''}`
                }
              >
                Crops
              </NavLink>
              <NavLink
                to="/resources"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-white hover:text-green-200 font-sans text-lg ${isActive ? 'font-bold' : ''}`
                }
              >
                Resources
              </NavLink>
              <NavLink
                to="/activities"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-white hover:text-green-200 font-sans text-lg ${isActive ? 'font-bold' : ''}`
                }
              >
                Activities
              </NavLink>
              <div className="flex items-center space-x-2">
                <Notification />
                <span className="text-white font-sans text-lg">Notifications</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-white hover:text-green-200 font-sans text-lg text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;