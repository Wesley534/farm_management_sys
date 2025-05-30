import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard = () => {
  const [crops, setCrops] = useState([]);
  const [resources, setResources] = useState([]);
  const [activities, setActivities] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access the dashboard');
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [userResponse, cropsResponse, resourcesResponse, activitiesResponse] = await Promise.all([
        axios.get('https://farm-management-g6yy.onrender.com/api/user/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        }),
        axios.get('https://farm-management-g6yy.onrender.com/api/crops/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        }),
        axios.get('https://farm-management-g6yy.onrender.com/api/resources/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        }),
        axios.get('https://farm-management-g6yy.onrender.com/api/activities/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        }),
      ]);
      setUsername(userResponse.data.username);
      setCrops(cropsResponse.data);
      setResources(resourcesResponse.data);
      setActivities(activitiesResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = (reportType) => {
    try {
      const doc = new jsPDF();
      const today = new Date().toISOString().split('T')[0];

      // Header
      doc.setFontSize(18);
      doc.text(`Farm Management System - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 14, 20);
      doc.setFontSize(12);
      doc.text(`Generated for: ${username}`, 14, 30);
      doc.text(`Date: ${today}`, 14, 36);

      // Table
      let columns, rows;
      if (reportType === 'crops') {
        columns = ['Name', 'Variety', 'Status', 'Planting Date', 'Harvest Date'];
        rows = crops.map(crop => [
          crop.name || '',
          crop.variety || '',
          crop.status || '',
          crop.planting_date || '',
          crop.harvest_date || '',
        ]);
      } else if (reportType === 'resources') {
        columns = ['Name', 'Quantity', 'Unit', 'Type', 'Usage Status'];
        rows = resources.map(res => [
          res.name || '',
          res.quantity || 0,
          res.unit || 'units',
          res.type || '',
          res.usage_status ? res.usage_status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '',
        ]);
      } else if (reportType === 'activities') {
        columns = ['Description', 'Date', 'Crop'];
        rows = activities.map(act => [
          act.description || '',
          act.date || '',
          act.crop?.name || 'Unknown',
        ]);
      }

      // Apply autoTable
      autoTable(doc, {
        startY: 50,
        head: [columns],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 34] },
        styles: { fontSize: 10 },
      });

      // Save
      doc.save(`${reportType}_report.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate the report');
    }
  };

  const today = new Date();
  const upcomingTasks = crops
    .filter((crop) => crop && new Date(crop.harvest_date) > today)
    .map((crop) => ({
      task: `Harvest ${crop.name}`,
      date: crop.harvest_date,
    }));

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center uppercase font-sans">
        Farm Management Dashboard
      </h2>
      {username && (
        <p className="text-xl text-gray-700 mb-4 font-sans text-center">
          Welcome, {username}!
        </p>
      )}
      {error && (
        <p className="text-red-500 mb-4 font-sans transition-opacity duration-300">
          {error}
        </p>
      )}
      {isLoading ? (
        <p className="text-gray-600 font-sans">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Crops Overview</h3>
              <p className="text-gray-900 font-sans">
                <span className="font-bold">Total Crops:</span> {crops.length}
              </p>
              <p className="text-gray-900 font-sans">
                <span className="font-bold">Crops in Planting:</span>{' '}
                {crops.filter((c) => c.status === 'Planting').length}
              </p>
              <p className="text-gray-900 font-sans">
                <span className="font-bold">Crops in Growing:</span>{' '}
                {crops.filter((c) => c.status === 'Growing').length}
              </p>
              <p className="text-gray-900 font-sans">
                <span className="font-bold">Crops in Harvesting:</span>{' '}
                {crops.filter((c) => c.status === 'Harvesting').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Resources Overview</h3>
              <p className="text-gray-900 font-sans">
                <span className="font-bold">Total Resources:</span> {resources.length}
              </p>
              <p className="text-gray-900 font-sans">
                <span className="font-bold">Available Resources:</span>{' '}
                {resources.filter((r) => r.usage_status === 'available').length}
              </p>
              <p className="text-gray-900 font-sans">
                <span className="font-bold">In Use:</span>{' '}
                {resources.filter((r) => r.usage_status === 'in_use').length}
              </p>
              <p className="text-gray-900 font-sans">
                <span className="font-bold">Depleted:</span>{' '}
                {resources.filter((r) => r.usage_status === 'depleted').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Upcoming Tasks</h3>
              {upcomingTasks.length === 0 ? (
                <p className="text-gray-600 font-sans">No upcoming tasks.</p>
              ) : (
                <ul className="list-disc pl-5">
                  {upcomingTasks.map((task, index) => (
                    <li key={index} className="text-gray-900 font-sans">
                      {task.task} on {task.date}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700 mb-4 font-semibold">Reports</h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => generateReport('crops')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-sans"
                >
                  Download Crops Report
                </button>
                <button
                  onClick={() => generateReport('resources')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-sans"
                >
                  Download Resources Report
                </button>
                <button
                  onClick={() => generateReport('activities')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-sans"
                >
                  Download Activities Report
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Recent Activities</h3>
            {activities.length === 0 ? (
              <p className="text-gray-600 font-sans">No recent activities.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="p-3 font-sans font-medium text-gray-700">Description</th>
                      <th className="p-3 font-sans font-medium text-gray-700">Date</th>
                      <th className="p-3 font-sans font-medium text-gray-700">Crop</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity.id} className="border-b">
                        <td className="p-3 font-sans text-gray-900">{activity.description}</td>
                        <td className="p-3 font-sans text-gray-900">{activity.date}</td>
                        <td className="p-3 font-sans text-gray-900">
                          {activity.crop?.name || 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;