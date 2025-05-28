import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold uppercase font-sans">Farm Management</h1>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium font-sans uppercase ${
                  isActive ? 'bg-green-800' : 'hover:bg-green-700'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/crops"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium font-sans uppercase ${
                  isActive ? 'bg-green-800' : 'hover:bg-green-700'
                }`
              }
            >
              Crops
            </NavLink>
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium font-sans uppercase ${
                  isActive ? 'bg-green-800' : 'hover:bg-green-700'
                }`
              }
            >
              Resources
            </NavLink>
            <NavLink
              to="/activities"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium font-sans uppercase ${
                  isActive ? 'bg-green-800' : 'hover:bg-green-700'
                }`
              }
            >
              Activities
            </NavLink>
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Toggle menu"
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
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium font-sans uppercase ${
                  isActive ? 'bg-green-800' : 'hover:bg-green-700'
                }`
              }
              onClick={toggleMenu}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/crops"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium font-sans uppercase ${
                  isActive ? 'bg-green-800' : 'hover:bg-green-700'
                }`
              }
              onClick={toggleMenu}
            >
              Crops
            </NavLink>
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium font-sans uppercase ${
                  isActive ? 'bg-green-800' : 'hover:bg-green-700'
                }`
              }
              onClick={toggleMenu}
            >
              Resources
            </NavLink>
            <NavLink
              to="/activities"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium font-sans uppercase ${
                  isActive ? 'bg-green-800' : 'hover:bg-green-700'
                }`
              }
              onClick={toggleMenu}
            >
              Activities
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;