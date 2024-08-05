'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Friend {
  _id: string;
  name?: string;
  email?: string;
}

const CreateGroup: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('/api/friends/list');
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Failed to fetch friends', error);
        setError('Failed to fetch friends');
      }
    };

    fetchFriends();
  }, [session]);

  const handleFriendSelect = (friendId: string) => {
    setSelectedFriends((prevSelected) => {
      if (prevSelected.includes(friendId)) {
        return prevSelected.filter((id) => id !== friendId);
      } else {
        return [...prevSelected, friendId];
      }
    });
  };

  const handleCreateGroup = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/groups/create', {
        name: groupName,
        members: selectedFriends,
      });
      if (response.status === 201) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to create group', error);
      setError('Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Create Group</h2>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="mb-6 p-3 border rounded-lg w-full text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
      />
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Select Friends</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className={`flex items-center p-4 border rounded-lg shadow-md cursor-pointer ${
                selectedFriends.includes(friend._id) ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-gray-200 text-gray-800'
              }`}
              onClick={() => handleFriendSelect(friend._id)}
            >
              <input
                type="checkbox"
                checked={selectedFriends.includes(friend._id)}
                onChange={() => handleFriendSelect(friend._id)}
                className="mr-3 h-5 w-5 text-blue-600 focus:ring-0"
              />
              <div>
                <p className="font-medium">{friend.name || friend.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleCreateGroup}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Group'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CreateGroup;
