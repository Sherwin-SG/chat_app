'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Adjust import for router
import Link from 'next/link';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // You could also redirect or show a message
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 p-8">
        <Header />
        <main className="flex-1 p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Welcome, {session.user?.name}!</h1>
          <p className="mt-2">This is your dashboard.</p>
        </main>
      </div>
    </div>
  );
};

const Sidebar = () => (
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


const Header = () => (
  <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <h1 className="text-xl font-bold">Dashboard</h1>
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Logout
    </button>
  </header>
);

export default Dashboard;
