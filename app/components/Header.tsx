import React from 'react';

const Header = () => (
  <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <h1 className="text-xl font-bold">Dashboard</h1>
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Logout
    </button>
  </header>
);

export default Header;
