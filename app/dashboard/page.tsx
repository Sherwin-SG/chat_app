'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import FriendsList from '../components/FriendsList';
import GroupsList from '../components/GroupsList';
import ChatWindow from '../components/ChatWindow';
import GroupChatWindow from '../components/GroupChatWindow';
import Header from '../components/Header';

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

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsResponse = await axios.get('/api/friends/list');
        const groupsResponse = await axios.get('/api/groups/list');
        setFriends(friendsResponse.data.friends);
        setGroups(groupsResponse.data.groups || []);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  const userEmail = session?.user?.email;

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setSelectedGroup(null);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setSelectedFriend(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col flex-1 p-8">
        <Header />
        <main className="flex-1 flex bg-white rounded-lg shadow-md">
          <div className="w-1/3 p-4 border-r border-gray-300">
            <h2 className="text-2xl font-bold">Friends</h2>
            {loading ? (
              <p>Loading friends...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <FriendsList 
                  friends={friends} 
                  onSelectFriend={handleSelectFriend} 
                  selectedFriend={selectedFriend} 
                />
                <h2 className="text-2xl font-bold mt-8">Groups</h2>
                <GroupsList 
                  groups={groups} 
                  onSelectGroup={handleSelectGroup} 
                  selectedGroup={selectedGroup} 
                />
              </>
            )}
          </div>
          <div className="flex-1 p-4">
            {selectedFriend ? (
              <ChatWindow friendEmail={selectedFriend.email as string} userEmail={userEmail as string} />
            ) : selectedGroup ? (
              <GroupChatWindow group={selectedGroup} userEmail={userEmail as string} />
            ) : (
              <p>Select a friend or group to start chatting</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
