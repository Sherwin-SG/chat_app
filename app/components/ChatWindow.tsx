import React, { useEffect, useState, FormEvent, useRef } from 'react';
import MessageList from './MessageList';
import { Message } from '../types';
import io from 'socket.io-client';

const socket = io();

const ChatWindow: React.FC<{ userEmail: string; friendEmail: string }> = ({ userEmail, friendEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${userEmail}/${friendEmail}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error('Invalid data format:', data);
          setMessages([]); // Set to empty array if data is not valid
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]); // Set to empty array in case of an error
        setLoading(false);
      }
    };

    fetchMessages();

    // Listen for new messages
    const handleReceiveMessage = (message: Message) => {
      if (
        (message.senderEmail === userEmail && message.receiverEmail === friendEmail) ||
        (message.senderEmail === friendEmail && message.receiverEmail === userEmail)
      ) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      // Clean up the listener on component unmount
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [userEmail, friendEmail]);

  useEffect(() => {
    // Scroll to the bottom when messages are loaded or updated
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      senderEmail: userEmail,
      receiverEmail: friendEmail,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    // Emit the message via socket
    socket.emit('sendMessage', message);

    // Save the message to the database
    await fetch(`/api/messages/${userEmail}/${friendEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    // Clear the input field after sending the message
    setNewMessage('');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col h-[80vh] max-h-[80vh]">
      <div 
        ref={messageContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4"
      >
        <MessageList messages={messages} currentUserEmail={userEmail} />
      </div>
      <form onSubmit={handleSendMessage} className="flex p-4 border-t border-gray-300 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-grow p-2 border rounded-lg mr-2 bg-white text-black dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
