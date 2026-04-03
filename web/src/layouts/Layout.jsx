import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children || <Outlet />}
      <BottomNav />
    </div>
  );
};

export default Layout;
