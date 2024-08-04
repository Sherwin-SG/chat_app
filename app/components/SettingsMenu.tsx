'use client';

import { useState } from 'react';
import DarkModeToggle from './DarkModeTogggle'; // Make sure the file name is correct
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import Link from 'next/link'; // Import Link from next/link

const SettingsMenu = () => {
  const router = useRouter(); // Initialize router

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleCreateGroup = () => {
    router.push('/create-group'); // Navigate to the create group page
  };

  return (
    <div className="relative group">
      <button
        className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-700"
      >
        Settings
      </button>
      <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link href="/dashboard/friends" legacyBehavior>
          <a className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            Add Friend
          </a>
        </Link>
        <DarkModeToggle />
        <button
        onClick={handleCreateGroup}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
      >
        Create Group
      </button>

        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 mt-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsMenu;
