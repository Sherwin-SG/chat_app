import React from 'react';
import Link from 'next/link';

const Sidebar = () => (
  <div className="w-64 bg-gray-800 text-white flex flex-col">
    <div className="p-4 text-lg font-semibold border-b border-gray-700">
      Dashboard
    </div>
    <nav className="flex-1 p-4">
      <ul>
        <li>
          <Link href="/dashboard">
            <a className="block py-2 px-4 rounded hover:bg-gray-700">Home</a>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/friends">
            <a className="block py-2 px-4 rounded hover:bg-gray-700">Friends</a>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings">
            <a className="block py-2 px-4 rounded hover:bg-gray-700">Settings</a>
          </Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
