import React from 'react';
import { Message } from '../types';

interface GroupMessageListProps {
  messages: Message[];
}

const GroupMessageList: React.FC<GroupMessageListProps> = ({ messages }) => {
  console.log('Messages:', messages); // Log messages for debugging
  return (
    <div>
      {messages.map((message) => (
        <div key={message._id} className="message">
          <p><strong>{message.senderEmail}</strong>: {message.content}</p> {/* Ensure content is displayed */}
          <p className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupMessageList;
