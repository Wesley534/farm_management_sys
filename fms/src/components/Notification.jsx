import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const location = useLocation();

  console.log('Notification component rendered'); // Debug

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:8000/api/notifications/');
      console.log('Notifications response:', response.data); // Debug
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Fetch error:', err.response?.status, err.response?.data, err.message); // Debug
      setError('Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/notifications/${id}/read/`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Mark as read error:', err.response?.data); // Debug
      setError('Failed to mark notification as read');
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const unreadCount = unreadNotifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          fetchNotifications(); // Refetch on click
        }}
        className="relative p-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Notifications"
      >
        <svg
          className="h-6 w-6"
          style={{ stroke: '#ffffff', fill: 'none' }}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-20">
          <div className="p-4 border-b bg-green-50 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 font-sans">Notifications</h3>
            <NavLink
              to="/notifications"
              className="text-green-600 hover:text-green-800 text-sm font-sans"
              onClick={() => setIsOpen(false)}
            >
              View All
            </NavLink>
          </div>
          {isLoading ? (
            <p className="p-4 text-gray-600 font-sans">Loading...</p>
          ) : error ? (
            <p className="p-4 text-red-500 font-sans">{error}</p>
          ) : unreadNotifications.length === 0 ? (
            <p className="p-4 text-gray-600 font-sans">No unread notifications</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {unreadNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className="p-4 border-b flex justify-between items-center bg-white"
                >
                  <div>
                    <p className="text-sm font-sans text-gray-900 font-medium">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 font-sans">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-green-600 hover:text-green-800 text-sm font-sans"
                  >
                    Mark as read
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;