import React, { useState } from 'react';
import axios from 'axios';

const AddFriendButton = () => {
  const [friendEmail, setFriendEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const addFriend = async () => {
    try {
      const response = await axios.post('/api/friends/add', { email: friendEmail });

      if (response.status === 200) {
        setStatusMessage('Friend added successfully');
      } else {
        setStatusMessage(`Failed to add friend: ${response.data.message}`);
      }
    } catch (error) {
      setStatusMessage('Failed to add friend');
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={friendEmail}
        onChange={(e) => setFriendEmail(e.target.value)}
        placeholder="Enter friend's email"
      />
      <button onClick={addFriend}>Add Friend</button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default AddFriendButton;
