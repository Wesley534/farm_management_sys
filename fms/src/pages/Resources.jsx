import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    id: '',
    name: '',
    quantity: '',
    type: '',
    unit: 'units',
    usage_status: 'available',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const unitOptions = [
    { value: 'kgs', label: 'Kilograms' },
    { value: 'litres', label: 'Litres' },
    { value: 'units', label: 'Units' },
    { value: 'tons', label: 'Tons' },
    { value: 'gallons', label: 'Gallons' },
  ];

  const usageStatusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'depleted', label: 'Depleted' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access resources');
      navigate('/login');
      return;
    }
    fetchResources();
  }, [navigate]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/resources/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      setResources(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch resources');
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

    try {
      const data = {
        name: form.name,
        quantity: parseFloat(form.quantity),
        type: form.type,
        unit: form.unit,
        usage_status: form.usage_status,
      };

      if (form.id) {
        await axios.put(`http://localhost:8000/api/resources/${form.id}/`, data, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        setSuccess('Resource updated successfully!');
      } else {
        await axios.post('http://localhost:8000/api/resources/', data, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        setSuccess('Resource added successfully!');
      }
      fetchResources();
      setForm({ id: '', name: '', quantity: '', type: '', unit: 'units', usage_status: 'available' });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.unit?.[0] ||
        err.response?.data?.usage_status?.[0] ||
        'Operation failed'
      );
      setForm({ id: '', name: '', quantity: '', type: '', unit: 'units', usage_status: 'available' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (resource) => {
    setForm({
      id: resource.id,
      name: resource.name,
      quantity: resource.quantity,
      type: resource.type,
      unit: resource.unit || 'units',
      usage_status: resource.usage_status || 'available',
    });
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`http://localhost:8000/api/resources/${id}/`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      setSuccess('Resource deleted successfully!');
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center uppercase font-sans">
        Resource Management
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
        <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Add/Edit Resource</h3>
        <form onSubmit={handleSubmit} aria-label="Resource management form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="name">
                Resource Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-green-500 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="quantity">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={form.quantity}
                onChange={handleInputChange}
                className="w-full p-3 border border-green-500 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
                required
                step="0.01"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="unit">
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                value={form.unit}
                onChange={handleInputChange}
                className="w-full p-3 border border-green-500 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
                required
                disabled={isLoading}
              >
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="type">
                Type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={form.type}
                onChange={handleInputChange}
                className="w-full p-3 border border-green-500 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="usage_status">
                Usage Status
              </label>
              <select
                id="usage_status"
                name="usage_status"
                value={form.usage_status}
                onChange={handleInputChange}
                className="w-full p-3 border border-green-500 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
                required
                disabled={isLoading}
              >
                {usageStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {isLoading ? 'Saving...' : form.id ? 'Update Resource' : 'Add Resource'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Resource List</h3>
        {isLoading && !resources.length ? (
          <p className="text-gray-600 font-sans">Loading...</p>
        ) : resources.length === 0 ? (
          <p className="text-gray-600 font-sans">No resources found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-100">
                  <th className="p-3 font-sans font-medium text-gray-700">Name</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Quantity</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Type</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Status</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource.id} className="border-b">
                    <td className="p-3 font-sans text-gray-900">{resource.name}</td>
                    <td className="p-3 font-sans text-gray-900">
                      {resource.quantity} {resource.unit || 'units'}
                    </td>
                    <td className="p-3 font-sans text-gray-900">{resource.type}</td>
                    <td className="p-3 font-sans text-gray-900">
                      {usageStatusOptions.find(opt => opt.value === (resource.usage_status || 'available'))?.label || 'Available'}
                    </td>
                    <td className="p-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(resource)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-sans"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 font-sans"
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

export default Resources;