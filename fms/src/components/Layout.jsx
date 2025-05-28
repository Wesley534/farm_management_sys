import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;