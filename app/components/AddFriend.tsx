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
    <div className="flex flex-col items-center mt-4">
      <input
        type="email"
        value={friendEmail}
        onChange={(e) => setFriendEmail(e.target.value)}
        placeholder="Enter friend's email"
        className="w-full max-w-md px-4 py-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-black dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
      />
      <button
        onClick={addFriend}
        className="w-full max-w-md px-4 py-2 mb-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
      >
        Add Friend
      </button>
      {statusMessage && (
        <p className={`mt-2 ${statusMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default AddFriendButton;
