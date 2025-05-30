import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('https://farm-management-g6yy.onrender.com/api/notifications/');
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Fetch error:', err.response?.status, err.response?.data);
      setError('Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(`https://farm-management-g6yy.onrender.com/api/notifications/${id}/read/`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center uppercase font-sans">
        Notifications
      </h2>
      {error && <p className="text-red-500 mb-4 font-sans">{error}</p>}
      {isLoading ? (
        <p className="text-gray-600 font-sans">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-600 font-sans">No notifications</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-100">
                <th className="p-3 font-sans font-medium text-gray-700">Message</th>
                <th className="p-3 font-sans font-medium text-gray-700">Type</th>
                <th className="p-3 font-sans font-medium text-gray-700">Crop</th>
                <th className="p-3 font-sans font-medium text-gray-700">Date</th>
                <th className="p-3 font-sans font-medium text-gray-700">Status</th>
                <th className="p-3 font-sans font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification.id} className="border-b">
                  <td className="p-3 font-sans text-gray-900">{notification.message}</td>
                  <td className="p-3 font-sans text-gray-900">{notification.type}</td>
                  <td className="p-3 font-sans text-gray-900">{notification.crop?.name || 'N/A'}</td>
                  <td className="p-3 font-sans text-gray-900">
                    {new Date(notification.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 font-sans text-gray-900">
                    {notification.is_read ? 'Read' : 'Unread'}
                  </td>
                  <td className="p-3">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-sans"
                      >
                        Mark as Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Notifications;