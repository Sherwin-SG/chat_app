import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import md5 from 'md5';

const Header = () => {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Generate Gravatar URL if session and session.user.email are available
  const emailHash = session?.user?.email ? md5(session.user.email.trim().toLowerCase()) : '';
  const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;

  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
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
      <div className="flex items-center">
        <Link href="/dashboard/friends" legacyBehavior>
          <a className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Add Friend
          </a>
        </Link>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
