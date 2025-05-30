import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://farm-management-g6yy.onrender.com/api/login/', {
        username,
        password,
      });
      setToken(response.data.token);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://farm-management-g6yy.onrender.com/api/register/', {
        username,
        password,
        confirm_password: confirmPassword,
      });
      setSuccess('Registration successful! Please log in.');
      setIsRegistering(false);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-green-500">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center uppercase font-sans">
          Farm Management System
        </h2>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center font-sans">
          {isRegistering ? 'Register' : 'Login'}
        </h3>
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
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2 font-sans font-medium"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2 font-sans font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
              required
              disabled={isLoading}
            />
          </div>
          {isRegistering && (
            <div className="mb-6">
              <label
                className="block text-gray-700 mb-2 font-sans font-medium"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-green-500 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-sans"
                required
                disabled={isLoading}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-green-600 text-white border border-green-600 p-3 rounded-lg hover:bg-green-700 transition-colors font-sans font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
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
            {isLoading ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 font-sans">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={toggleForm}
            className="ml-1 text-green-600 hover:text-green-800 font-sans underline focus:outline-none"
            disabled={isLoading}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;