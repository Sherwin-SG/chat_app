import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Group {
  _id: string;
  name: string;
  description: string;
  members: string[]; // memberIds
}

interface GroupChatWindowProps {
  group: Group;
  userEmail: string;
}

interface Message {
  _id: string;
  senderEmail: string;
  content: string;
  createdAt: string;
  groupId: string;
}

const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ group, userEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showMembersAndDescription, setShowMembersAndDescription] = useState(false);
  const [description, setDescription] = useState(group.description);
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketIo = io();

    // Set the socket connection
    setSocket(socketIo);

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/groups/messages?groupId=${group._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch group messages:', error);
      }
    };

    fetchMessages();

    // Fetch group member emails
    const fetchGroupMembers = async () => {
      try {
        const response = await axios.post('/api/groups/members', { memberIds: group.members });
        setMemberEmails(response.data.memberEmails);
      } catch (error) {
        console.error('Failed to fetch group member emails:', error);
      }
    };

    fetchGroupMembers();

    // Handle incoming messages
    const handleReceiveMessage = (message: Message) => {
      if (message.groupId === group._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socketIo.on('receiveMessage', handleReceiveMessage);

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
    };
  }, [group._id]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    const messageData = {
      groupId: group._id,
      senderEmail: userEmail,
      content: newMessage,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/groups/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      socket?.emit('sendMessage', messageData);

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleUpdateDescription = async () => {
    try {
      await axios.put(`/api/groups/${group._id}/description`, { description });
    } catch (error) {
      console.error('Failed to update description:', error);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[80vh]">
      {/* Header with Group Name */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors duration-200"
          onClick={() => setShowMembersAndDescription(!showMembersAndDescription)}
        >
          {group.name}
        </h2>
        {showMembersAndDescription && (
          <div className="mt-4">
            {/* Description Section */}
            <div className="mb-4">
              <textarea
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleUpdateDescription}
              />
            </div>

            {/* Members Section */}
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Members:</h3>
            <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
              {memberEmails.length === 0 ? (
                <li className="italic text-gray-500 dark:text-gray-500">No members</li>
              ) : (
                memberEmails.map((email) => (
                  <li key={email} className="text-sm">
                    {email}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p>No messages to display</p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.senderEmail === userEmail ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  message.senderEmail === userEmail
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">
                  <strong>{message.senderEmail === userEmail ? 'You' : message.senderEmail}</strong>: {message.content || 'No content'}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex p-4 border-t border-gray-300 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded-lg mr-2 bg-white text-black dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Type a message"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );
};

export default GroupChatWindow;
