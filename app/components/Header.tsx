import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import md5 from 'md5';
import SettingsMenu from './SettingsMenu';

const Header = () => {
  const { data: session, status } = useSession();

  // Generate Gravatar URL if session and session.user.email are available
  const emailHash = session?.user?.email ? md5(session.user.email.trim().toLowerCase()) : '';
  const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;

  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-4">
      <div className="flex items-center">
        {status === 'loading' ? (
          <p className="text-xl font-bold">Loading...</p>
        ) : session && session.user ? (
          <div className="relative group">
            <img
              src={gravatarUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full cursor-pointer"
            />
            <span className="absolute left-0 px-2 py-1 mt-2 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100">
              {session.user.email}
            </span>
          </div>
        ) : (
          <p className="text-xl font-bold">No user</p>
        )}
      </div>
      <SettingsMenu />
    </header>
  );
};

export default Header;
