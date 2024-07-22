import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => (
  <div className="w-64 bg-gray-800 text-white flex flex-col">
    <div className="p-4 text-lg font-semibold border-b border-gray-700">
      Dashboard
    </div>
    <nav className="flex-1 p-4">
      <ul>
        <li>
          <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
            Home
          </Link>
        </li>
        <li>
          <Link href="/dashboard/friends" className="block py-2 px-4 rounded hover:bg-gray-700">
            Friends
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className="block py-2 px-4 rounded hover:bg-gray-700">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
