// app/components/ChatWindow.tsx

import React, { useEffect, useState, FormEvent } from 'react';
import MessageList from './MessageList';
import { Message } from '../types'; // Ensure correct import path

const ChatWindow: React.FC<{ userEmail: string; friendEmail: string }> = ({ userEmail, friendEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${userEmail}/${friendEmail}`);
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
  }, [userEmail, friendEmail]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/messages/${userEmail}/${friendEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });
      const data = await response.json();

      if (data.success) {
        setMessages(prevMessages => [...prevMessages, data.message]);
        setNewMessage('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <MessageList messages={messages} />
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
