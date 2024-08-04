// components/GroupChatWindow.tsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

interface Group {
  _id: string;
  name: string;
  members: string[];
}

interface GroupChatWindowProps {
  group: Group;  // Ensure only `group` is defined here
  userEmail: string;
}

interface Message {
  _id: string;
  senderEmail: string;
  content: string;
  timestamp: string;
}

const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ group, userEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(); // Connect to the socket server
    setSocket(newSocket);

    newSocket.emit('join-group', group._id);

    newSocket.on('group-message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [group._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/groups/messages/${group._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch group messages:', error);
      }
    };

    fetchMessages();
  }, [group._id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    const messageData = {
      groupId: group._id,
      senderEmail: userEmail,
      content: newMessage,
    };

    try {
      await axios.post('/api/groups/messages', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div key={message._id} className="my-2">
            <p>
              <strong>{message.senderEmail}</strong>: {message.content}
            </p>
            <p className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default GroupChatWindow;
