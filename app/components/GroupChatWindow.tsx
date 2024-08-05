import React, { useState, useEffect, useRef } from 'react';
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
  content: string;
  createdAt: string;
}

const GroupChatWindow: React.FC<GroupChatWindowProps> = ({ group, userEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
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
        console.log('Fetched Messages:', response.data.messages);
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

  return (
    <div className="flex flex-col h-[80vh] max-h-[80vh]">
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
                className={`p-2 rounded-lg  ${
                  message.senderEmail === userEmail
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600'
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
