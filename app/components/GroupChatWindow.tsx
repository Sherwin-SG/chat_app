import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Group {
  _id: string;
  name: string;
  members: string[];
}

interface GroupChatWindowProps {
  group: Group;
  userEmail: string;
}

interface Message {
  _id: string;
  senderEmail: string;
  content: string; // Ensure 'content' is used
  createdAt: string;
}

const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ group, userEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketIo = io();

    // Set the socket connection
    setSocket(socketIo);

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/groups/messages?groupId=${group._id}`);
        console.log('Fetched Messages:', response.data.messages); // Log fetched messages for debugging
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch group messages:', error);
      }
    };
    

    fetchMessages();

    // Listen for incoming messages
    socketIo.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
    };
  }, [group._id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    const messageData = {
      groupId: group._id,
      senderEmail: userEmail,
      content: newMessage, // Ensure 'content' is used
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

   return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <p>No messages to display</p>
        ) : (
          messages.map((message) => (
            <div key={message._id} className="my-2">
              <p>
                <strong>{message.senderEmail}</strong>: {message.content || 'No content'}
              </p>
              <p className="text-sm text-gray-500">
                {isNaN(new Date(message.createdAt).getTime()) ? 'Invalid date' : new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
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
