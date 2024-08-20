 

import React from 'react';

interface Message {
  senderEmail: string;
  content: string;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserEmail: string;  
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserEmail }) => {
  if (!Array.isArray(messages)) {
    console.error('Messages prop is not an array:', messages);
    return <p>Error loading messages.</p>;
  }

  return (
    <div className="p-4 space-y-4">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderEmail === currentUserEmail ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.senderEmail === currentUserEmail
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{msg.content}</p>
              <small className="block text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </small>
            </div>
          </div>
        ))
      ) : (
        <p>No messages to display</p>
      )}
    </div>
  );
};

export default MessageList;
