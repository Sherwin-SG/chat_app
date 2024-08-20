import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Group {
  _id: string;
  name: string;
  members: string[]; 
  description?: string;  
}

interface GroupChatWindowProps {
  group: Group;
  userEmail: string;
  userId: string;  
}

interface Message {
  _id: string;
  senderEmail: string;
  content: string;
  createdAt: string;
  groupId: string;
}

const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ group,userId,userEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const [description, setDescription] = useState(group.description || '');
  const [editingDescription, setEditingDescription] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

   
  const handleReceiveMessage = (message: Message) => {
    console.log('Received message:', message);  
    if (message.groupId === group._id) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  useEffect(() => {
     
    const socketIo = io();
    setSocket(socketIo);

    
    socketIo.on('receiveMessage', handleReceiveMessage);

     
    return () => {
      socketIo.off('receiveMessage', handleReceiveMessage);
      socketIo.disconnect();
    };
  }, [group._id]);  

  useEffect(() => {
     
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/groups/messages?groupId=${group._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch group messages:', error);
      }
    };

    fetchMessages();

     
    const fetchGroupMembers = async () => {
      try {
        const response = await axios.post('/api/groups/members', { memberIds: group.members });
        setMemberEmails(response.data.memberEmails);
      } catch (error) {
        console.error('Failed to fetch group member emails:', error);
      }
    };

    fetchGroupMembers();

     
    setDescription(group.description || '');
    setEditingDescription(false);
  }, [group._id, group.description, group.members]);

  useEffect(() => {
     
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

  const handleDescriptionUpdate = async () => {
    try {
      await fetch(`/api/groups/${group._id}/description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
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
          onClick={() => setShowDetails(!showDetails)}
        >
          {group.name}
        </h2>
        {showDetails && (
          <div className="mt-2">
            {editingDescription ? (
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleDescriptionUpdate}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingDescription(false)}
                  className="mt-2 ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 dark:text-gray-300">{description || 'No description'}</p>
                <button
                  onClick={() => setEditingDescription(true)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Edit Description
                </button>
              </div>
            )}
            <div className="mt-2">
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
      <form onSubmit={handleSendMessage} className="flex p-4 border-t border-gray-300 bg-white dark:bg-gray-800">
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
