'use client'

import React from 'react';
import { useSession } from 'next-auth/react';
import AddFriend from '../../components/AddFriend'; 

const FriendsPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Friends</h1>
        <AddFriend />
        {/* Here you can also list current friends or other friend-related functionalities */}
      </div>
    </div>
  );
};

export default FriendsPage;