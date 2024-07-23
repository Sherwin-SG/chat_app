import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Header = () => {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold">
        {status === 'loading' ? 'Loading...' : session?.user?.email ?? 'Dashboard'}
      </h1>
      <div>
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
