import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    variety: '',
    planting_date: '',
    harvest_date: '',
    status: 'Planting',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/crops/');
      setCrops(response.data);
    } catch (err) {
      setError('Failed to fetch crops');
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
        variety: form.variety,
        planting_date: form.planting_date,
        harvest_date: form.harvest_date,
        status: form.status,
      };

      if (form.id) {
        await axios.put(`http://localhost:8000/api/crops/${form.id}/`, data);
        setSuccess('Crop updated successfully!');
      } else {
        await axios.post('http://localhost:8000/api/crops/', data);
        setSuccess('Crop added successfully!');
      }
      fetchCrops();
      setForm({ id: null, name: '', variety: '', planting_date: '', harvest_date: '', status: 'Planting' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (crop) => {
    setForm(crop);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`http://localhost:8000/api/crops/${id}/`);
      setSuccess('Crop deleted successfully!');
      fetchCrops();
    } catch (err) {
      setError('Failed to delete crop');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center uppercase font-sans">
        Crop Management
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
        <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Add/Edit Crop</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="name">
              Crop Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="variety">
              Variety
            </label>
            <input
              type="text"
              id="variety"
              name="variety"
              value={form.variety}
              onChange={handleInputChange}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="planting_date">
              Planting Date
            </label>
            <input
              type="date"
              id="planting_date"
              name="planting_date"
              value={form.planting_date}
              onChange={handleInputChange}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="harvest_date">
              Expected Harvest Date
            </label>
            <input
              type="date"
              id="harvest_date"
              name="harvest_date"
              value={form.harvest_date}
              onChange={handleInputChange}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-sans font-medium" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              disabled={isLoading}
            >
              <option value="Planting">Planting</option>
              <option value="Growing">Growing</option>
              <option value="Harvesting">Harvesting</option>
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
          {isLoading ? 'Saving...' : form.id ? 'Update Crop' : 'Add Crop'}
        </button>
      </div>
      <div>
        <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Crop List</h3>
        {isLoading && !crops.length ? (
          <p className="text-gray-600 font-sans">Loading...</p>
        ) : crops.length === 0 ? (
          <p className="text-gray-600 font-sans">No crops added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-100">
                  <th className="p-3 font-sans font-medium text-gray-700">Name</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Variety</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Planting Date</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Harvest Date</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Status</th>
                  <th className="p-3 font-sans font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop) => (
                  <tr key={crop.id} className="border-b">
                    <td className="p-3 font-sans text-gray-900">{crop.name}</td>
                    <td className="p-3 font-sans text-gray-900">{crop.variety}</td>
                    <td className="p-3 font-sans text-gray-900">{crop.planting_date}</td>
                    <td className="p-3 font-sans text-gray-900">{crop.harvest_date}</td>
                    <td className="p-3 font-sans text-gray-900">{crop.status}</td>
                    <td className="p-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(crop)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-sans"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(crop.id)}
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

export default Crops;