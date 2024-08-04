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

interface Group {
  _id: string;
  name: string;
  members: string[];
}

const CreateGroup: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]); // Ensure this is an array
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

    const fetchGroups = async () => {
      try {
        const response = await axios.get('/api/groups/list');
        if (Array.isArray(response.data)) {
          setGroups(response.data);
        } else {
          console.error('Groups data is not an array:', response.data);
          setError('Unexpected data format for groups');
        }
      } catch (error) {
        console.error('Failed to fetch groups', error);
        setError('Failed to fetch groups');
      }
    };

    fetchFriends();
    fetchGroups();
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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Create Group</h2>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="mb-4 p-2 border rounded-lg w-full"
      />
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Select Friends</h3>
        <ul className="list-disc pl-5">
          {friends.map((friend) => (
            <li key={friend._id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedFriends.includes(friend._id)}
                  onChange={() => handleFriendSelect(friend._id)}
                />
                {friend.name || friend.email}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleCreateGroup}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Group'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Display Groups */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
        <ul className="list-disc pl-5">
          {Array.isArray(groups) && groups.map((group) => (
            <li key={group._id}>
              <p className="font-semibold">{group.name}</p>
              <p>Members: {group.members.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateGroup;
