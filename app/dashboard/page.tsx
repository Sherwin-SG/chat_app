// Dashboard.tsx

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
import { Group } from '../types'; // Make sure this path is correct

interface Friend {
  _id: string;
  name?: string;
  email?: string;
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

  // Function to refetch groups list after leaving a group
  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups/list');
      setGroups(response.data.groups || []);
    } catch (error) {
      setError('Failed to fetch groups');
    }
  };

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setSelectedGroup(null);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setSelectedFriend(null);
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!session) {
      console.error('Session is not available');
      return;
    }
  
    try {
      await axios.post('/api/groups/leave', { groupId, userEmail: session.user.email });
      setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId));
      setSelectedGroup(null);
    } catch (error) {
      console.error('Failed to leave group', error);
    }
  };
  
  

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  const userId = session.user.id; // Assuming userId is available on session.user
  const userEmail = session.user.email; // Assuming userEmail is available on session.user

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col flex-1 p-8">
        <Header />
        <main className="flex-1 flex bg-white rounded-lg shadow-md">
          <div className="w-1/3 p-4 border-r border-gray-300 flex flex-col">
            <h2 className="text-2xl font-bold">Friends</h2>
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-650px)]">
              {loading ? (
                <p>Loading friends...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <FriendsList 
                  friends={friends} 
                  onSelectFriend={handleSelectFriend} 
                  selectedFriend={selectedFriend} 
                />
              )}
            </div>
            <div className="mt-8"> 
  <h2 className="text-2xl font-bold mt-8">Groups</h2>
  <div className="flex-1 overflow-y-auto max-h-[calc(100vh-600px)]">
    <GroupsList 
      groups={groups} 
      onSelectGroup={handleSelectGroup} 
      selectedGroup={selectedGroup} 
onLeaveGroup={handleLeaveGroup} // Pass the function as a prop

    />
  </div>
</div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-auto">
              {selectedFriend ? (
                <ChatWindow friendEmail={selectedFriend.email!} userEmail={userEmail} />
              ) : selectedGroup ? (
                <GroupChatWindow group={selectedGroup} userId={userId} userEmail={userEmail} />
              ) : (
                <p>Select a friend or group to start chatting</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
