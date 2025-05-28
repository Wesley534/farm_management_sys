import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [crops, setCrops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cropsResponse, activitiesResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/crops/'),
        axios.get('http://localhost:8000/api/activities/'),
      ]);
      setCrops(cropsResponse.data);
      setActivities(activitiesResponse.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date();
  const upcomingTasks = crops
    .filter((crop) => new Date(crop.harvest_date) > today)
    .map((crop) => ({
      task: `Harvest ${crop.name}`,
      date: crop.harvest_date,
    }));

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center uppercase font-sans">
        Farm Dashboard
      </h2>
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
              <h3 className="text-xl font-medium text-gray-700 mb-4 font-sans">Overview</h3>
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
                          {activity.crop.name || 'Unknown'}
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