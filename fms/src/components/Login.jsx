
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending login request:', { username, password });
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
      console.log('Login response:', response.data);
      setToken(response.data.token);
      setError('');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      console.error('Login error:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-shamba-light">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-shamba-green mb-6 text-center">Farm Management System</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-shamba-green"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-shamba-green"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-shamba-green border border-shamba-green p-2 rounded hover:bg-shamba-green hover:text-white transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
