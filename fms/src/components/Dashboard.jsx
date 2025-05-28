import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ token }) => {
  const [totalCrops, setTotalCrops] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/crops/', {
          headers: { Authorization: `Token ${token}` },
        });
        setTotalCrops(response.data.length);
        const tasks = response.data
          .filter(crop => new Date(crop.harvest_date) > new Date())
          .map(crop => ({
            task: `Harvest ${crop.name} (${crop.variety})`,
            date: crop.harvest_date,
          }));
        setUpcomingTasks(tasks);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };
    fetchCrops();
  }, [token]);

  return (
    <div className="min-h-screen bg-shamba-light p-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-shamba-green mb-6">Farm Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Total Crops</h3>
            <p className="text-2xl text-shamba-green">{totalCrops}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Tasks</h3>
            <ul className="list-disc pl-5">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task, index) => (
                  <li key={index} className="text-gray-600">{task.task} on {task.date}</li>
                ))
              ) : (
                <li className="text-gray-600">No upcoming tasks.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;