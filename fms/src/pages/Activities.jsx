import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({
    id: null,
    description: '',
    date: '',
    crop_id: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCrops();
    fetchActivities();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get('https://farm-management-g6yy.onrender.com/api/crops/');
      setCrops(response.data);
    } catch (err) {
      setError('Failed to fetch your crops');
    }
  };

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://farm-management-g6yy.onrender.com/api/activities/');
      setActivities(response.data);
    } catch (err) {
      setError('Failed to fetch your activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const data = {
      description: form.description,
      date: form.date,
      crop_id: form.crop_id,
    };
    console.log('POST payload:', data); // Debug payload

    try {
      if (form.id) {
        await axios.put(`https://farm-management-g6yy.onrender.com/api/activities/${form.id}/`, data);
        setSuccess('Activity updated successfully!');
      } else {
        await axios.post('https://farm-management-g6yy.onrender.com/api/activities/', data);
        setSuccess('Activity added successfully!');
      }
      fetchActivities();
      setForm({ id: null, description: '', date: '', crop_id: '' });
    } catch (err) {
      console.error('POST error response:', err.response?.data); // Debug error
      setError(err.response?.data?.detail || Object.values(err.response?.data || {}).join(' ') || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (activity) => {
    setForm({
      id: activity.id,
      description: activity.description,
      date: activity.date,
      crop_id: activity.crop.id,
    });
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`https://farm-management-g6yy.onrender.com/api/activities/${id}/`);
      setSuccess('Activity deleted successfully!');
      fetchActivities();
    } catch (err) {
      setError('Failed to delete activity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center uppercase font-sans">
        Activity Tracker
      </h2>
      <div aria-live="polite">
        {error && (
          <p className="text-red-500 mb-4 font-sans transition-opacity duration-300">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 mb-4 font-sans transition-opacity duration-300">
            {success}
          </p>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Log Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="crop_id">
              Associated Crop
            </label>
            <select
              id="crop_id"
              name="crop_id"
              value={form.crop_id}
              onChange={handleInputChange}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              required
              disabled={isLoading}
            >
              <option value="">Select Crop</option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name} ({crop.variety})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-4 w-full flex items-center justify-center bg-green-600 text-white border border-green-600 p-3 rounded-lg hover:bg-green-700 transition-colors font-sans font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M12 2a10 10 0 0110 10h-2a8 8 0 00-8-8V2z"
              ></path>
            </svg>
          ) : null}
          {isLoading ? 'Logging...' : form.id ? 'Update Activity' : 'Add Activity'}
        </button>
      </div>
      <div>
        <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Activity List</h3>
        {isLoading && !activities.length ? (
          <p className="text-gray-600 font-sans">Loading...</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-600 font-sans">No activities logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-100">
                  <th className="p-3 font-sans font-medium text-gray-700">Description</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Date</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Crop</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="border-b">
                    <td className="p-3 font-sans text-gray-900">{activity.description}</td>
                    <td className="p-3 font-sans text-gray-900">{activity.date}</td>
                    <td className="p-3 font-sans text-gray-900">{activity.crop?.name || 'Unknown'}</td>
                    <td className="p-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-sans"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-sans"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;