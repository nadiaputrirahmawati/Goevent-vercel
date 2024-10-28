// UserLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';

const UserLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;