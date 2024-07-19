import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

const AddFriend = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleAddFriend = async () => {
    if (!email) {
      setMessage('Please enter an email');
      return;
    }

    try {
      const response = await fetch('/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-email': session?.user?.email || '', // Send current user email as header
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Friend added successfully!');
      } else {
        setMessage(data.error || 'Failed to add friend');
      }
    } catch (error) {
      setMessage('An error occurred');
    }
  };

  return (
    <div className="p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter friend's email"
        className="p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleAddFriend}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Friend
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default AddFriend;
