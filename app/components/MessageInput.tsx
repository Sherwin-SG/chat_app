import React, { ChangeEvent } from 'react';

interface MessageInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend }) => {
  return (
    <div>
      <textarea value={value} onChange={onChange} />
      <button onClick={onSend}>Send</button>
    </div>
  );
};

export default MessageInput;
