'use client'

import React from 'react';
import { useSession } from 'next-auth/react';
import AddFriend from '../../components/AddFriend'; // Adjust the path if needed

const FriendsPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col flex-1 p-8">
      <Header />
      <main className="flex-1 p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Friends</h1>
        <p className="mt-2">Manage your friends and add new ones.</p>
        <AddFriend />
        {/* Here you can also list current friends or other friend-related functionalities */}
      </main>
    </div>
  );
};

const Header = () => (
  <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <h1 className="text-xl font-bold">Friends</h1>
  </header>
);

export default FriendsPage;
