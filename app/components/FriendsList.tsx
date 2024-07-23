// app/components/FriendsList.tsx
import React from 'react';

interface Friend {
  _id: string;
  name?: string;
  email?: string;
}

interface FriendsListProps {
  friends: Friend[];
  onSelectFriend: (friend: Friend) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, onSelectFriend }) => {
  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <div
          key={friend._id}
          className="p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelectFriend(friend)}
        >
          <h3 className="text-lg font-semibold">{friend.name || friend.email}</h3>
          <p className="text-sm text-gray-600">{friend.email}</p>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;
