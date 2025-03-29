import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="ml-64 flex-1 text-white">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;