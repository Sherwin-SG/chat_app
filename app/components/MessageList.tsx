// app/components/MessageList.tsx

import React from 'react';

interface Message {
  senderEmail: string;
  content: string;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  if (!Array.isArray(messages)) {
    console.error('Messages prop is not an array:', messages);
    return <p>Error loading messages.</p>;
  }

  return (
    <div>
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.senderEmail}: {msg.content}</p>
            <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
          </div>
        ))
      ) : (
        <p>No messages to display</p>
      )}
    </div>
  );
};

export default MessageList;
